import { capital } from "@/libs/manipulate/string";
import { record } from "../../manipulate/object";
import { Locale } from "@/i18n/types";
import { createTranslator } from "next-intl";
import { getMessages } from "@/i18n/request";

interface RestError {
  debug?: any;
  field?: Record<string, string>;
}

export type CodeError =
  | "CLIENT_FIELD"
  | "MISSING_FIELDS"
  | "INVALID_AUTH"
  | "NOT_FOUND"
  | "TOO_MUCH_REQUEST"
  | "SERVER_ERROR"
  | "FORBIDDEN"
  | "CONFLICT";
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
export type FlattenedServerError = {
  code: CodeError;
  message: string;
  field?: Record<string, string>;
  details?: string;
};

type Config<C> = Extract<ServerErrorConfig, { code: C }>;
type DepsOf<C extends ServerErrorCode> = Config<C>["deps"];

export class ServerError<C extends ServerErrorCode> {
  private code: C;
  private deps: DepsOf<C>;
  readonly locale: Locale = "en";

  constructor(code: C, ...deps: DepsOf<C>);
  constructor(error: ServerError<C>);

  constructor(codeOrError: C | ServerError<C>, ...depsOrRes: DepsOf<C> | [undefined]) {
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

  async flatten(): Promise<FlattenedServerError> {
    const t = createTranslator({ locale: this.locale, messages: await getMessages(this.locale), namespace: "Error.ServerError" });
    const { deps, code } = { code: this.code, deps: this.deps } as ServerErrorConfig;

    switch (code) {
      case "CLIENT_FIELD":
        return { ...deps[0], message: t("CLIENT_FIELD.message"), code: "CLIENT_FIELD" } as const;
      case "MISSING_FIELDS":
        const arrFields = Array.isArray(deps[0].field) ? [...new Set(deps[0].field)] : Object.keys(deps[0].field);
        const fieldVal = t("MISSING_FIELDS.fieldVal");
        const objFields = Array.isArray(deps[0].field) ? record(deps[0].field, fieldVal) : deps[0].field;
        return {
          ...deps[0],
          message: t("MISSING_FIELDS.message", { count: arrFields.length }),
          code: "MISSING_FIELDS",
          field: objFields,
        } as const;
      case "INVALID_AUTH":
        return {
          ...deps[0],
          message: t("INVALID_AUTH.message"),
          code: "INVALID_AUTH",
        } as const;
      case "NOT_FOUND":
        return {
          ...deps[0],
          message: `${t("NOT_FOUND.message", { item: deps[0].item })}${deps[0].desc ? ` ${capital(deps[0].desc)}` : ""}}`,
          code: "NOT_FOUND",
        } as const;
      case "TOO_MUCH_REQ":
        return {
          ...deps[0],
          message: `${t("TOO_MUCH_REQ.message")} ${capital(deps[0]?.desc || t("TOO_MUCH_REQ.desc"))}`,
          code: "TOO_MUCH_REQUEST",
        } as const;
      case "SERVER_ERROR":
        return {
          ...deps[0],
          message: deps[0].message || t("SERVER_ERROR.message"),
          code: "SERVER_ERROR",
          details: deps[0].error?.message,
        } as const;
      case "FORBIDDEN":
      case "CONFLICT":
        return { ...deps[0], code } as const;
    }
  }

  async flattenToString() {
    return JSON.stringify(await this.flatten());
  }

  static flattenFromString(str: string) {
    try {
      const parsed = JSON.parse(str);
      return isServerError(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
}

export function isServerError(err: unknown): err is FlattenedServerError {
  return typeof err === "object" && err !== null && "code" in err;
}
