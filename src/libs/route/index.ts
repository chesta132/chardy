import { AllowedMethods, ApiRequest, ApiResponse, BodyableMethods, Handler, Handlers, CreateRouteOptions, FormattedHandlers } from "./types";
import { NextApiRequest, NextApiResponse } from "next";
import { Reply } from "@/libs/reply";
import { APP_URL } from "@/config";
import { handleServerError } from "../error/server/handler";
import { ServerError } from "../error/server";
import { cors, executeHandler, getAvailableMethod, preflight, validatePayload, validateQuery } from "./helper";

export class Route<H extends Handlers> {
  static readonly ALLOWED_METHODS: AllowedMethods[] = ["DELETE", "GET", "PATCH", "POST", "PUT"];
  private handlers: FormattedHandlers;
  private options?: CreateRouteOptions<H>;

  /**
   * Creates a Next.js API route handler with multiple HTTP methods support
   * Use bodyParser: false in Next.js config when using this to handle another type of body (eg: multipart/form-data)
   *
   * @param handlers - Object containing handler functions for each HTTP method
   * @param options - Optional per-method config for `body`|`query`|`param` validation with `zod`, error recovery, and cors
   * @returns Next.js API route handler
   *
   * @description
   * This function automatically:
   * - Validates required `body`|`query`|`param` fields if specified in options
   * - Triggers auth middleware when handler has 3+ parameters
   * - Handles errors with custom recoverer or default error handler
   * - etc
   *
   * @example
   * // Basic usage
   * export default new Route({
   *   GET: async (req, res) => res.reply.ok({ data: 'hello' }),
   *   POST: async (req, res) => res.reply.created({ data: req.body })
   * }).toPagesRouter()
   *
   * @example
   * // With body validation and error recovery
   * export default new Route(
   *   { POST: async (req, res) => res.reply.created({ user: req.body }) },
   *   {
   *     POST: { bodyValidator: z.object({ email: z.email(), password: z.string() ]}) },
   *     recover: async (err, req, res) => res.reply.error('Custom error').fail()
   *   }
   * ).toPagesRouter()
   *
   * @example
   * // With auth (3 params triggers authMiddleware)
   * export default new Route({
   *   DELETE: async (req, res, admin) => res.reply.ok({ deleted: true })
   * }).toPagesRouter()
   */
  constructor(handlers: H, options?: CreateRouteOptions<H>) {
    const methodHandlers = {} as FormattedHandlers;
    for (const key in handlers) {
      const handler = handlers[key];
      if (Array.isArray(handler) && handler.length === 0) continue;
      methodHandlers[key as AllowedMethods] = [handler].flatMap((h) => h) as Handler[];
    }
    this.handlers = methodHandlers;
    this.options = options;
  }

  private async injectContext(request: NextApiRequest, response: NextApiResponse) {
    const reply = new Reply(request, response);
    (response as ApiResponse).reply = reply;
    const res = response as ApiResponse;
    const req = request as ApiRequest;
    (req.safe as any) = {};
    (req.count as any) = 0;

    // define func here (not import) bcs private this value
    const method = req.method as AllowedMethods;
    const handlers = this.handlers[method];
    req.get = function (key) {
      return this.safe[key];
    };
    req.set = function (key, value) {
      (this.safe as any)[key] = value;
    };
    req.next = async function () {
      (this.count as any)++;

      if (!handlers || this.count >= handlers.length) {
        (this.count as any)--;
        throw new ServerError("SERVER_ERROR", {
          message: "Rute tidak valid: tidak ada hander lebih lanjut.",
          debug: {
            currentIndex: this.count,
            totalHandlers: handlers?.length || 0,
            lastHandler: handlers?.[this.count]?.name || "unknown",
          },
        });
      }

      const handler = handlers[this.count];
      await executeHandler(handler, req, res);
    };
    return { req, res };
  }

  toPagesRouter() {
    return async (request: NextApiRequest, response: NextApiResponse) => {
      const { req, res } = await this.injectContext(request, response);
      let { options } = this;
      const { paramValidator: globalParamValidator, recover } = (options ||= {});

      try {
        const { validator = {} } = options[req.method as BodyableMethods] || {};
        let { body: bodyValidator, param: paramValidator, query: queryValidator } = validator;

        // handle preflight
        if (preflight(req, res)) return;

        // cors
        if (options?.cors !== false) cors(req, res, typeof options?.cors === "string" ? options.cors : APP_URL);

        // validate body
        if (bodyValidator) req.body = validatePayload(req.body, bodyValidator, "body");

        // merge param validator
        if (globalParamValidator && paramValidator) paramValidator = paramValidator.extend(globalParamValidator.shape);
        // validate param & query
        if (paramValidator || queryValidator) req.query = validateQuery(req.query, { param: paramValidator!, query: queryValidator });

        // run first handler
        const handlers = this.handlers[req.method as AllowedMethods] || this.handlers.FALLBACK;
        if (handlers?.[0]) return await executeHandler(handlers[0], req, res);
        // method not found
        else {
          const availableMethods = getAvailableMethod(this.handlers);
          res.reply
            .error({ code: "NOT_FOUND", message: `Can not ${req.method} ${req.url}` })
            .debug({ availableMethods })
            .fail();
        }
      } catch (err) {
        if (recover) return await recover(err, req, res);
        else return handleServerError(err, res.reply);
      }
    };
  }

  static pagesRouter<H extends Handlers>(handlers: H, options?: CreateRouteOptions<H>) {
    return new Route(handlers, options).toPagesRouter();
  }
}
