"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/libs/gsap/register";
import { withMotionDuration } from "@/libs/gsap/utils";
import { usePreference } from "@/contexts/Preference";

const LISTBOX_ANIM = {
  openDuration: 0.2,
  itemDuration: 0.18,
  itemStagger: 0.03,
  itemDelay: 0.04,
  closeDuration: 0.15,
};

interface UseListboxAnimationOptions {
  listRef: React.RefObject<HTMLElement | null>;
  open: boolean;
}

export function useListboxAnimation({ listRef, open }: UseListboxAnimationOptions) {
  const { motion } = usePreference();
  const isAnimatingRef = useRef(false);

  const animateOpen = () => {
    const list = listRef.current;
    if (!list) return;

    list.hidden = false;
    isAnimatingRef.current = true;

    const items = list.querySelectorAll("[role='option']");

    gsap.fromTo(
      list,
      { opacity: 0, scaleY: 0.85, transformOrigin: "top center" },
      {
        opacity: 1,
        scaleY: 1,
        duration: withMotionDuration(motion, LISTBOX_ANIM.openDuration),
        ease: "power2.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      },
    );

    gsap.fromTo(
      items,
      { opacity: 0, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: withMotionDuration(motion, LISTBOX_ANIM.itemDuration),
        ease: "power2.out",
        stagger: LISTBOX_ANIM.itemStagger,
        delay: LISTBOX_ANIM.itemDelay,
      },
    );
  };

  const animateClose = (onComplete: () => void) => {
    const list = listRef.current;
    if (!list) {
      onComplete();
      return;
    }

    isAnimatingRef.current = true;

    gsap.to(list, {
      opacity: 0,
      scaleY: 0.85,
      transformOrigin: "top center",
      duration: withMotionDuration(motion, LISTBOX_ANIM.closeDuration),
      ease: "power2.in",
      onComplete: () => {
        list.hidden = true;
        isAnimatingRef.current = false;
        onComplete();
      },
    });
  };

  useEffect(() => {
    if (open) {
      animateOpen();
    } else {
      animateClose(() => {});
    }
  }, [open]);

  return { animateClose, animateOpen, isAnimatingRef };
}
