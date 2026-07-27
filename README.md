# chardy

Personal portfolio — Next.js 16 + Payload CMS 3. Semua konten dimanage lewat Payload admin panel, frontend fully server-rendered dengan i18n (EN/ID), plus AI chat assistant yang bisa jawab pertanyaan pake data portfolio langsung.

---

## Tech Stack

| Layer             | Tech                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router, React Compiler)                               |
| CMS               | Payload CMS 3 (self-hosted, same Next.js instance)                    |
| Database          | PostgreSQL (via `@payloadcms/db-vercel-postgres`)                     |
| Media             | Cloudinary (`payload-cloudinary`)                                     |
| Email             | Nodemailer + Resend SMTP                                              |
| AI                | Google Gemini (`@google/genai`) — chat + function calling             |
| Rate Limiting     | Upstash Redis (`@upstash/redis`)                                      |
| Error/Monitor     | Sentry (`@sentry/nextjs`)                                             |
| Analytics         | Umami                                                                 |
| i18n              | `next-intl` (EN + ID)                                                 |
| Animation         | GSAP + Lenis (smooth scroll)                                          |
| Styling           | Tailwind CSS v4                                                       |
| Validation        | Zod v4                                                                |
| HTTP/Action layer | `nectic` (route & server action wrapper — controller/service pattern) |

---

## Struktur Folder

```
src/
├── actions/          # Server Actions (entry point dari client)
├── app/
│   ├── (chardy)/     # Frontend routes (locale-aware)
│   │   └── [locale]/
│   │       ├── page.tsx           # Home
│   │       ├── projects/          # Project list & detail
│   │       ├── error-page/        # Error boundary page
│   │       └── forbidden/         # 403 page
│   ├── (payload)/    # Payload admin + API routes (auto-generated)
│   └── (api)/api/ai/chat/         # SSE streaming endpoint buat AI chat
├── cms/
│   ├── collections/  # Users, Media, Project, FeaturedProject
│   ├── globals/      # Hero, AboutMe, ContactMe, AIConfig
│   ├── crud/read.ts  # Semua data fetching + cache wrapper
│   └── cache.ts      # withCache(). Skip di dev, unstable_cache di prod
├── controllers/       # AIController (thin handler, delegasi ke service)
├── middlewares/        # AIMiddleware (conversation id via cookie)
├── components/
│   ├── home/         # Section components (Hero, AboutMe, ContactMe, FeaturedProjects)
│   ├── about-me/      # AboutMe subcomponents
│   ├── contact-me/   # ContactMeForm
│   ├── projects/     # ProjectCard, ProjectList, ProjectDetail
│   ├── ai/chat/       # AI chat panel & bubble UI
│   ├── form/         # FormLayout, FormInput (reusable form system)
│   ├── layouts/      # Topbar, Footer
│   ├── error/         # Error boundary components
│   └── ui/           # Button, Label, Globe, Marquee, TagInput, Toaster, Loading, dll
├── hooks/            # useForm, useTextReveal, useScrollDirection, useAutosizeTextarea, etc.
├── libs/
│   ├── ai/            # gemini.ts (agent loop), gemini.lib.ts (stream helpers), tools.ts, client.ts
│   ├── email/        # sendMail(), templates
│   ├── error/
│   │   ├── server/   # ServerError class + serialization
│   │   └── client/   # handleError(), handleFormError()
│   ├── redis/        # Upstash Redis instance
│   ├── gsap/          # GSAP setup/helpers
│   ├── github.ts       # GitHub calendar data fetch
│   ├── globe.ts        # Globe (cobe) config
│   └── manipulate/   # Utility: string, number, object, date
├── services/         # ContactService, AIService (business logic)
├── payloads/         # Zod schemas (ContactPayload, AIPayload, dll)
├── migrations/         # Payload DB migrations (auto-generated, jalan via `payload migrate`)
├── i18n/             # next-intl config, routing, request
├── contexts/         # GlobalError, SmoothScroll
├── payload.config.ts   # Payload CMS config
├── instrumentation.ts / instrumentation-client.ts  # Sentry init (server & client)
├── proxy.ts            # Middleware — i18n locale redirect
└── config.ts         # Semua env vars + app constants
```

---

## Setup Local

### 1. Jalanin infra (Postgres + Redis + Upstash proxy)

```bash
docker compose up -d
```

Ini spin up 3 container:

- `chardy-pg` — Postgres di port 5432
- `chardy-redis` — Redis di port 6379
- `upstash-proxy` — Serverless Redis HTTP proxy di port 8080 (biar `@upstash/redis` bisa jalan lokal)

### 2. Copy env

```bash
cp .env.example .env.local
```

Isi semua yang perlu diisi (lihat bagian [Environment Variables](#environment-variables)).

### 3. Install deps

```bash
pnpm install
```

### 4. Run dev

```bash
pnpm dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Payload Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000        # tanpa trailing path
NEXT_PUBLIC_ADMIN_URL=http://admin.localhost:3000 # tanpa trailing path

# Mailer (Resend SMTP)
MAILER_FROM="Chardy Notification <notif@chardy.dev>"
MAILER_HOST=smtp.resend.com
MAILER_PASS=re_xxx      # Resend API key
MAILER_USER=resend
OWNER_EMAIL=youremail@email.com     # Email tujuan notif contact form

# Payload CMS
PAYLOAD_SECRET=<base64_random_string>
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chardy

# Cloudinary
CLOUDINARY_KEY=<cloudinary_api_key>
CLOUDINARY_SECRET=<cloudinary_api_secret>
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
CLOUDINARY_FOLDER=/path/to/assets    # Folder di Cloudinary buat media

# Upstash Redis (lokal pakai upstash-proxy dari docker compose)
UPSTASH_REDIS_REST_URL=http://localhost:8080
UPSTASH_REDIS_REST_TOKEN=example_token

# AI (Gemini)
GEMINI_API_KEY=<aistudio_api_key>                  # API key dari Google AI Studio

# Analytics (Umami). Opsional
NEXT_PUBLIC_UMAMI_URL=https://your_umami_url.com/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<umami_id>

# Error monitoring (Sentry). Opsional, dipakai pas build/upload sourcemap
SENTRY_AUTH_TOKEN=<sentry_organization_token>
```

---

## Arsitektur & Key Decisions

### Payload CMS embedded di Next.js

Payload v3 jalan dalam satu instance Next.js yang sama — bukan service terpisah. Route `/admin` dan `/api` di-handle oleh `(payload)` route group yang auto-generated. Ini artinya satu deploy = satu app.

### Server Actions & Route Handler (bukan raw HTTP semua)

Sebagian besar interaksi client → server pakai Next.js Server Actions (`src/actions/`), lewat pattern controller/service dari `nectic`. Action jadi thin wrapper (middleware + controller), business logic tetap di layer `services/`. Pengecualian: AI chat pakai Route Handler (`app/(api)/api/ai/chat/route.ts`) karena butuh response streaming (SSE), yang gak bisa dilakuin lewat Server Action biasa.

### Error Handling Flow

```
Server throws ServerError(code, ...deps)
  → .flatten()  →  FlattenedServerError (object: { code, message, ...field })
  → nectic bungkus jadi outcome error → client terima sbg NectOutcomeError
  → handleError() / handleFormError() cek `err instanceof NectOutcomeError`
  → setFormError() (field errors, dari err.data.fields) atau setError() (global toast)
```

`ServerError` isinya cuma `code` + `deps` (bukan langsung message) — pesan human-readable & translasi-nya baru di-generate pas `.flatten()` dipanggil, pake `next-intl` sesuai locale (`withLocale()`). Route Handler nangkep ini lewat `ServerErrorRecover`, yang mapping tiap `code` ke HTTP status (`statusMap`) sebelum dibales ke client. Kalau ada `debug` field & lagi di prod, otomatis dikirim ke Sentry terus dihapus dari response biar gak bocor ke client.

### Caching

- Dev: `withCache` langsung call fungsi tanpa cache (biar perubahan CMS langsung keliatan)
- Prod: wrap dengan `unstable_cache`, revalidate setiap 1 hari, di-invalidate manual lewat `afterChange` hook tiap global/collection CMS (`updateTags` + `revalidatePaths`)

### Rate Limiting Contact Form

`ContactService` cek Redis sebelum kirim email: max 3 pesan per email per jam. Counter di-increment via Redis pipeline (non-blocking, fire-and-forget). Kalau Redis down, counter skip — by design, tradeoff availability > strict rate limit.

### AI Chat Assistant

Ada chat widget (`components/ai/chat`) yang ngobrol pake persona custom (nama & system prompt diatur lewat CMS global `AIConfig`), didukung Gemini (default model `gemini-2.5-flash-lite`, gampang diganti dari admin panel).

- **Agent loop + function calling**: `libs/ai/gemini.ts` jalanin agent loop, model bisa manggil tools yang didefinisiin di `libs/ai/tools.ts` (`getAboutMe`, `getHero`, `getContact`, `getProjects`) buat narik data portfolio langsung dari Payload — jadi jawaban AI selalu sinkron sama konten CMS, bukan hasil hardcode/hallucinate.
- **Streaming**: response di-stream via SSE dari route `api/ai/chat`, lalu di-"fake stream" ulang di client (`createGeneratorWithFakeStream`) biar animasi ketikannya smooth walau chunk asli dari Gemini datengnya gak rata.
- **Conversation history**: disimpen di Redis per `conversation_id` (cookie httpOnly, expire 3 hari) — ada dua bentuk yang disimpen: versi buat ditampilin ke UI (`Messages`) dan versi native Gemini `Content[]` buat context lanjutan.
- **Conversation id**: di-generate & di-set via `AIMiddleware`, dua varian — satu buat Route Handler (`extractConversationId`), satu buat Server Action (`actionExtractConversationId`).

### i18n

Semua routes ada prefix locale: `/en/...` dan `/id/...`. Default locale `en`. Translation files di `messages/en.json` dan `messages/id.json`. Middleware di `src/proxy.ts` handle redirect otomatis.

### Error Monitoring & Analytics

- **Sentry** — capture error server (`sentry.server.config.ts`), edge (`sentry.edge.config.ts`), dan client (`instrumentation-client.ts`), plus request error handler via `instrumentation.ts`.
- **Umami** — privacy-friendly analytics, opsional (skip kalau env var kosong).

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
| `media`            | Cloudinary-backed upload                                                               |
| `users`            | Payload auth                                                                           |

---

## Database Migrations

Migration di-generate otomatis oleh Payload di `src/migrations/`. Jalan otomatis pas build (`pnpm build` = `payload migrate && next build`). Buat generate migration baru manual setelah ubah schema collection/global:

```bash
pnpm payload migrate:create
```
