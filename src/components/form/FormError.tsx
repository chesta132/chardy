"use client";

import { useRef } from "react";
import { gsap } from "gsap";
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
      gsap.set(ref.current, { height: "auto", opacity: 1 });
      const height = ref.current.offsetHeight;
      gsap.fromTo(ref.current, { opacity: 0, y: -4, height: 0 }, { opacity: 1, y: 0, height, duration: 0.25, ease: "power2.out" });
    } else {
      gsap.to(ref.current, {
        opacity: 0,
        y: -4,
        height: 0,
        duration: 0.2,
        ease: "power2.in",
      });
    }
  }, [isVisible]);

  return (
    <p ref={ref} className={cn("text-xs text-red-400 overflow-hidden opacity-0 h-0", className)} {...props}>
      {fieldErr}
    </p>
  );
};
