import { toast } from "sonner";
import { ZodError } from "zod";

export const toastError = (err: unknown, { fallback = "An error occured", unmatchSilent = false } = {}) => {
  const unMatch = (err: unknown) => {
    if (unmatchSilent) return err;
    else throw err;
  };
  // should be handled with useForm
  if (err instanceof ZodError) return unMatch(err);
  if (err instanceof Error) {
    fallback = err.message;
  }

  toast.error(fallback);
};
