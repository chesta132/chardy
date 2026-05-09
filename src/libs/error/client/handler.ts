import { SetGlobalError } from "@/contexts/GlobalError";
import { flattenError, ZodError } from "zod";
import { FlattenedServerError, isServerError, ServerError } from "../server";
import { capital } from "@/libs/manipulate/string";

/**
 * Maps any caught error to the global error state.
 */
export const handleError = (err: unknown, setError: SetGlobalError) => {
  if (isServerError(err)) {
    setError(new Error(err.message));
    return;
  }
  if (err instanceof Error) {
    const flattened = ServerError.flattenFromString(err.message);
    if (flattened) {
      setError(new Error(flattened.message));
      return;
    } else if (err.message.toLowerCase().includes("network")) {
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
  const handleFlattenedError = (err: FlattenedServerError) => {
    if (err.field) {
      const formattedFields = Object.entries(err.field).reduce((acc, [field, value]) => ({ ...acc, [field]: capital(value || "") }), {});
      setFormError((prev) => ({ ...prev, ...formattedFields }));
      return;
    }
  };

  if (isServerError(err)) {
    handleFlattenedError(err);
    return;
  } else if (err instanceof Error) {
    const flattened = ServerError.flattenFromString(err.message);
    if (flattened && flattened.field) {
      handleFlattenedError(flattened);
      return;
    }
  } else if (err instanceof ZodError) {
    setFormError((prev) => ({ ...prev, ...flattenError(err).fieldErrors }));
    return;
  }
  handleError(err, setError);
};
