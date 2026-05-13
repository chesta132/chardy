import { SetGlobalError } from "@/contexts/GlobalError";
import { flattenError, ZodError } from "zod";
import { capital } from "@/libs/manipulate/string";
import { NectOutcomeError } from "nectify-js/actions";

/**
 * Maps any caught error to the global error state.
 */
export const handleError = (err: unknown, setError: SetGlobalError) => {
  if (err instanceof NectOutcomeError) {
    setError(new Error(err.data.message));
  } else if (err instanceof Error) {
    if (err.message.toLowerCase().includes("network")) {
      setError(new Error("Unable to connect to server. Check your connection."));
    } else {
      setError(new Error(err.message));
    }
  } else {
    setError(new Error("An unexpected error occurred."));
  }
};

/**
 * Like handleError but also sets field-level errors for form inputs.
 */
export const handleFormError = <T extends Record<string, string>>(
  err: unknown,
  setFormError: React.Dispatch<React.SetStateAction<T>>,
  setError: SetGlobalError,
) => {
  if (err instanceof NectOutcomeError) {
    if (err.data.fields) {
      const formattedFields = Object.entries(err.data.fields).reduce((acc, [field, value]) => ({ ...acc, [field]: capital(value || "") }), {});
      setFormError((prev) => ({ ...prev, ...formattedFields }));
      return;
    }
  } else if (err instanceof ZodError) {
    setFormError((prev) => ({ ...prev, ...flattenError(err).fieldErrors }));
    return;
  }
  handleError(err, setError);
};
