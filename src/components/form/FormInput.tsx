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

type FormTextareaProps = FormChildProps<React.ComponentProps<"textarea">> & {
  charLimit?: number;
};

export const FormTextarea = ({ field, ignoreError, charLimit, className, ...rest }: FormTextareaProps) => {
  const {
    form: {
      form: [val],
      updateField,
    },
  } = useFormLayout();

  const value = field ? val[field] : undefined;
  const currentLength = typeof value === "string" ? value.length : 0;
  const showCounter = charLimit !== undefined;
  const isOverLimit = showCounter && currentLength > charLimit;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => updateField(field as any, e.target.value)}
          aria-invalid={isOverLimit || undefined}
          className={`${showCounter ? "pb-6" : ""} ${isOverLimit ? "border-red-500" : ""} ${className ?? ""}`}
          {...rest}
        />
        {showCounter && (
          <span
            className={`pointer-events-none absolute bottom-2 right-3 text-xs ${
              isOverLimit ? "font-medium text-red-500" : "text-gray-500"
            }`}
          >
            {currentLength}/{charLimit}
          </span>
        )}
      </div>
      <FormFieldError field={field} ignoreError={ignoreError} />
    </div>
  );
};
