import { SetGlobalError } from "@/contexts/GlobalError";
import { ResponseError } from "../../api/serverResponse";
import { capital } from "../../manipulate/string";
import { flattenError, ZodError } from "zod";

/**
 * Maps any caught error to the global error state.
 */
export const handleError = (err: unknown, setError: SetGlobalError) => {
  if (err instanceof ResponseError) {
    setError(new Error(err.getMessage()));
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
  if (err instanceof ResponseError) {
    const fields = err.getField();
    if (fields) {
      const formattedFields = Object.entries(fields).reduce((acc, [field, value]) => ({ ...acc, [field]: capital(value || "") }), {});
      setFormError((prev) => ({ ...prev, ...formattedFields }));
      return;
    }
  }
  if (err instanceof ZodError) {
    setFormError((prev) => ({ ...prev, ...flattenError(err).fieldErrors }));
    return;
  }
  handleError(err, setError);
};
