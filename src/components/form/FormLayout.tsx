import { useGlobalError } from "@/contexts/GlobalError";
import { FormGroup } from "@/hooks/useForm";
import { handleFormError } from "@/libs/error/client/handler";
import { cn } from "@/libs/utils";
import { createContext, useContext } from "react";
import type { z, ZodObject } from "zod";
import { FormInput, FormTextarea } from "./FormInput";

type FormValues<F extends ZodObject = any> = { form: FormGroup<F> };

const FormContext = createContext<FormValues | null>(null);

export type FormSubmitFunc<F> = (event: React.SubmitEvent<HTMLFormElement>, formValue: z.infer<F>) => any;
export type FormChildProps<T> = T & { field?: string; ignoreError?: boolean };

type FormLayoutProps<F extends ZodObject, C extends boolean> = {
  asChild?: C;
  onFormSubmit?: C extends true ? never : FormSubmitFunc<F>;
  enableValidateForm?: boolean;
  resetAfterSubmit?: boolean;
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
  ...rest
}: FormLayoutProps<F, C>) => {
  const {
    form: [formVal],
    error: [_, setFormError],
    validateForm,
    resetForm,
  } = form;

  const { setError } = useGlobalError();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (enableValidateForm && !validateForm()) return;
    try {
      await onFormSubmit?.(e, formVal);
      if (resetAfterSubmit) resetForm();
    } catch (err) {
      await handleFormError(err, setFormError, setError);
    }
  };

  const Wrapper: React.ElementType = asChild ? "div" : "form";

  return (
    <FormContext value={{ form }}>
      <Wrapper className={cn("flex flex-col gap-2", className)} onSubmit={handleSubmit} {...(rest as any)}>
        {children}
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
