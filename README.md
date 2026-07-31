# chardy

Personal portfolio built with Next.js 16 + Payload CMS 3. All content is managed through the Payload admin panel, the frontend is fully server-rendered with i18n (EN/ID), plus an AI chat assistant that answers questions using live portfolio data, and a public guestbook with GitHub OAuth authentication.

---

## Tech Stack

| Layer             | Tech                                                           |
| ----------------- | -------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router, React Compiler)                        |
| CMS               | Payload CMS 3 (self-hosted, same Next.js instance)             |
| Database          | PostgreSQL (via `@payloadcms/db-vercel-postgres`)              |
| Auth              | Better Auth (`better-auth`) with GitHub OAuth + admin plugin   |
| Media             | Cloudinary (`payload-cloudinary`)                              |
| Email             | Nodemailer + Resend SMTP                                       |
| AI                | Google Gemini (`@google/genai`) for chat with function calling |
| Rate Limiting     | Upstash Redis (`@upstash/redis`)                               |
| Error/Monitor     | Sentry (`@sentry/nextjs`)                                      |
| Analytics         | Umami                                                          |
| i18n              | `next-intl` (EN + ID)                                          |
| Animation         | GSAP + Lenis (smooth scroll)                                   |
| Styling           | Tailwind CSS v4                                                |
| Validation        | Zod v4                                                         |
| HTTP/Action layer | `nectic` (route & server action wrapper. I made it btw)        |

---

## Folder Structure

```
src/
├── actions/          # Server Actions (client entry points)
├── app/
│   ├── (chardy)/     # Frontend routes (locale-aware)
│   │   └── [locale]/
│   │       ├── page.tsx           # Home
│   │       ├── guestbook/         # Public guestbook page
│   │       ├── projects/          # Project list & detail
│   │       ├── error-page/        # Error boundary page
│   │       └── forbidden/         # 403 page
│   ├── (payload)/    # Payload admin + API routes (auto-generated)
│   └── (api)/api/ai/chat/         # SSE streaming endpoint for AI chat
├── cms/
│   ├── collections/  # Users, Media, Project, FeaturedProject, GuestbookEntry
│   ├── globals/      # Hero, AboutMe, ContactMe, AIConfig
│   ├── crud/read.ts  # All data fetching + cache wrappers (including getGuestbookEntries)
│   └── cache.ts      # cache for cms
├── controllers/      # Thin handlers, delegate to services
├── middlewares/      # Middleware for nectic
├── components/
│   ├── home/         # Section components (Hero, AboutMe, ContactMe, FeaturedProjects)
│   ├── about-me/     # AboutMe subcomponents
│   ├── contact-me/   # ContactMe subcomponents
│   ├── guestbook/    # Guestbook components
│   ├── projects/     # Project components
│   ├── ai/chat/      # AI chat panel & bubble UI
│   ├── form/         # FormLayout that integrated with useForm
│   ├── layouts/      # Topbar, Footer, etc.
│   ├── error/        # Error boundary components
│   └── ui/           # Button, Label, Marquee, TagInput, Toaster, Loading, etc.
├── hooks/            # useForm, useTextReveal, useScrollDirection, useAutosizeTextarea, etc.
├── libs/             # Library or helpers
│   ├── ai/           # gemini.ts (agent loop), gemini.lib.ts (stream helpers), tools.ts, client.ts
│   ├── auth-client.ts # Better Auth client
│   ├── email/        # Email setup & templates
│   ├── error/
│   │   ├── server/   # ServerError class + serialization
│   │   └── client/   # handleError(), handleFormError()
│   ├── redis/        # Upstash Redis instance
│   ├── gsap/         # GSAP setup/helpers
│   └── manipulate/   # Utilities: string, number, object, date
├── services/         # Business logic
├── payloads/         # Zod schemas for client-server communication
├── contexts/
│   ├── Guestbook.tsx        # GuestbookProvider in client-side state & CRUD
│   ├── PublicUserCache.tsx  # Caches public user profiles by id for guestbook entries
│   ├── GlobalError.tsx      # Global err boundaries
│   ├── Preference.tsx       # User preference
│   └── SmoothScroll.tsx     # Lenis context (consider using lenis's hook)
├── migrations/       # Payload DB migrations
├── drizzle-migrations/ # Drizzle migrations for auth tables (Better Auth)
├── i18n/             # next-intl config, routing, request
├── auth.ts           # Better Auth instance
├── auth-schema.ts    # Better auth's drizzle schema
├── payload.config.ts # Payload CMS config
├── instrumentation.ts & instrumentation-client.ts  # Sentry init (server & client)
├── proxy.ts          # Middlewares
└── config.ts         # All env vars + app constants
```

---

## Local Setup

### 1. Start infrastructure (Postgres + Redis + Upstash proxy)

```bash
docker compose up -d
```

This spins up 3 containers:

- `chardy-pg` — Postgres on port 5432
- `chardy-redis` — Redis on port 6379
- `upstash-proxy` — Serverless Redis HTTP proxy on port 8080 (so `@upstash/redis` works locally)

### 2. Copy env

```bash
cp .env.example .env.local
```

Fill in the required values (see [Environment Variables](#environment-variables)).

### 3. Install dependencies

```bash
pnpm install
```

### 4. Run dev server

```bash
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Payload Admin: [http://admin.localhost:3000](http://admin.localhost:3000)

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000        # no trailing slash
NEXT_PUBLIC_ADMIN_URL=http://admin.localhost:3000 # no trailing slash

# Mailer (Resend SMTP)
MAILER_FROM="Chardy Notification <notif@chardy.dev>"
MAILER_HOST=smtp.resend.com
MAILER_PASS=re_xxx      # Resend API key
MAILER_USER=resend
OWNER_EMAIL=youremail@email.com     # Destination email for contact form notifications

# Payload CMS
PAYLOAD_SECRET=<base64_random_string>

# DB
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chardy

# Cloudinary
CLOUDINARY_KEY=<cloudinary_api_key>
CLOUDINARY_SECRET=<cloudinary_api_secret>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_FOLDER=/path/to/assets    # Cloudinary folder for media uploads

# Upstash Redis (locally using upstash-proxy from docker compose)
UPSTASH_REDIS_REST_URL=http://localhost:8080
UPSTASH_REDIS_REST_TOKEN=example_token

# AI (Gemini)
GEMINI_API_KEY=<aistudio_api_key>                  # API key from Google AI Studio

# Analytics (Umami): optional
NEXT_PUBLIC_UMAMI_URL=https://your_umami_url.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<umami_id>

# Error monitoring (Sentry): optional, used during build to upload sourcemaps
SENTRY_AUTH_TOKEN=<sentry_organization_token>

# Better Auth
BETTER_AUTH_SECRET=<32_chars_generated>

# OAuth: GitHub
GITHUB_CLIENT_ID=<github_oauth_client_id>
GITHUB_CLIENT_SECRET=<github_oauth_client_secret>
```

---

## Architecture & Key Decisions

### Payload CMS embedded in Next.js

Payload v3 runs inside the same Next.js instance The `/admin` and `/api` routes are handled by the `(payload)` route group, which is auto-generated by Payload.

### Database Management

With Payload CMS and Better Auth, i can't use 1 schema and adapter. So, Payload use it's adapter (vercel pg adapter) and Better auth use drizle. While Better Auth use `public` schema, Payload use `payload` schema on DB.
It's pretty hard to migrate Payload schema from `public` to `payload`, but i can solve it. Look at `src/migrations/20260509_152917_init.ts` to see my approach.

### Server Actions & Route Handlers

Most client's server communication using Server Actions (`src/actions/`), with controller & service pattern that integrated with `nectic`.
The exception is AI chat, which uses a Route Handler (`app/(api)/api/ai/chat/route.ts`) because it needs SSE streaming that Server Actions can't do.

### Error Handling Flow

```
Server throws ServerError(code, ...deps)
  → .flatten()  →  FlattenedServerError (object: { code, message, ...field })
  → nectic wraps it as an outcome error → client receives it as NectOutcomeError
  → handleError() / handleFormError() checks `err instanceof NectOutcomeError`
  → setFormError() (field errors from err.data.fields) or setError() (global toast)
```

`ServerError` only holds a `code` + `deps` for human-readable message and translation are generated lazily when `.flatten()` is called, using `next-intl` with the current locale (`withLocale()`).
Route Handlers catch this via `ServerErrorRecover`, which maps each `code` to an HTTP status (`statusMap`) before sending the response.
Server Actions use Result type (rust-like) to get error state and send to client.
If a `debug` field is present in production, it's forwarded to Sentry and stripped from the response to avoid leaking internals.

### Caching

#### Server Side

- **Dev:** `withCache` calls the function directly with no caching, so CMS changes are visible immediately.
- **Prod:** wraps with `unstable_cache`, revalidates every 1 day, and is manually invalidated via `afterChange` hooks on each CMS global/collection (`updateTags` + `revalidatePaths`).

#### Client Side

- **User cache:** `PublicUserCacheContext` (`src/contexts/PublicUserCache.tsx`) caches public user profiles (name + avatar) by id to avoid redundant fetches.

### Contact Form Rate Limiting

`ContactService` checks Redis before sending an email: max 3 messages per email address per hour. The counter is incremented via a Redis pipeline (non-blocking, fire-and-forget). If Redis is down, the counter is skipped by design, availability wins over strict rate limiting.

### AI Chat Assistant

A chat widget (`components/ai/chat`) with a custom persona (name and system prompt configured via the `AIConfig` CMS global), powered by Gemini (default model `gemini-2.5-flash-lite`, swappable from the admin panel).

- **Agent loop + function calling:** `libs/ai/gemini.ts` runs the agent loop. The model can call tools defined in `libs/ai/tools.ts` to get my personal data via Payload CMS in live so AI responses always stay in sync with CMS content rather than hallucinating.
- **Streaming:** Responses are streamed via SSE from `api/ai/chat`, then "fake-streamed" again on the client (`createGeneratorWithFakeStream`) to keep the typing animation smooth even when Gemini chunks arrive unevenly.
- **Conversation history:** Stored in Redis per `conversation_id`. Two formats are stored: one for rendering in the UI (`Messages`) and one as native Gemini `Content[]` for conversation continuity.

### Guestbook

The `/guestbook` page is a public space where visitors can leave messages. Authentication is handled by **Better Auth** with GitHub OAuth.

- **Auth flow:** Visitors sign in via GitHub -> Better Auth handles the OAuth callback and persists the session to Drizzle tables.
  The `isAdmin` field is set in `mapProfileToUser`. If the user's email exists in the Payload `users` collection, they get `isAdmin: true`.
- **Client-side state:** `GuestbookContext` (`src/contexts/Guestbook.tsx`) manages entries on the client. Lazy-loaded when the `/guestbook` page is visited, paginated (10 entries per page) and optimistically updated after post/edit/delete.
- **Pinned entries:** Admins can pin entries via the Payload admin panel (the `pinned` field). Pinned entries are sorted to the top when the client orders the list.

### i18n

All routes are prefixed with a locale: `/en/...` and `/id/...`. The default locale is `en`. Translation files live in `messages/en.json` and `messages/id.json`. The middleware in `src/proxy.ts` handles automatic locale redirects.

### Error Monitoring & Analytics

- **Sentry:** captures server errors (`sentry.server.config.ts`), edge errors (`sentry.edge.config.ts`), and client errors (`instrumentation-client.ts`), with a request error handler via `instrumentation.ts`.
- **Umami:** privacy-friendly analytics, optional (skipped if the env var is empty).

---

## CMS Globals & Collections

### Globals (singleton content)

| Slug         | Fields                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| `hero`       | `title`, `subtitle` (localized)                                                            |
| `about-me`   | `stats` (yearsOfExp, projects, techs), `cardContent` (localized), `tools` (array of media) |
| `contact-me` | `socials` (github, linkedin, email)                                                        |
| `ai-config`  | `systemPrompt`, `model` (default `gemini-2.5-flash-lite`), `aiName` (default `Fyuna`)      |

### Collections

| Slug               | Fields                                                                                 |
| ------------------ | -------------------------------------------------------------------------------------- |
| `project`          | `title`, `tags`, `year`, `thumbnail`, `sites`, `description` (localized), `screenshot` |
| `featured-project` | `project` (relation), `order` (unique), `span` (full/wide/normal)                      |
| `guestbook-entry`  | `userId`, `message`, `pinned`, `isAdmin`                                               |
| `media`            | Cloudinary-backed upload                                                               |
| `users`            | Payload auth                                                                           |

---

## Database Migrations

### Payload migrations

Auto-generated by Payload in `src/migrations/`. They run automatically during build (`pnpm build` = `payload migrate && next build`). To manually generate a new migration after changing a collection or global schema:

```bash
pnpm payload migrate:create
```

### Drizzle migrations (Better Auth)

The auth tables (`users`, `sessions`, `accounts`, `verifications`) are managed by Drizzle ORM in `src/drizzle-migrations/`. To generate a new migration after changing `auth-schema.ts`:

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```
