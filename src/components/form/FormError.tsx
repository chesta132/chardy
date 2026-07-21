"use client";

import { useRef, useState } from "react";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";
import { FormChildProps, useFormLayout } from "./FormLayout";
import { useGSAP } from "@gsap/react";
import { usePreference } from "@/contexts/Preference";

export const FormFieldError = ({ field, className, ignoreError, ...props }: FormChildProps<React.ComponentProps<"p">>) => {
  const {
    form: {
      error: [err],
    },
  } = useFormLayout();
  const { motion } = usePreference();

  const fieldErr = err[field as keyof typeof err];
  const ref = useRef<HTMLParagraphElement>(null);
  const isVisible = !!fieldErr && !ignoreError;

  const [displayErr, setDisplayErr] = useState<string | undefined>(fieldErr);

  useGSAP(() => {
    if (!ref.current) return;

    gsap.killTweensOf(ref.current);

    if (isVisible) {
      setDisplayErr(fieldErr);
      if (motion === "lite") gsap.set(ref.current, { opacity: 1, y: 0, height: "auto" });
      else
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: -4, height: 0 },
          { opacity: 1, y: 0, height: "auto", duration: 0.25, ease: "power2.out" },
        );
    } else {
      gsap.to(ref.current, {
        opacity: 0,
        y: -4,
        height: 0,
        duration: motion === "lite" ? 0 : 0.2,
        ease: "power2.in",
        onComplete: () => setDisplayErr(undefined),
      });
    }
  }, [isVisible]);

  return (
    <p ref={ref} className={cn("text-xs text-red-400 overflow-hidden opacity-0 origin-top", className)} {...props}>
      {displayErr}
    </p>
  );
};
