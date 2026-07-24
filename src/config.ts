export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://chardy.dev";
export const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || APP_URL;
export const UMAMI_URL = process.env.NEXT_PUBLIC_UMAMI_URL;
export const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

export const {
  // mailer
  MAILER_FROM,
  MAILER_HOST,
  MAILER_PASS,
  MAILER_USER,
  OWNER_EMAIL,

  // db
  DATABASE_URL,

  // payload cms
  PAYLOAD_SECRET,

  // cloudinary
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,

  GEMINI_API_KEY,
} = process.env;

// general
export const APP_NAME = "Chardy";
export const FULL_APP_NAME = "Chesta Ardiona Landing Page";
export const REGION = "id-ID";
export const APP_DOMAIN = new URL(APP_URL).hostname;
export const LOCATION = "Bekasi, Jawa Barat, Indonesia";
export const OWNER_FIRSTNAME = "Chesta";
export const OWNER_LASTNAME = "Ardiona";
export const OWNER_FULLNAME = OWNER_FIRSTNAME + " " + OWNER_LASTNAME;

// ai
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash-lite";
export const DEFAULT_AI_NAME = "Fyuna";
export const DESKTOP_AI_PANEL_SIZES = {
  normal: { width: 320, height: 480 },
  expanded: { width: 480, height: 600 },
} as const;

// payload cms
export const INTERNAL_ADMIN_PATH = "/admin"; // following src/app/(payload)/admin

// helpers
export const isDevEnv = () => process.env.NODE_ENV === "development";
export const isProdEnv = () => process.env.NODE_ENV === "production";
