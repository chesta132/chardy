"use client";

import { createContext, useContext, useEffect, useState } from "react";
import z from "zod";

export const motionPreference = ["full", "no-motion", "reduce"] as const;

type MotionPreference = (typeof motionPreference)[number];
type PreferenceValue = {
  motion: MotionPreference;
  setMotion: React.Dispatch<React.SetStateAction<MotionPreference>>;
};

const preferenceLocalState = z.object({
  motion: z.enum(motionPreference),
});
const preferenceLocalKey = "preferences";

const getLocalPreference = () => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(preferenceLocalKey);
    if (!item) return null;
    return preferenceLocalState.parse(JSON.parse(item));
  } catch {
    return null;
  }
};

const getMotionPreference = (): MotionPreference => {
  if (typeof window === "undefined") return "full";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduce" : "full";
};

export const PreferenceContext = createContext<PreferenceValue | null>(null);

export const PreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [motion, setMotion] = useState<MotionPreference>(() => getLocalPreference()?.motion || getMotionPreference());

  useEffect(() => {
    try {
      localStorage.setItem(preferenceLocalKey, JSON.stringify({ motion }));
    } catch (e) {
      console.error("Failed to save preference to localStorage", e);
    }
  }, [motion]);

  return <PreferenceContext.Provider value={{ motion, setMotion }}>{children}</PreferenceContext.Provider>;
};

export const usePreference = () => {
  const context = useContext(PreferenceContext);
  if (context === null) throw new Error("usePreference must be used within a PreferenceProvider");
  return context;
};
