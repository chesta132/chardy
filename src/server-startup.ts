import "server-only";

const validateEnv = () => {
  if (process.env.SKIP_ENV_VALIDATION) return;

  const REQUIRED_ENV = [
    // contact me is basically this web's main goal
    "MAILER_FROM",
    "MAILER_HOST",
    "MAILER_PASS",
    "MAILER_USER",
    "OWNER_EMAIL",

    // db
    "DATABASE_URL",

    // payload cms
    "PAYLOAD_SECRET",

    // cloudinary
    "CLOUDINARY_KEY",
    "CLOUDINARY_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_FOLDER",

    // allow without ai
    // "GEMINI_API_KEY",

    // allow without guestbook
    // "GITHUB_CLIENT_ID",
    // "GITHUB_CLIENT_SECRET",

    // required for security
    "NEXT_PUBLIC_TURNSTILE_SITE",
    "TURNSTILE_SECRET",
  ] as const;

  const MISSING_ENV = REQUIRED_ENV.filter((name) => !process.env[name]);

  if (MISSING_ENV.length > 0) {
    throw new Error(`Missing required environment variables:\n${MISSING_ENV.map((e) => `- ${e}`).join("\n")}`);
  }
};

validateEnv();
