import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { events, createEvent, updateEvent, cancelEvent } from './data/events';
import { getRegistrationsForStudent, createRegistration, cancelRegistration } from './data/registrations';
import { getUserById } from './data/auth';

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
              // ignore
            }
          }

          res.setHeader('Content-Type', 'application/json');

          if (pathname === '/api/events') {
            if (method === 'GET') {
              res.statusCode = 200;
              res.end(JSON.stringify({ events }));
              return;
            }
            if (method === 'POST') {
              const organizerId = String(body.organizerId ?? '');
              const user = getUserById(organizerId);
              if (!user || user.role !== 'organizer') {
                res.statusCode = 403;
                res.end(JSON.stringify({ error: 'Organizer access required.' }));
                return;
              }
              const event = createEvent(
                {
                  name: String(body.name ?? ''),
                  description: String(body.description ?? ''),
                  date: String(body.date ?? ''),
                  venue: String(body.venue ?? ''),
                  category: body.category,
                  capacity: Number(body.capacity),
                },
                organizerId,
              );
              res.statusCode = 201;
              res.end(JSON.stringify({ event }));
              return;
            }
          }

          if (pathname.startsWith('/api/events/')) {
            const id = pathname.slice('/api/events/'.length);
            const organizerId = String(body.organizerId ?? '');
            const user = getUserById(organizerId);
            if (!user || user.role !== 'organizer') {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: 'Organizer access required.' }));
              return;
            }

            if (method === 'PATCH') {
              const event = updateEvent(id, organizerId, {
                name: String(body.name ?? ''),
                description: String(body.description ?? ''),
                date: String(body.date ?? ''),
                venue: String(body.venue ?? ''),
                category: body.category,
                capacity: Number(body.capacity),
              });
              res.statusCode = 200;
              res.end(JSON.stringify({ event }));
              return;
            }

            if (method === 'DELETE') {
              const event = cancelEvent(id, organizerId);
              res.statusCode = 200;
              res.end(JSON.stringify({ event }));
              return;
            }
          }

          if (pathname === '/api/registrations') {
            if (method === 'GET') {
              const studentId = urlObj.searchParams.get('studentId');
              if (!studentId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'studentId is required.' }));
                return;
              }
              const studentRegs = getRegistrationsForStudent(studentId);
              res.statusCode = 200;
              res.end(JSON.stringify({ registrations: studentRegs }));
              return;
            }

            if (method === 'POST') {
              const studentId = String(body.studentId ?? '');
              const eventId = String(body.eventId ?? '');
              if (!studentId) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Student login required.' }));
                return;
              }
              if (!eventId) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'eventId is required.' }));
                return;
              }
              const registration = createRegistration(studentId, eventId);
              res.statusCode = 201;
              res.end(JSON.stringify({ registration }));
              return;
            }
          }

          if (pathname.startsWith('/api/registrations/')) {
            const id = pathname.slice('/api/registrations/'.length);
            if (method === 'DELETE') {
              const studentId = String(body.studentId ?? '');
              if (!studentId) {
                res.statusCode = 401;
                res.end(JSON.stringify({ error: 'Student login required.' }));
                return;
              }
              const registration = cancelRegistration(id, studentId);
              res.statusCode = 200;
              res.end(JSON.stringify({ registration }));
              return;
            }
          }

          next();
        } catch (err: any) {
          const code = err.message || '';
          if (code === 'ALREADY_REGISTERED') {
            res.statusCode = 409;
            res.end(JSON.stringify({ error: 'You are already registered for this event.' }));
            return;
          }
          if (code === 'EVENT_FULL') {
            res.statusCode = 409;
            res.end(JSON.stringify({ error: 'This event has reached full capacity.' }));
            return;
          }
          if (code === 'FORBIDDEN') {
            res.statusCode = 403;
            res.end(JSON.stringify({ error: 'Forbidden' }));
            return;
          }
          if (code === 'EVENT_NOT_FOUND' || code === 'REGISTRATION_NOT_FOUND') {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: code }));
            return;
          }

          res.statusCode = 400;
          res.end(JSON.stringify({ error: code || 'An error occurred' }));
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
