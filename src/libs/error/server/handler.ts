import { Reply } from "@/libs/reply";
import { ServerError } from ".";

export const handleServerError = (err: unknown, reply: Reply) => {
  const res = reply.reset();
  if (err instanceof ServerError) {
    new ServerError(err).exec(res);
    return;
  } else {
    res.error({ message: "Internal server error", code: "SERVER_ERROR", details: (err as Error).message || "Unknown error occured." }).fail();
  }
};
