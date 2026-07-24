import { MotionPreference } from "@/contexts/Preference";

export const withMotionDuration = (motion: MotionPreference, duration?: number) => (motion === "lite" ? 0 : duration);
