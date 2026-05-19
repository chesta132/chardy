"use client";

import { useRef } from "react";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";
import { FormChildProps, useFormLayout } from "./FormLayout";
import { useGSAP } from "@gsap/react";

export const FormFieldError = ({ field, className, ignoreError, ...props }: FormChildProps<React.ComponentProps<"p">>) => {
  const {
    form: {
      error: [err],
    },
  } = useFormLayout();

  const fieldErr = err[field as keyof typeof err];
  const ref = useRef<HTMLParagraphElement>(null);
  const isVisible = !!fieldErr && !ignoreError;

  useGSAP(() => {
    if (!ref.current) return;

    if (isVisible) {
      // Use scaleY + opacity instead of height to avoid layout recalc
      gsap.fromTo(
        ref.current,
        { opacity: 0, scaleY: 0, transformOrigin: "top center" },
        { opacity: 1, scaleY: 1, duration: 0.25, ease: "power2.out" },
      );
    } else {
      gsap.to(ref.current, {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  return (
    <p ref={ref} className={cn("text-xs text-red-400 overflow-hidden opacity-0", className)} {...props}>
      {fieldErr}
    </p>
  );
};
