import { useGlobalError } from "@/contexts/GlobalError";
import { FormGroup } from "@/hooks/useForm";
import { handleFormError } from "@/libs/error/client/handler";
import { cn } from "@/libs/utils";
import { createContext, useContext, useState } from "react";
import type { z, ZodObject } from "zod";
import { FormInput, FormTextarea } from "./FormInput";
import { Turnstile } from "next-turnstile";
import { TURNSTILE_SITE } from "@/config";

type FormValues<F extends ZodObject = any> = { form: FormGroup<F> };

const FormContext = createContext<FormValues | null>(null);

export type FormSubmitFunc<F> = (event: React.SubmitEvent<HTMLFormElement>, formValue: z.infer<F>, turnstileToken?: string) => any;
export type FormChildProps<T> = T & { field?: string; ignoreError?: boolean };

type FormLayoutProps<F extends ZodObject, C extends boolean> = {
  asChild?: C;
  onFormSubmit?: C extends true ? never : FormSubmitFunc<F>;
  enableValidateForm?: boolean;
  resetAfterSubmit?: boolean;
  withTurnstile?: boolean;
} & (C extends true ? React.ComponentProps<"div"> : React.ComponentProps<"form">) &
  FormValues<F>;

export const FormLayout = <F extends ZodObject, C extends boolean = false>({
  form,
  asChild = false as C,
  onFormSubmit,
  className,
  children,
  enableValidateForm = true,
  resetAfterSubmit = false,
  withTurnstile,
  ...rest
}: FormLayoutProps<F, C>) => {
  const {
    form: [formVal],
    error: [_, setFormError],
    validateForm,
    resetForm,
  } = form;
  const [token, setToken] = useState<string>();
  const { setError } = useGlobalError();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (enableValidateForm && !validateForm()) return;
    if (withTurnstile && !token) return;
    try {
      await onFormSubmit?.(e, formVal, token);
      if (resetAfterSubmit) resetForm();
    } catch (err) {
      handleFormError(err, setFormError, setError);
    }
  };

  const Wrapper: React.ElementType = asChild ? "div" : "form";

  return (
    <FormContext value={{ form }}>
      <Wrapper className={cn("flex flex-col gap-2", className)} onSubmit={handleSubmit} {...(rest as any)}>
        {children}
        {withTurnstile && <Turnstile siteKey={TURNSTILE_SITE!} onVerify={setToken} />}
      </Wrapper>
    </FormContext>
  );
};

FormLayout.input = FormInput;
FormLayout.textarea = FormTextarea;

export const useFormLayout = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error(`useFormLayout must be used within a FormLayout`);
  return context;
};
