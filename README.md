# Divine Prophetic Strategies – Interactive UI (Next.js + Tailwind v4)

Up-to-date Next.js App Router project configured for **Tailwind CSS v4** using the new PostCSS plugin.

## Install & Run

```bash
pnpm i   # or: npm i  OR: yarn
pnpm dev # or: npm run dev OR: yarn dev
```

## Already configured for Tailwind v4

- `postcss.config.mjs`

  ```js
  export default { plugins: { '@tailwindcss/postcss': {} } };
  ```

- `app/globals.css`

  ```css
  @import 'tailwindcss';
  ```

- `app/layout.tsx`
  ```ts
  import './globals.css';
  ```

Optional: `tailwind.config.ts` to tweak theme (not required by v4).

## Structure

- `app/page.tsx` — main UI
- `components/*` — modular components
- `data/event.ts` — content + media list
- `public/media/` — put your images/videos here

## Media

Replace placeholders in `data/event.ts` or use local files:

```ts
media: [
  { type: 'image', src: '/media/hilf-1.jpg', alt: 'illustration' },
  { type: 'video', src: '/media/clip.mp4', poster: '/media/poster.jpg' },
];
```

Set `media: []` to hide the carousel/gallery.

<!-- DEPLOYMENT INFRA MD -->

# Seerah App — Deployment Infrastructure README (Cloudflare-first)

This is a tiny, step-by-step guide to ship the Seerah app with **Frontend (Pages)**, **Media (R2)**, and **Backend + DB (Workers + Postgres)**. It’s optimized for very low cost at your current scale (≈$11/mo with backend, ≈$1/mo frontend-only).

> TL;DR monthly at your numbers: **Domain ~$1** + **R2 ~$0** + **Workers $5** + **DB $5 (Neon)** = **~$11/mo**. Frontend-only ≈ **$1/mo**.

---

## 0) Prereqs (one-time)

- Node 18+ and npm
- Git
- Cloudflare account with a zone (your domain) added
- **Wrangler CLI**: `npm i -g wrangler` then `wrangler login`

---

## 1) Domain & DNS (Cloudflare)

1. Add/transfer your domain to Cloudflare (free DNS + SSL).
2. Keep your main site at `app.<your-domain>` and API at `api.<your-domain>` (we’ll wire routes later).

---

## 2) Frontend on Cloudflare Pages

You can deploy any static build (Vite/React, Astro, Next static export).

### A) Create the project

```bash
# From your frontend repo root
wrangler pages project create seerah-app --production-branch=main
```

### B) Build & deploy

```bash
# Example for Vite/React
npm install
npm run build              # produces ./dist
wrangler pages deploy dist --project-name=seerah-app
```

### C) Custom domain for the frontend

In Cloudflare Dashboard → Pages → seerah-app → **Custom domains** → add `app.<your-domain>`.

### D) Frontend env vars (optional)

In Dashboard → Pages → seerah-app → **Settings → Environment variables** add, for example:

- `PUBLIC_MEDIA_BASE_URL = https://media.<your-domain>`
- `PUBLIC_API_BASE_URL = https://api.<your-domain>`

---

## 3) Media on R2 (images/audio/video)

### A) Create R2 bucket

```bash
wrangler r2 bucket create seerah-media
wrangler r2 bucket list
```

### B) Upload (example)

```bash
# single file
wrangler r2 object put seerah-media/events/1/cover.jpg --file=./media/events/1/cover.jpg

# directory sync (use rclone or AWS CLI S3-compatible sync)
# example with rclone (assuming it's configured for R2 S3 API)
# rclone sync ./media r2:seerah-media/media
```

### C) Make media publicly readable (custom domain)

Dashboard → R2 → seerah-media → **Public access**: enable anonymous READ.  
Dashboard → R2 → seerah-media → **Custom domain**: add `media.<your-domain>`.

> Result: Files resolve at `https://media.<your-domain>/events/{eventId}/...` with **$0 egress** when served via Cloudflare.

---

## 4) Database (Postgres ~1 GB)

Choose **one**:

### Option 1: Neon (lean, ~$5/mo)

1. Create project + database in Neon Dashboard.
2. Create a role and copy the **connection string**, e.g.
   `postgresql://USER:PASSWORD@HOST/db?sslmode=require`

### Option 2: Supabase (Micro ~$10/mo)

1. Create project.
2. Get `SUPABASE_DB_URL` (server connection), `SUPABASE_URL`, keys (anon/service).

> For Workers + Postgres, the simplest driver is Neon’s serverless client.

---

## 5) Backend API on Cloudflare Workers (optional)

Create a tiny Worker that reads/writes Postgres and R2.

### A) Scaffold

```bash
mkdir seerah-api && cd seerah-api
wrangler init --yes --type=esm
npm install @neondatabase/serverless
```

### B) `wrangler.toml`

```toml
name = "seerah-api"
main = "src/index.ts"
compatibility_date = "2025-08-26"

routes = [
  { pattern = "api.<your-domain>/*", zone_name = "<your-domain>" }
]

# R2 binding
r2_buckets = [
  { binding = "MEDIA", bucket_name = "seerah-media" }
]

[vars]
MEDIA_BASE_URL = "https://media.<your-domain>"
```

### C) Secrets

```bash
# Neon connection string (or use SUPABASE_DB_URL if picking Supabase)
wrangler secret put DATABASE_URL
```

### D) `src/index.ts` (example API)

```ts
import { neon } from '@neondatabase/serverless';

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === '/events' && request.method === 'GET') {
      const sql = neon(env.DATABASE_URL);
      // Minimal example: read events table
      const rows =
        await sql`select id, slug, title from events order by id limit 100`;
      return new Response(JSON.stringify(rows), {
        headers: { 'content-type': 'application/json' },
      });
    }

    if (url.pathname.startsWith('/media/') && request.method === 'GET') {
      // Example: stream a file from R2
      const key = url.pathname.replace('/media/', '');
      const obj = await env.MEDIA.get(key);
      if (!obj) return new Response('Not found', { status: 404 });
      return new Response(obj.body, {
        headers: {
          'content-type':
            obj.httpMetadata?.contentType || 'application/octet-stream',
        },
      });
    }

    return new Response('OK');
  },
} satisfies ExportedHandler;
```

### E) Deploy

```bash
npm run build   # if you have a build step; otherwise skip
wrangler deploy
```

### F) Wire custom domain

- DNS: Create a proxied `CNAME api` to `workers.dev` (Cloudflare UI will guide).
- Routes are already declared in `wrangler.toml` and applied on deploy.

> Test:

```bash
curl https://api.<your-domain>/events
curl -I https://media.<your-domain>/events/1/cover.jpg
```

---

## 6) Auth (optional, if you add logins)

- Use **Auth.js** on Workers/Pages Functions or a provider like Clerk (free up to large MAU).
- Store secrets (OAuth client/secret, JWT secret) in **Pages/Workers → Settings → Variables & Secrets**.

---

## 7) Environment Variables (summary)

- **Pages (frontend)**: `PUBLIC_MEDIA_BASE_URL`, `PUBLIC_API_BASE_URL`
- **Workers (backend)**: `DATABASE_URL`, `MEDIA_BASE_URL`
- **Auth (optional)**: `AUTH_SECRET`, `<PROVIDER>_CLIENT_ID`, `<PROVIDER>_CLIENT_SECRET`

---

## 8) Content layout suggestions

- R2 keys: `events/{eventId}/{assetName}` (e.g., `events/12/intro.mp3`, `events/12/cover.jpg`)
- JSON for event metadata (if frontend-only): `events/{eventId}/meta.json`
- Keep per-event **~10 MB** so 50 events ≈ **0.5 GB** total.

---

## 9) Expected monthly cost (at your numbers)

- **Domain**: ~$1/mo (≈$12/yr)
- **R2 (0.15–0.5 GB + tiny ops)**: ≈ $0.00–$0.01
- **Pages**: $0 (bandwidth included)
- **Workers (backend)**: $5 base
- **DB**: $5 (Neon) or $10 (Supabase)

**Total with backend**: ≈ **$11/mo** (Neon) or **$16/mo** (Supabase)  
**Frontend-only**: ≈ **$1/mo**

---

## 10) Rollout checklist

- [ ] Domain in Cloudflare; DNS orange-cloud proxy on `app` and `api`
- [ ] Pages project created and deployed; `app.<your-domain>` bound
- [ ] R2 bucket created; public read + `media.<your-domain>`
- [ ] Worker deployed at `api.<your-domain>`; secrets set
- [ ] DB created; migrations applied; `DATABASE_URL` secret set
- [ ] Smoke tests pass (`/events`, sample media URL)
- [ ] Backups/retention configured in DB vendor
