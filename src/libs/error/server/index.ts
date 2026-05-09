import { capital } from "@/libs/manipulate/string";
import { Reply } from "../../reply";
import { ErrorReplyType } from "../../reply/types";
import { record } from "../../manipulate/object";
import { ServerErrorMessages } from "./messages";
import { Locale } from "@/i18n/types";
import { getTranslations } from "next-intl/server";
import { getServerTranslations } from "@/i18n/server";

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
  | { code: "CONFLICT"; deps: [err: { message: string } & RestError] };
export type ServerErrorCode = ServerErrorConfig["code"];

type Config<C> = Extract<ServerErrorConfig, { code: C }>;
type DepsOf<C extends ServerErrorCode> = Config<C>["deps"];

export class ServerError<C extends ServerErrorCode> extends ServerErrorMessages {
  private code: C;
  private deps: DepsOf<C>;
  readonly locale: Locale = "en";

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

  withLocale(locale: Locale) {
    (this.locale as Locale) = locale;
    return this;
  }

  async exec(reply: Reply) {
    const t = await getServerTranslations(this.locale);
    const { deps, code } = { code: this.code, deps: this.deps } as ServerErrorConfig;

    switch (code) {
      case "CLIENT_FIELD":
        reply.error({ ...deps[0], message: t("Error.ServerError.CLIENT_FIELD.message"), code: "CLIENT_FIELD" });
        break;
      case "MISSING_FIELDS":
        const arrFields = Array.isArray(deps[0].field) ? [...new Set(deps[0].field)] : Object.keys(deps[0].field);
        const fieldVal = t("Error.ServerError.MISSING_FIELDS.fieldVal");
        const objFields = Array.isArray(deps[0].field) ? record(deps[0].field, fieldVal) : deps[0].field;
        reply.error({
          ...deps[0],
          title: "Missing Fields",
          message: t("Error.ServerError.MISSING_FIELDS.message", { count: arrFields.length }),
          code: "MISSING_FIELDS",
          field: objFields,
        });
        break;
      case "INVALID_AUTH":
        reply.error({
          ...deps[0],
          title: t("Error.ServerError.INVALID_AUTH.title"),
          message: t("Error.ServerError.INVALID_AUTH.message"),
          code: "INVALID_AUTH",
        });
        break;
      case "NOT_FOUND":
        reply.error({
          ...deps[0],
          title: t("Error.ServerError.NOT_FOUND.title"),
          message: `${t("Error.ServerError.NOT_FOUND.message", { item: deps[0].item })}${deps[0].desc ? ` ${capital(deps[0].desc)}` : ""}}`,
          // message: `${capital(deps[0].item)} not found.${deps[0].desc ? ` ${capital(deps[0].desc)}` : ""}`,
          code: "NOT_FOUND",
        });
        break;
      case "TOO_MUCH_REQ":
        reply.error({
          ...deps[0],
          title: t("Error.ServerError.TOO_MUCH_REQ.title"),
          message: `${t("Error.ServerError.TOO_MUCH_REQ.message")} ${capital(deps[0]?.desc || t("Error.ServerError.TOO_MUCH_REQ.desc"))}`,
          code: "TOO_MUCH_REQUEST",
        });
        break;
      case "SERVER_ERROR":
        reply.error({
          ...deps[0],
          title: t("Error.ServerError.SERVER_ERROR.title"),
          message: deps[0].message || t("Error.ServerError.SERVER_ERROR.message"),
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
