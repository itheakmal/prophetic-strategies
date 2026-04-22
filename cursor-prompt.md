# Cursor Prompt: Prophetic Strategies Backend

## Project Structure
- `app/`: Next.js app router pages and API route handlers.
  - `app/api/`: backend endpoints (`events`, `tribes`, `contact`, `admin/*`, `auth/*`).
  - `app/admin/`: operator UI (login + secured dashboard: overview, events, tribes, contacts, users).
  - `app/login`, `app/signup`: public auth entry pages.
  - `app/events/`, `app/map/`, `app/tribes/`: public feature pages consuming backend APIs.
- `components/`: reusable UI components.
  - `components/admin/`: admin shell navigation.
- `contexts/`: client-side interaction state.
- `data/`: legacy static seed source (used by `prisma/seed.ts`).
- `lib/`: backend architecture layers.
  - `lib/db/`: Prisma client singleton.
  - `lib/services/`: domain logic for events/tribes.
  - `lib/validation/`: Zod schemas.
  - `lib/auth/`: session and password helpers.
  - `lib/errors.ts`, `lib/logger.ts`, `lib/rate-limit.ts`, `lib/env.ts`.
- `prisma/`: schema + seed script for MySQL.
- `tests/`: reliability tests.

## Business Domain
- **Events**: canonical timeline entities with quotes, media, lessons, parallels, and interactive followups.
- **Tribes**: graph model for Meccan phase relationships (`nodes`, `links`, `kind`, optional notes).
- **Contact**: inbound submission pipeline with validation, persistence, anti-spam, throttling, and optional email notification.
- **Admin**: HTTP-only session cookie after `POST /api/admin/auth/login`; portal at `/admin` (overview + event/tribe create + contacts + users).
- **Public users**: can sign up/log in via `/signup` and `/login` using `/api/auth/*` session routes, recover via `/forgot-password` -> `/reset-password`, and access protected `/profile`.

## Core Commands
- Install deps: `yarn install`
- Run app: `yarn dev`
- Stable dev (watcher-safe): `yarn dev:stable`
- Build: `yarn build`
- Start production build: `yarn start`
- Lint: `yarn lint`
- Format: `yarn format`
- Run tests: `yarn test`
- Generate Prisma client: `yarn db:generate`
- Create/apply local migration: `yarn db:migrate`
- Deploy migrations: `yarn db:deploy`
- Seed DB: `yarn db:seed`

## Backend Implementation Conventions
- Keep route handlers thin: parse request, call service, return standardized `success/error` envelopes.
- Put business logic in `lib/services/*` and avoid direct Prisma queries in page components.
- Validate all input with Zod schemas in `lib/validation/*`.
- Use `ApiError` for typed errors and `errorResponse()` for consistent API responses.
- For admin routes, enforce `requireAdmin()` before data operations.

## Expandable MySQL Modeling Tips
- Prefer stable `id` keys with unique `slug`/`externalId` business keys.
- Use explicit join or child tables for extensible relations (`EventQuote`, `EventMedia`, `EventFollowupQuestion`, `TribeLink`).
- Add nullable fields first, backfill in seed/migration scripts, then tighten constraints in a later migration.
- Keep soft-delete support (`deletedAt`) for admin-editable entities.

## Admin portal
- Entry: `/admin` (redirects to `/admin/login` or `/admin/overview` depending on session).
- Sign in: `/admin/login` using `ADMIN_EMAIL` / `ADMIN_PASSWORD` from env.
- Secured pages live under `app/admin/(secure)/` with a server layout that calls `getAdminSession()` and redirects unauthenticated users to `/admin/login`.
- Client data uses `adminFetch()` in `lib/api/admin-browser.ts` (`credentials: 'include'`) so the session cookie is sent to `/api/admin/*`.
- Admin includes basic create forms for events/tribes and user management table + add user flow.
- Admin includes edit/delete controls for events, tribes, and users.

## DB Troubleshooting
- If Prisma seed/connect fails with `ER_CANNOT_RETRIEVE_RSA_KEY` or `Access denied for user ''@'localhost'`, verify adapter usage (`new PrismaMariaDb(connectionString)`) and set `DATABASE_URL` with `?allowPublicKeyRetrieval=true` (example: `mysql://user:pass@localhost:3306/prophetic_strategies?allowPublicKeyRetrieval=true`).

## Useful Developer Tips
- Add a new public API route:
  1. Create `app/api/<resource>/route.ts`
  2. Add validation schema in `lib/validation`
  3. Add service function in `lib/services`
  4. Return `successResponse()` / `errorResponse()`
- Add a new table/relation:
  1. Update `prisma/schema.prisma`
  2. Run `yarn db:migrate`
  3. Update `prisma/seed.ts`
  4. Run `yarn db:seed`
- Contact pipeline hardening checklist:
  - validate payload
  - reject honeypot field
  - throttle by IP
  - persist before side effects
  - log failure paths
- If data mismatch appears in UI, verify API output first (`/api/events`, `/api/events/[slug]`, `/api/tribes?phase=meccan`) before debugging components.
