import { FormFieldError } from "./FormError";
import { FormChildProps, useFormLayout } from "./FormLayout";

export const FormInput = ({ field, ignoreError, ...rest }: FormChildProps<React.ComponentProps<"input">>) => {
  const {
    form: {
      form: [val],
      updateField,
    },
  } = useFormLayout();

  return (
    <div className="flex flex-col gap-1.5">
      <input value={field && val[field]} onChange={(e) => updateField(field as any, e.target.value)} {...rest} />
      <FormFieldError field={field} ignoreError={ignoreError} />
    </div>
  );
};

export const FormTextarea = ({ field, ignoreError, ...rest }: FormChildProps<React.ComponentProps<"textarea">>) => {
  const {
    form: {
      form: [val],
      updateField,
    },
  } = useFormLayout();

  return (
    <div className="flex flex-col gap-1.5">
      <textarea value={field && val[field]} onChange={(e) => updateField(field as any, e.target.value)} {...rest} />
      <FormFieldError field={field} ignoreError={ignoreError} />
    </div>
  );
};
