"use client";

import { record } from "@/libs/manipulate/object";
import { Payload } from "@/payloads";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { type ZodObject, type infer as ZodInfer, type ZodError, z, ZodType } from "zod";

export type FormGroup<T extends ZodObject> = {
  readonly form: [ZodInfer<T>, React.Dispatch<React.SetStateAction<ZodInfer<T>>>];
  readonly error: [Record<keyof ZodInfer<T>, string>, React.Dispatch<React.SetStateAction<Record<keyof ZodInfer<T>, string>>>];
  readonly validateForm: () => boolean;
  readonly resetForm: () => void;
  readonly updateField: <K extends keyof ZodInfer<T>>(field: K, value: ZodInfer<T>[K]) => void;
  readonly isDefault: () => boolean;
};
type FormErrorTranslations = ReturnType<typeof useTranslations<"Form.error">>;

export const useForm = <T extends ZodObject>(defaultVal: ZodInfer<T>, validator: T) => {
  type Inferred = ZodInfer<T>;
  const tErr = useTranslations("Form.error");
  const [form, setForm] = useState(defaultVal);
  const [error, setError] = useState(record(defaultVal, ""));

  const validateForm = () => {
    const parsed = validator.safeParse(form);
    if (!parsed.success) {
      setError((prev) => ({ ...prev, ...formatZodErrors(parsed.error, tErr) }));
    } else {
      setError(record(error, ""));
    }
    return parsed.success;
  };

  const updateField = <T extends keyof Inferred>(field: T, value: Inferred[T]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const fieldValidator = (validator.shape as any)[field];
    if (fieldValidator instanceof ZodType) {
      const validator = z.object({ [field]: fieldValidator });
      const parsed = validator.safeParse({ [field]: value });
      if (!parsed.success) {
        setError((prev) => ({ ...prev, ...formatZodErrors(parsed.error, tErr) }));
      } else if (error[field.toString()] !== "") {
        setError((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  const resetForm = () => {
    setForm(defaultVal);
    setError(record(defaultVal, ""));
  };

  const setFormError: typeof setError = (val) => {
    if (typeof val === "function") {
      setError((prev) => formatErrors(val(prev), tErr));
    } else {
      setError(formatErrors(val, tErr));
    }
  };

  const isDefault = () => {
    for (const key in form) {
      if (form[key] !== defaultVal[key]) return false;
    }
    return true;
  };

  return {
    form: [form, setForm],
    error: [error, setFormError],
    validateForm,
    resetForm,
    updateField,
    isDefault,
  } as FormGroup<T>;
};

const formatZodErrors = (zodError: ZodError, t: FormErrorTranslations) => {
  return Object.fromEntries(
    Object.entries<string[]>(z.flattenError(zodError).fieldErrors).map(([key, val]) => [key, val?.[0] ? localizeError(val[0], t) : ""]),
  );
};

const formatErrors = (errors: Record<string, string>, t: FormErrorTranslations) => {
  return Object.fromEntries(Object.entries(errors).map(([key, val]) => [key, val && localizeError(val, t)]));
};

const localizeError = (error: string, t: FormErrorTranslations) => {
  if (error in Payload.LOCALIZATION) return t(error);
  else return error;
};
