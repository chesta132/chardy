import { AllowedMethods, ApiRequest, ApiResponse, FormattedHandlers, Handler, ParamValidator, QueryValidator } from "./types";
import { APP_URL } from "@/config";
import { Route } from ".";
import { zodErrorToServerError } from "@/libs/validators";
import { ZodArray, ZodObject } from "zod";

export const executeHandler = async (handler: Handler, req: ApiRequest, res: ApiResponse) => {
  return await handler(req as ApiRequest<never>, res);
};

export const cors = (req: ApiRequest, { reply }: ApiResponse, domain = APP_URL!) => {
  const header = {
    "Access-Control-Allow-Origin": domain,
    "Access-Control-Allow-Methods": Route.ALLOWED_METHODS.join(", "),
    "Access-Control-Allow-Headers": req.headers["access-control-request-headers"] || "Content-Type, X-Requested-With",
    "Access-Control-Allow-Credentials": "true",
  };

  reply.setHeader(new Headers(header));
};

export const preflight = (req: ApiRequest, res: ApiResponse) => {
  if (req.method !== "OPTIONS") return false;

  cors(req, res);
  res.reply.setHeader("Access-Control-Max-Age", "86400");
  res.reply.noContent();

  return true;
};

export const validatePayload = (from: any, validator: ZodObject | ZodArray, on: string) => {
  const valid = validator.safeParse(from);
  if (valid.error) {
    throw zodErrorToServerError(valid.error, from, on);
  }
  return valid.data;
};

export const validateQuery = (source: ApiRequest["query"], { param, query }: RequireAtLeastOne<{ param: ParamValidator; query: QueryValidator }>) => {
  const validator = (param && query ? param.extend(query.shape) : query ? query : param) as QueryValidator & ParamValidator;
  return validatePayload(source, validator, "query");
};

export const getAvailableMethod = (handlers: FormattedHandlers) => {
  return Object.entries(handlers)
    .filter((h) => typeof h[1][0] === "function")
    .map((h) => h[0]) as AllowedMethods[];
};
