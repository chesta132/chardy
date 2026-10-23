import { ActionMiddlewareFunc } from "nectic/actions";
import { headers } from "next/headers";
import { type Ratelimit } from "@upstash/ratelimit";
import { ratelimit as redisRatelimit } from "@/libs/redis/ratelimit";
import { ServerError } from "@/libs/error/server";
import { getLocale } from "next-intl/server";
import { Locale } from "@/i18n/types";
import Sentry from "@sentry/nextjs"

type GetIdentifier<Args extends any[] = any[]> = (header: Awaited<ReturnType<typeof headers>>, ...args: Args) => string;
type DefaultActionArg<ActionArgs extends any[] = any[]> = {
  /**
   * @default ratelimit from "/src/libs/redis/ratelimit"
   */
  ratelimit?: Ratelimit;
  /**
   * @default ip
   */
  limitBy?: GetIdentifier<ActionArgs>;
  /**
   * @default "global"
   */
  key?: string;
};

export abstract class RateLimitMiddleware {
  private static DEFAULT_KEY = "global";
  private static defaultLimitBy: GetIdentifier = (header) =>
    header.get("x-real-ip") || header.get("cf-connecting-ip") || header.get("x-forwarded-for") || "127.0.0.1";
  private static defaultArg: Required<DefaultActionArg> = {
    limitBy: this.defaultLimitBy,
    ratelimit: redisRatelimit,
    key: this.DEFAULT_KEY,
  };

  static action<T extends any[]>(
    { limitBy = this.defaultLimitBy, ratelimit = redisRatelimit, key = this.DEFAULT_KEY }: DefaultActionArg<T> = this.defaultArg,
  ): ActionMiddlewareFunc<T> {
    return async ({ next, outcome }, ...args) => {
      try {
        const header = await headers();
        const locale = (await getLocale()) as Locale;
        const id = `${key}-${limitBy(header, ...(args as unknown as T))}`;

        const { success, deniedValue } = await ratelimit.limit(id);
        if (!success) {
          const err = new ServerError("TOO_MUCH_REQ").withLocale(locale);
          return outcome
            .error(await err.flatten())
            .debug(deniedValue)
            .fail();
        }

        return next();
      } catch (err) {
        Sentry.captureException(err);
        return next();
      }
    };
  }
}
