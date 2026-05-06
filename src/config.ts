export const { APP_URL } = process.env;

// general
export const APP_NAME = "Chardy";
export const FULL_APP_NAME = "Chesta Ardiona Landing Page";

// helpers
export const isDevEnv = () => process.env.NODE_ENV === "development";
export const isProdEnv = () => process.env.NODE_ENV === "production";
