import { pick } from "@/libs/manipulate/object";
import { NextApiRequest, NextApiResponse } from "next";
import { isDevEnv } from "@/config";
import { ReplyEnvelope, ErrorReplyType, PaginationOption, Cookie } from "./types";
import { CodeError } from "../error/codes";
import { ApiRequest } from "../route/types";
import { CookieCrud, cookieCrud } from "../cookie";
import { SerializeOptions } from "cookie";

const defaultPayload = <T>(): ReplyEnvelope<T> => ({ data: { code: "SERVER_ERROR", message: "Payload is empty." } as T, meta: { status: "ERROR" } });

const statusAlias: {
  code: CodeError[];
  status: number;
}[] = [
  { code: ["INVALID_AUTH"], status: 401 },
  { code: ["FORBIDDEN"], status: 403 },
  { code: ["NOT_FOUND"], status: 404 },
  { code: ["CLIENT_FIELD", "MISSING_FIELDS"], status: 406 },
  { code: ["CONFLICT"], status: 409 },
  { code: ["TOO_MUCH_REQUEST"], status: 429 },
  { code: ["SERVER_ERROR"], status: 500 },
  { code: ["BAD_GATEWAY"], status: 502 },
];

/**
 * Wrapper for NextApiResponse object with method chaining.
 * Provides utilities for standardized success/error responses and extra features.
 *
 * This instance is integrated with:
 *  - Route types
 */
export class Reply<RequestType extends ApiRequest<any, any, any> = ApiRequest<any, any, any>, SuccessType = unknown> {
  private payload: ReplyEnvelope<typeof this.data | typeof this.errorData, boolean> = defaultPayload();
  private res: NextApiResponse;
  private req: NextApiRequest;
  private cookies: CookieCrud;

  private debugValue: any[] = [];
  private data?: SuccessType;
  private errorData?: ErrorReplyType<RequestType["body"]>;

  /**
   * Initialize Template of the original NextApiResponse.
   */
  constructor(req: NextApiRequest, res: NextApiResponse<SuccessType>) {
    this.res = res;
    this.req = req;
    this.cookies = cookieCrud(req, res);
  }

  private _reset() {
    this.data = undefined;
    this.errorData = undefined;
    this.payload = defaultPayload();
  }

  private _finalize<S extends boolean>(success: S) {
    this.payload.meta.status = success ? "SUCCESS" : "ERROR";
    this.payload.data = success ? this.data : pick(this.errorData!, ["code", "details", "field", "message", "title"]);
    if (!success && isDevEnv() && this.debugValue.length > 0) {
      this.payload.meta.debug = this.debugValue;
    }
  }

  /**
   * Set the response body as a success payload.
   *
   * @example
   * ```ts
   * reply.success({ userId: 123 }).ok();
   * ```
   *
   * @param data The data to send in the success response
   * @returns this
   */
  success<T extends SuccessType>(data: T) {
    this.data = data;
    return this as unknown as Reply<RequestType, T>;
  }

  /**
   * Set the response body as an error payload.
   *
   * @example
   * ```ts
   * reply.error({ code: "NOT_FOUND", message: "User not found", status: 404 }).fail();
   * ```
   *
   * @param data The error object conforming to ErrorReplyType
   * @returns this
   */
  error(data: ErrorReplyType<RequestType["body"]>) {
    this.errorData = data;
    return this;
  }

  /**
   * Add a information message to the response metadata.
   *
   * @example
   * ```ts
   * reply.info("Profile updated successfully")
   *    .success(user)
   *    .ok();
   * ```
   *
   * @param information Information message
   * @returns this
   */
  info(information: string) {
    this.payload.meta = { ...this.payload.meta, information };
    return this;
  }

  /**
   * Apply pagination metadata to the response body (if the body is an array).
   *
   * @example
   * ```ts
   * reply.success(users)
   *    .paginate({ limit: 10, offset: 0 })
   *    .ok();
   * ```
   *
   * @param meta PaginationOption options (limit, offset)
   * @returns this
   */
  paginate: SuccessType extends any[] ? (meta: PaginationOption) => this : never = ((meta: PaginationOption) => {
    if (Array.isArray(this.data)) {
      const { limit, offset } = meta;
      const hasNext = this.data.length >= limit;
      const nextOffset = hasNext ? offset + limit : null;

      this.payload.meta = { ...this.payload.meta, pagination: { hasNext, nextOffset } };
    }
    return this;
  }) as any;

  /**
   * Send cookies to the client (access, refresh, or custom).
   *
   * @example
   * ```ts
   * reply
   *  .setCookies(REFRESH_TOKEN_KEY, refreshToken, REFRESH_TOKEN_CONFIG)
   *  .success(user)
   *  .setCookie({ [ACCESS_TOKEN_KEY]: { ...ACCESS_TOKEN_CONFIG, value: accessToken } }).ok();
   * ```
   *
   * @param cookie Cookie configuration
   * @returns this
   */
  setCookies(cookies: Cookie): this;
  setCookies(key: string, value: string, options?: Partial<SerializeOptions>): this;
  setCookies(keyOrCookies: string | Cookie, value?: string, options?: Partial<SerializeOptions>) {
    if (typeof keyOrCookies === "string") {
      this.cookies.set(keyOrCookies, value!, options);
    } else {
      for (const key in keyOrCookies) {
        const cookie = keyOrCookies[key];
        this.cookies.set(key, cookie.value, cookie);
      }
    }
    return this;
  }

  /**
   * Delete cookies from the response.
   *
   * @example
   * ```ts
   * reply.success(user).deleteCookies(["accessToken", "refreshToken"]).ok();
   * ```
   *
   * @param name Name of the cookie or array of names to delete
   * @param options Cookie options
   * @returns this
   */
  deleteCookies(...names: string[]) {
    names.forEach((name) => this.cookies.delete(name));
    return this;
  }

  /**
   * Set headers from the response.
   *
   * @example
   * ```ts
   * reply.error(error).setHeader("Allow", "GET, POST").ok();
   *
   * const headers = new Headers({ "Content-Type": "text/html" });
   * reply.success(user).setHeader(headers).ok();
   * ```
   *
   * @param name Name of the header
   * @param value Value of the header
   * @param header Header instance
   * @returns this
   */
  setHeader(name: string, value: number | string | readonly string[]): this;
  setHeader(header: Headers): this;
  setHeader(headerOrName: string | Headers, value?: number | string | readonly string[]) {
    if (headerOrName instanceof Headers) {
      this.res.setHeaders(headerOrName);
    } else {
      this.res.setHeader(headerOrName, value!);
    }
    return this;
  }

  /**
   * Set debug value to meta.debug.
   *
   * @example
   * ```ts
   * reply.debug(error).error(formattedError).fail()
   * ```
   *
   * @param messages Debug values
   * @returns this
   */
  debug(...messages: any) {
    this.debugValue.push(...messages);
    return this;
  }

  /**
   * Reset all internal state of a Reply instance to its default values.
   * This clears the success/error body, JSON payload, and tokens.
   *
   * @example
   * ```ts
   * const newReply = reply.reset();
   * newReply.success(user).ok();
   * ```
   *
   * @returns A new Reply instance with default internal state
   */
  reset() {
    return new Reply(this.req, this.res);
  }

  /**
   * Redirect the client to a specified URL.
   * @example
   * ```ts
   * reply.redirect("https://example.com");
   * ```
   *
   * @param url URL to redirect to
   * @returns this
   */
  redirect(url: string) {
    this.res.redirect(url);
    return this;
  }

  /**
   * Smart send success or error.
   *
   * @example
   * ```ts
   * reply.info("User has been updated").success(user).respond();
   * reply.error(err).respond();
   * ```
   */
  respond() {
    if (this.data) {
      this.ok();
    } else if (this.errorData) {
      this.fail();
    }
    this._reset();
  }

  /**
   * Send a standard 200 OK response.
   *
   * @example
   * ```ts
   * reply.info("Fetched user data").success(user).ok();
   * ```
   */
  ok() {
    this._finalize(true);
    this.res.status(200).json(this.payload);
    this._reset();
  }

  /**
   * Send a standard 204 No Content response.
   *
   * @example
   * ```ts
   * reply.noContent();
   * ```
   */
  noContent() {
    this._finalize(true);
    this.res.status(204).end();
    this._reset();
  }

  /**
   * Send a standard 201 Created response.
   *
   * @example
   * ```ts
   * reply.success(newUser).created();
   * ```
   */
  created() {
    this._finalize(true);
    this.res.status(201).json(this.payload);
    this._reset();
  }

  /**
   * Send an error response using ErrorReplyType.
   *
   * @example
   * ```ts
   * reply.error(code: "INVALID_AUTH", message: "Invalid token", status: 401 }).fail();
   * ```
   */
  fail() {
    // TODO: use logger
    const errorBody = this.errorData;
    if (!errorBody) return console.error("\nCan not respond fail. Error data not inserted");
    this._finalize(false);

    const status = errorBody.status ?? statusAlias.find((s) => s.code.includes(errorBody.code))?.status ?? 500;
    if (status >= 500) {
      console.error("\nServer error found and sent successfully:");
      console.table(errorBody);
    } else {
      if (isDevEnv()) {
        console.warn("\nClient error found and sent successfully:");
        console.table(errorBody);
      }
    }
    this.res.status(status).json(this.payload);

    this._reset();
  }
}
