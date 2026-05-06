import { Reply } from "@/libs/reply";
import { NextApiRequest, NextApiResponse } from "next";
import { ZodArray, ZodObject } from "zod";

export type AllowedMethods = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
export type BodyableMethods = Exclude<AllowedMethods, "GET">;

export interface ApiRequest<Body = any, Param extends Record<string, any> = never, Query extends Record<string, any> = never> extends NextApiRequest {
  body: Body;
  query: ([Query] extends [never] ? {} : Query) & ([Param] extends [never] ? {} : Param);
  get: Get;
  set: Set;
  next: Next;
  readonly count: number;
  readonly safe: Readonly<Record<string, unknown>>;
}

export interface ApiResponse<
  RequestType extends ApiRequest<any, any, any> = ApiRequest<never, never, never>,
  Data = any,
> extends NextApiResponse<Data> {
  reply: Reply<RequestType, Data>;
}

export type Handler<RQ extends ApiRequest<any, any, any> = ApiRequest<never, never, never>, ResponseType = any> = (
  req: RQ,
  res: ApiResponse<RQ, ResponseType>,
) => Promise<unknown> | unknown;
export type Recoverer = (err: unknown, req: ApiRequest, res: ApiResponse) => Promise<void> | void;
export type Get = (key: string) => unknown;
export type Set = (key: string, value: unknown) => void;
export type Next = () => void | Promise<void>;

export type Handlers = RequireAtLeastOne<Record<AllowedMethods | "FALLBACK", Handler | Handler[]>>;
export type FormattedHandlers = Partial<Record<AllowedMethods | "FALLBACK", Handler[]>>;

export type BodyValidator = ZodObject | ZodArray<ZodObject>;
export type QueryValidator = ZodObject;
export type ParamValidator = ZodObject;
export type CreateRouteValidator = {
  body?: BodyValidator;
  query?: QueryValidator;
  param?: ParamValidator;
};

export type CreateRouteOptionsBase = {
  validator?: CreateRouteValidator;
};

export type CreateRouteOptions<H extends Handlers> = ("FALLBACK" extends keyof H
  ? Partial<Record<AllowedMethods, CreateRouteOptionsBase>>
  : {
      [K in keyof H]?: K extends BodyableMethods
        ? CreateRouteOptionsBase
        : Omit<CreateRouteOptionsBase, "validator"> & { validator?: Omit<CreateRouteValidator, "body"> };
    }) & {
  recover?: Recoverer;
  paramValidator?: ParamValidator;
  /**
   * Default is true with domain of client url
   * @default true
   */
  cors?: false | string;
};
