import { TURNSTILE_SECRET } from "@/config";
import { TurnstilePayload } from "@/payloads/turnstile";
import { ActionMiddlewareFunc } from "nectic/actions";
import { validateTurnstileToken } from "next-turnstile";

export abstract class TurnstileMiddleware {
  static action: ActionMiddlewareFunc<[TurnstilePayload.Validator, ...any]> = async ({ next, outcome, ...ctx }, { token }, ...rest) => {
    if (token) {
      const result = await validateTurnstileToken({
        token,
        secretKey: TURNSTILE_SECRET!,
      });
      if (result.success) return next();
    }
    return outcome.error({ code: "UNAUTHORIZED", message: "Invalid captcha" }).fail();
  };
}
