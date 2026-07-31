import { isDevEnv } from "@/config";
import { AppRouterHandler, RecoverFunc } from "nectic/route";
import { createReply } from "nectic/server";
import { ServerError } from ".";

export const statusMap: {
  code: string[];
  status: number;
}[] = [
  { code: ["INVALID_AUTH", "INVALID_TOKEN"], status: 401 },
  { code: ["FORBIDDEN"], status: 403 },
  { code: ["NOT_FOUND"], status: 404 },
  { code: ["CLIENT_FIELD", "MISSING_FIELDS"], status: 406 },
  { code: ["IS_RECYCLED", "NOT_RECYCLED", "CONFLICT"], status: 409 },
  { code: ["TOO_MUCH_REQUEST"], status: 429 },
  { code: ["SERVER_ERROR"], status: 500 },
  { code: ["BAD_GATEWAY"], status: 502 },
];

export const ServerErrorRecover: RecoverFunc<AppRouterHandler> = async (err, req, res) => {
  const reply = createReply({ req, res, statusMap, debugMode: isDevEnv() });
  if (err instanceof ServerError) {
    return reply.error(await err.flatten()).fail();
  } else {
    return reply.error({ code: "SERVER_ERROR", message: "Unknown error" }).fail();
  }
};
