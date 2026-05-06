import { capital } from "@/libs/manipulate/string";
import { Reply } from "../../reply";
import { ErrorReplyType } from "../../reply/types";
import { record } from "../../manipulate/object";
import { ServerErrorMessages } from "./messages";

interface RestError extends Omit<ErrorReplyType, "message" | "code" | "field"> {
  debug?: any;
  field?: Record<string, string>;
}
export type ServerErrorConfig =
  | { code: "CLIENT_FIELD"; deps: [err: { field: Record<string, string> } & Omit<RestError, "field">] }
  | { code: "MISSING_FIELDS"; deps: [err: { field: Record<string, string> | string[] } & Omit<RestError, "field">] }
  | { code: "INVALID_AUTH"; deps: [err?: RestError] }
  | { code: "NOT_FOUND"; deps: [err: { item: string; desc?: string } & RestError] }
  | { code: "TOO_MUCH_REQ"; deps: [err?: { desc?: string } & RestError] }
  | { code: "SERVER_ERROR"; deps: [err: RequireAtLeastOne<{ error: Error; message: string }> & RestError] }
  | { code: "FORBIDDEN"; deps: [err: { message: string } & RestError] }
  | { code: "CONFLICT"; deps: [err: { message: string } & RestError] }
export type ServerErrorCode = ServerErrorConfig["code"];

type Config<C> = Extract<ServerErrorConfig, { code: C }>;
type DepsOf<C extends ServerErrorCode> = Config<C>["deps"];

export class ServerError<C extends ServerErrorCode> extends ServerErrorMessages {
  private code: C;
  private deps: DepsOf<C>;

  constructor(code: C, ...deps: DepsOf<C>);
  constructor(error: ServerError<C>);

  constructor(codeOrError: C | ServerError<C>, ...depsOrRes: DepsOf<C> | [undefined]) {
    super();
    if (codeOrError instanceof ServerError) {
      this.code = codeOrError.code;
      this.deps = codeOrError.deps;
    } else {
      this.code = codeOrError;
      this.deps = depsOrRes as unknown as DepsOf<C>;
    }
  }

  exec(reply: Reply) {
    const { deps, code } = { code: this.code, deps: this.deps } as ServerErrorConfig;

    switch (code) {
      case "CLIENT_FIELD":
        reply.error({ ...deps[0], message: "Invalid values", code: "CLIENT_FIELD" });
        break;
      case "MISSING_FIELDS":
        const arrFields = Array.isArray(deps[0].field) ? [...new Set(deps[0].field)] : Object.keys(deps[0].field);
        const objFields = Array.isArray(deps[0].field) ? record(deps[0].field, "This field is required.") : deps[0].field;
        reply.error({
          ...deps[0],
          title: "Missing Fields",
          message: `${arrFields.length} is required`,
          code: "MISSING_FIELDS",
          field: objFields,
        });
        break;
      case "INVALID_AUTH":
        reply.error({
          ...deps[0],
          title: "Authentication Needed",
          message: "Please login to continue.",
          code: "INVALID_AUTH",
        });
        break;
      case "NOT_FOUND":
        reply.error({
          ...deps[0],
          title: "Not Found",
          message: `${capital(deps[0].item)} not found.${deps[0].desc ? ` ${capital(deps[0].desc)}` : ""}`,
          code: "NOT_FOUND",
        });
        break;
      case "TOO_MUCH_REQ":
        reply.error({
          ...deps[0],
          title: "Too many requests",
          message: `Too many actions. ${capital(deps[0]?.desc || "Please try again later")}`,
          code: "TOO_MUCH_REQUEST",
        });
        break;
      case "SERVER_ERROR":
        reply.error({
          ...deps[0],
          title: "Server Error",
          message: deps[0].message || "Internal server error",
          code: "SERVER_ERROR",
          details: deps[0].error?.message,
        });
        break;
      case "FORBIDDEN":
      case "CONFLICT":
        reply.error({ ...deps[0], code });
        break;
    }

    reply.debug(deps[0]?.debug).fail();
  }
}
