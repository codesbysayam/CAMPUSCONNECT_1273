import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { events, createEvent, updateEvent, cancelEvent, getEventById } from './data/events';
import {
  getRegistrationsForStudent,
  createRegistration,
  cancelRegistration,
  getRegistrationById,
  hasActiveRegistration,
} from './data/registrations';
import { validateCredentials, getUserById } from './data/auth';
import {
  generateAndStoreOtp,
  verifyUserOtp,
  createSession,
  destroySession,
  getAuthenticatedSession,
  parseSessionCookie,
  getSimulatedMailbox,
} from './lib/session';

function apiRoutesPlugin() {
  return {
    name: 'api-routes',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        try {
          const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
          const pathname = urlObj.pathname;
          const method = req.method?.toUpperCase() || 'GET';

          let bodyBuffer = '';
          if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
            for await (const chunk of req) {
              bodyBuffer += chunk;
            }
          }

          let body: any = {};
          if (bodyBuffer) {
            try {
              body = JSON.parse(bodyBuffer);
            } catch {
              // ignore invalid JSON
            }
          }

          res.setHeader('Content-Type', 'application/json');

          // ==========================================
          // AUTHENTICATION & OTP ROUTES
          // ==========================================

          // 1. POST /api/auth/login
          if (pathname === '/api/auth/login' && method === 'POST') {
            const email = String(body.email ?? '');
            const password = String(body.password ?? '');
            const expectedRole = body.expectedRole;

            const authResult = validateCredentials(email, password, expectedRole);
            if (!authResult.success || !authResult.user) {
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, error: 'Invalid email or password.' }));
              return;
            }

            // Generate cryptographically secure OTP and hash it before storage
            const otpResult = generateAndStoreOtp(authResult.user);

            res.statusCode = 200;
            // DO NOT return the OTP in response; return delivery confirmation
            res.end(
              JSON.stringify({
                success: true,
                requiresOtp: true,
                email: authResult.user.email,
                expiresAt: otpResult.expiresAt,
                message: 'Verification code sent to your registered email.',
              }),
            );
            return;
          }

          // 2. POST /api/auth/verify-otp
          if (pathname === '/api/auth/verify-otp' && method === 'POST') {
            const email = String(body.email ?? '');
            const otp = String(body.otp ?? '');

            const verifyResult = verifyUserOtp(email, otp);
            if (!verifyResult.success || !verifyResult.userId) {
              res.statusCode = 400;
              res.end(
                JSON.stringify({
                  success: false,
                  error: verifyResult.error || 'Invalid verification code.',
                }),
              );
              return;
            }

            const user = getUserById(verifyResult.userId);
            if (!user) {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, error: 'User account not found.' }));
              return;
            }

            // Create cryptographically secure authenticated session
            const { token, session } = createSession(user);

            // Set secure HttpOnly cookie
            res.setHeader(
              'Set-Cookie',
              `campus_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
            );

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                success: true,
                authenticated: true,
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  department: user.department,
                },
              }),
            );
            return;
          }

          // 3. GET /api/auth/me
          if (pathname === '/api/auth/me' && method === 'GET') {
            const session = getAuthenticatedSession(req);
            if (!session) {
              res.statusCode = 200;
              res.end(JSON.stringify({ authenticated: false }));
              return;
            }

            res.statusCode = 200;
            res.end(
              JSON.stringify({
                authenticated: true,
                user: {
                  id: session.userId,
                  name: session.name,
                  email: session.email,
                  role: session.userRole,
                },
              }),
            );
            return;
          }

          // 4. POST /api/auth/logout
          if (pathname === '/api/auth/logout' && method === 'POST') {
            const cookieToken = parseSessionCookie(req.headers?.cookie);
            if (cookieToken) {
              destroySession(cookieToken);
            }

            res.setHeader(
              'Set-Cookie',
              'campus_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
            );
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, message: 'Logged out successfully.' }));
            return;
          }

          // 5. GET /api/auth/dev-mailbox (Development simulated inbox viewer)
          if (pathname === '/api/auth/dev-mailbox' && method === 'GET') {
            const email = urlObj.searchParams.get('email');
            const messages = getSimulatedMailbox(email || undefined);
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, messages }));
            return;
          }

          // ==========================================
          // EVENT MANAGEMENT (PROTECTED)
          // ==========================================
          if (pathname === '/api/events') {
            if (method === 'GET') {
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, events }));
              return;
            }

            if (method === 'POST') {
              const session = getAuthenticatedSession(req);
              if (!session) {
                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, error: 'Login required' }));
                return;
              }
              if (session.userRole !== 'organizer') {
                res.statusCode = 403;
                res.end(JSON.stringify({ success: false, error: 'Organizer access required.' }));
                return;
              }

              // Server determines organizerId from session
              const event = createEvent(
                {
                  name: String(body.name ?? ''),
                  description: String(body.description ?? ''),
                  date: String(body.date ?? ''),
                  venue: String(body.venue ?? ''),
                  category: body.category,
                  capacity: Number(body.capacity),
                },
                session.userId,
              );
              res.statusCode = 201;
              res.end(JSON.stringify({ success: true, event }));
              return;
            }
          }

          if (pathname.startsWith('/api/events/')) {
            const id = pathname.slice('/api/events/'.length);
            const session = getAuthenticatedSession(req);
            if (!session) {
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, error: 'Login required' }));
              return;
            }
            if (session.userRole !== 'organizer') {
              res.statusCode = 403;
              res.end(JSON.stringify({ success: false, error: 'Organizer access required.' }));
              return;
            }

            const existingEvent = getEventById(id);
            if (!existingEvent) {
              res.statusCode = 404;
              res.end(JSON.stringify({ success: false, error: 'Event not found' }));
              return;
            }

            // Server-enforced organizer ownership check
            if (existingEvent.organizerId !== session.userId) {
              res.statusCode = 403;
              res.end(
                JSON.stringify({
                  success: false,
                  error: "You are not allowed to modify another organizer's event.",
                }),
              );
              return;
            }

            if (method === 'PATCH') {
              const event = updateEvent(id, session.userId, {
                name: String(body.name ?? ''),
                description: String(body.description ?? ''),
                date: String(body.date ?? ''),
                venue: String(body.venue ?? ''),
                category: body.category,
                capacity: Number(body.capacity),
              });
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, event }));
              return;
            }

            if (method === 'DELETE') {
              const event = cancelEvent(id, session.userId);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, event }));
              return;
            }
          }

          // ==========================================
          // REGISTRATION MANAGEMENT (PROTECTED)
          // ==========================================
          if (pathname === '/api/registrations') {
            // GET /api/registrations: derives user from session, ignores client query
            if (method === 'GET') {
              const session = getAuthenticatedSession(req);
              if (!session) {
                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, error: 'Login required' }));
                return;
              }

              // Server determines studentId exclusively from session
              const studentRegs = getRegistrationsForStudent(session.userId);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, registrations: studentRegs }));
              return;
            }

            // POST /api/registrations: derives studentId from session, prevents duplicates
            if (method === 'POST') {
              const session = getAuthenticatedSession(req);
              if (!session) {
                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, error: 'Login required' }));
                return;
              }
              if (session.userRole !== 'student') {
                res.statusCode = 403;
                res.end(JSON.stringify({ success: false, error: 'Only students can register for events.' }));
                return;
              }

              const eventId = String(body.eventId ?? '');
              if (!eventId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ success: false, error: 'eventId is required.' }));
                return;
              }

              // Duplicate active registration protection
              if (hasActiveRegistration(session.userId, eventId)) {
                res.statusCode = 409;
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'You are already registered for this event.',
                  }),
                );
                return;
              }

              // Server supplies studentId from authenticated session
              const registration = createRegistration(session.userId, eventId);
              res.statusCode = 201;
              res.end(JSON.stringify({ success: true, registration }));
              return;
            }
          }

          // DELETE /api/registrations/:id: server-enforced cancellation ownership
          if (pathname.startsWith('/api/registrations/')) {
            const id = pathname.slice('/api/registrations/'.length);
            if (method === 'DELETE') {
              const session = getAuthenticatedSession(req);
              if (!session) {
                res.statusCode = 401;
                res.end(JSON.stringify({ success: false, error: 'Login required' }));
                return;
              }

              const registration = getRegistrationById(id);
              if (!registration) {
                res.statusCode = 404;
                res.end(JSON.stringify({ success: false, error: 'Registration not found' }));
                return;
              }

              // CRITICAL OWNERSHIP CHECK: session user must be registration owner
              if (registration.studentId !== session.userId) {
                res.statusCode = 403;
                res.end(
                  JSON.stringify({
                    success: false,
                    error: 'You are not allowed to cancel this registration.',
                  }),
                );
                return;
              }

              const cancelled = cancelRegistration(id, session.userId);
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, registration: cancelled }));
              return;
            }
          }

          next();
        } catch (err: any) {
          const code = err.message || '';
          let status = 400;
          if (code.includes('already registered')) status = 409;
          else if (code.includes('full')) status = 409;
          else if (code.includes('not allowed') || code.includes('FORBIDDEN') || code.includes('cannot cancel')) status = 403;
          else if (code.includes('not found')) status = 404;
          else if (code.includes('logged in') || code.includes('Login required')) status = 401;

          res.statusCode = status;
          res.end(JSON.stringify({ success: false, error: code }));
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), apiRoutesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'next/link': path.resolve(__dirname, './next/link.tsx'),
        'next/navigation': path.resolve(__dirname, './next/navigation.ts'),
        'next/server': path.resolve(__dirname, './next/server.ts'),
        'next': path.resolve(__dirname, './next/index.ts'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
