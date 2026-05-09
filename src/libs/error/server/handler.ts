import { Reply } from "@/libs/reply";
import { ServerError } from ".";

export const handleServerError = async (err: unknown, reply: Reply) => {
  const res = reply.reset();
  const error = err instanceof ServerError ? err : new ServerError("SERVER_ERROR", new Error((err as Error)?.message));
  await error.withLocale(error.locale).exec(res);
};
