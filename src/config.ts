export const OWNER_EMAIL = process.env.NEXT_PUBLIC_OWNER_EMAIL;
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://chardy.dev";

export const { MAILER_FROM, MAILER_HOST, MAILER_PASS, MAILER_USER } = process.env;

// general
export const APP_NAME = "Chardy";
export const FULL_APP_NAME = "Chesta Ardiona Landing Page";
export const REGION = "id-ID";
export const APP_DOMAIN = new URL(APP_URL).hostname;

// helpers
export const isDevEnv = () => process.env.NODE_ENV === "development";
export const isProdEnv = () => process.env.NODE_ENV === "production";
