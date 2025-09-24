# Copilot Instructions for Hilf al-Fudul UI (Next.js + Tailwind v4)

## Project Overview
- **Framework:** Next.js App Router (React, TypeScript)
- **Styling:** Tailwind CSS v4 (via PostCSS plugin)
- **Media:** Static files in `public/media/` referenced in `data/event.ts`
- **Components:** Modular, colocated in `components/`
- **Data:** Event and region data in `data/`

## Key Files & Structure
- `app/page.tsx`: Main UI entry
- `app/layout.tsx`, `app/globals.css`: Global layout and styles
- `components/`: All UI modules (e.g., `ArabiaMap.tsx`, `Badge.tsx`)
- `data/event.ts`: Event content, media list, metadata
- `public/media/`: Images/videos for gallery/carousel

## Build & Run
- Install: `pnpm i` (or `npm i`, `yarn`)
- Dev: `pnpm dev` (or `npm run dev`, `yarn dev`)
- Build: `pnpm build` (or `npm run build`, `yarn build`)
- Lint: `pnpm lint` (or `npm run lint`, `yarn lint`)

## Conventions & Patterns
- **Typed Routes:** Enabled in `next.config.mjs` (`typedRoutes: true`)
- **Static Media:** Images/videos are not optimized by Next.js (`images.unoptimized: true`)
- **TypeScript Paths:** Use `@/*` alias for root imports (see `tsconfig.json`)
- **Component Design:** Prefer small, focused components; colocate styles and logic
- **Data Loading:** Event/region data is imported from local files, not fetched from API
- **Media Gallery:** Controlled via `media` array in `data/event.ts`; empty array hides gallery
- **Dark Mode:** Enabled via Tailwind's `darkMode: 'class'`

## Deployment & Integration
- **Cloudflare-first:** See README for Pages (frontend), R2 (media), Workers (API), Neon/Supabase (DB)
- **Environment Variables:**
  - Frontend: `PUBLIC_MEDIA_BASE_URL`, `PUBLIC_API_BASE_URL`
  - Backend: `DATABASE_URL`, `MEDIA_BASE_URL`
- **Custom Domains:** Use `app.<your-domain>` for frontend, `api.<your-domain>` for backend

## Examples
- **Add a new event:**
  - Update `data/event.ts` with new event object and media references
  - Place media files in `public/media/`
- **Create a new component:**
  - Add to `components/`, import in relevant page/layout
- **Update theme:**
  - Edit `tailwind.config.ts` (font, colors, etc.)

## Tips for AI Agents
- Always update both data and media files for new events
- Use TypeScript and Next.js conventions (typed routes, module imports)
- Reference README for deployment and environment setup
- Avoid API calls for event/region data—use local imports
- Follow file naming and placement conventions for easy discoverability

---
For unclear workflows or missing conventions, ask the user for clarification or examples.
