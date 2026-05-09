export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://chardy.dev";

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

// helpers
export const isDevEnv = () => process.env.NODE_ENV === "development";
export const isProdEnv = () => process.env.NODE_ENV === "production";
