# Campus Connect

Campus Connect is a simple college event management platform that helps students discover campus events, register for them, and manage their registrations. Organizers can create and manage events from an organizer dashboard.

## Features

### Students

- Browse upcoming campus events
- Search events by name
- Filter events by category
- Sort events by date or registration popularity
- View event details
- Register for events
- Prevent duplicate registrations
- Prevent registration for full, past, or cancelled events
- See available seats
- View upcoming and past registrations
- Cancel registrations
- Automatically restore a seat after cancellation

### Organizers

- Access an organizer dashboard
- Create events
- Edit events
- Cancel events
- Delete events
- Validate event name, date, venue, category, and capacity
- Manage only the events assigned to the current organizer

## Application Behavior

- Student and organizer roles are supported
- Cancelled events are hidden from normal student event listings
- Cancelled registrations are not counted as active registrations
- Event seat counts stay synchronized with registrations
- Missing events and empty search results are handled gracefully
- API errors are handled with user-friendly messages

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** CSS
- **Testing:** Vitest
- **Package Manager:** npm
- **Deployment:** Vercel
- **Data:** In-memory seed data

> The current project uses seeded in-memory data. Data is reset when the application/server is restarted.

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd campus-connect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open:
[http://localhost:3000](http://localhost:3000)

### 4. Run tests

```bash
npm run test
```

If your project contains lint and build scripts, you can also run:

```bash
npm run lint
npm run build
```

## Project Structure

```
CampusConnect/
├── app/
│   ├── events/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── organizer/
│   │   └── page.tsx
│   ├── registrations/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   └── Shared UI components
│
├── data/
│   ├── auth.ts
│   ├── events.ts
│   └── registrations.ts
│
├── tests/
│   └── Application tests
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## How It Works

### Event Discovery

Students can browse upcoming events and narrow the results using search and category filters.

Search is:
- Partial
- Case-insensitive
- Compatible with category filtering

Events can also be displayed using:
- Default order
- Date order
- Registration popularity

### Registration

Before creating a registration, the application checks that:
- The user is a student
- The event exists
- The event is not cancelled
- The event has not already passed
- Seats are available
- The student does not already have an active registration

A successful registration decreases the available seat count.

### Cancellation

When a student cancels an active registration:
- The registration is cancelled
- The available seat count increases
- The cancelled registration is no longer treated as active

### Organizer Management

Organizers can manage their events through the Organizer dashboard.

Event validation includes:
- Required event name
- Required description
- Required venue
- Required category
- Future date and time
- Positive event capacity

## Live Application

Campus Connect:
[https://campusconnect1273.vercel.app/](https://campusconnect1273.vercel.app/)

## Testing Checklist

Before deploying changes, verify:
- [x] Event search works
- [x] Category filtering works
- [x] Search and category filtering work together
- [x] Default event order works
- [x] Date sorting works
- [x] Popularity sorting works
- [x] Empty search results are handled
- [x] Event details work
- [x] Missing events are handled
- [x] Registration works
- [x] Duplicate registration is blocked
- [x] Full events cannot be registered for
- [x] Past events cannot be registered for
- [x] Cancelled events cannot be registered for
- [x] Seat counts update after registration
- [x] Student cancellation works
- [x] Seat counts update after cancellation
- [x] Cancelled registrations are not counted as active
- [x] Organizer event creation works
- [x] Organizer event editing works
- [x] Organizer event cancellation works
- [x] Organizer event deletion works
- [x] Invalid event data is rejected
- [x] Students cannot access organizer-only actions

## Deployment

The application is deployed on Vercel.

Production URL:
[https://campusconnect1273.vercel.app/](https://campusconnect1273.vercel.app/)

For a new deployment:
1. Push changes to the Git repository.
2. Connect the repository to Vercel.
3. Vercel will build and deploy the Next.js application.

## Notes

Campus Connect is designed as a lightweight college event management application. The current version uses seeded in-memory data rather than a production database or full authentication system.

The project is intentionally kept simple so that the core event discovery, registration, cancellation, and organizer management flows are easy to understand and demonstrate.
