"use client";

import { useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(ref: React.RefObject<T | null>, onOutsideClick: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onOutsideClick();
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [ref, onOutsideClick, enabled]);
}
