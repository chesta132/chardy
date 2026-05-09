# chardy

Personal portfolio — Next.js 15 + Payload CMS 3. Semua konten dimanage lewat Payload admin panel, frontend fully server-rendered dengan i18n (EN/ID).

---

## Tech Stack

| Layer         | Tech                                               |
| ------------- | -------------------------------------------------- |
| Framework     | Next.js 16 (App Router)                            |
| CMS           | Payload CMS 3 (self-hosted, same Next.js instance) |
| Database      | PostgreSQL (via `@payloadcms/db-postgres`)         |
| Media         | Cloudinary (`payload-cloudinary`)                  |
| Email         | Nodemailer + Resend SMTP                           |
| Rate Limiting | Upstash Redis (`@upstash/redis`)                   |
| i18n          | `next-intl` (EN + ID)                              |
| Animation     | GSAP + Lenis (smooth scroll)                       |
| Styling       | Tailwind CSS v4                                    |
| Validation    | Zod v4                                             |

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
│   │       └── error.tsx          # Error boundary
│   └── (payload)/    # Payload admin + API routes (auto-generated)
├── cms/
│   ├── collections/  # Users, Media, Project, FeaturedProject
│   ├── globals/      # Hero, AboutMe, ContactMe
│   ├── crud/read.ts  # Semua data fetching + cache wrapper
│   └── cache.ts      # withCache() — skip di dev, unstable_cache di prod
├── components/
│   ├── home/         # Section components (Hero, AboutMe, ContactMe, FeaturedProjects)
│   ├── contact-me/   # ContactMeForm
│   ├── projects/     # ProjectCard, ProjectList, ProjectDetail
│   ├── form/         # FormLayout, FormInput (reusable form system)
│   ├── layouts/      # Topbar, Footer
│   └── ui/           # Button, Label, Globe, Loading, dll
├── hooks/            # useForm, useTextReveal, useScrollDirection, useAutosizeTextarea
├── libs/
│   ├── email/        # sendMail(), templates, notifyError()
│   ├── error/
│   │   ├── server/   # ServerError class + serialization
│   │   └── client/   # handleError(), handleFormError()
│   ├── redis/        # Upstash Redis instance
│   └── manipulate/   # Utility: string, number, object, date
├── services/         # ContactService (business logic)
├── payloads/         # Zod schemas (ContactPayload, dll)
├── i18n/             # next-intl config, routing, request
├── contexts/         # GlobalError, SmoothScroll
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
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Mailer (Resend SMTP)
MAILER_FROM="Chardy Notification <notif@chardy.dev>"
MAILER_HOST=smtp.resend.com
MAILER_PASS=re_xxx
MAILER_USER=resend
OWNER_EMAIL=youremail@email.com     # Email tujuan notif contact form

# Payload CMS
PAYLOAD_SECRET=xxx                  # Random string, bebas
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/chardy

# Cloudinary
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_FOLDER=path/to/assets    # Folder di Cloudinary buat media

# Upstash Redis (lokal pakai upstash-proxy dari docker compose)
UPSTASH_REDIS_REST_URL=http://localhost:8080
UPSTASH_REDIS_REST_TOKEN=example_token
```

> Di prod, `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` ganti ke actual Upstash credentials.

---

## Arsitektur & Key Decisions

### Payload CMS embedded di Next.js

Payload v3 jalan dalam satu instance Next.js yang sama — bukan service terpisah. Route `/admin` dan `/api` di-handle oleh `(payload)` route group yang auto-generated. Ini artinya satu deploy = satu app.

### Server Actions (bukan HTTP API)

Contact form dulu pakai HTTP API endpoint, sekarang pakai Next.js Server Actions (`src/actions/contact.ts`). Action cuma jadi thin wrapper ke `ContactService`, error handling tetap di layer service.

### Error Handling Flow

```
Server throws ServerError
  → .flattenToString()  →  JSON string
  → client catch di FormLayout.handleSubmit
  → handleFormError() parse JSON string
  → setFormError() (field errors) atau setError() (global toast)
```

`ServerError` bisa di-serialize ke string dan di-parse balik di client. Ini penting karena Server Actions cuma bisa throw/return serializable values.

### Caching

- Dev: `withCache` langsung call fungsi tanpa cache (biar perubahan CMS langsung keliatan)
- Prod: wrap dengan `unstable_cache`, revalidate setiap 1 hari

### Rate Limiting Contact Form

`ContactService` cek Redis sebelum kirim email: max 3 pesan per email per jam. Counter di-increment via Redis pipeline (non-blocking, fire-and-forget). Kalau Redis down, counter skip — by design, tradeoff availability > strict rate limit.

### i18n

Semua routes ada prefix locale: `/en/...` dan `/id/...`. Default locale `en`. Translation files di `messages/en.json` dan `messages/id.json`. Middleware di `src/proxy.ts` handle redirect otomatis.

---

## CMS Globals & Collections

### Globals (singleton content)

| Slug         | Fields                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------ |
| `hero`       | `title`, `subtitle` (localized)                                                            |
| `about-me`   | `stats` (yearsOfExp, projects, techs), `cardContent` (localized), `tools` (array of media) |
| `contact-me` | `socials` (github, linkedin, email)                                                        |

### Collections

| Slug               | Fields                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `project`          | `title`, `tags`, `year`, `thumbnail`, `liveSite`, `description` (localized), `screenshot` |
| `featured-project` | `project` (relation), `order` (unique), `span` (full/wide/normal)                         |
| `media`            | Cloudinary-backed upload                                                                  |
| `users`            | Payload auth                                                                              |

---

## Prod Checklist

- [ ] Semua env vars terisi
- [ ] `og-image.png` ada di `/public` (1200x630px)
- [ ] Upstash credentials ganti ke yang production
- [ ] Jangan langsung ke /. Masuk ke /admin dulu, hindari data kosong & dicache
- [ ] Payload admin: bikin user pertama, isi semua globals (Hero, AboutMe, ContactMe) — kalau kosong halaman bakal error
- [ ] Test contact form end-to-end (kirim email + rate limit)
