import { auth } from "@/auth";
import { AuthPublicSession, AuthPublicUser } from "@/types/auth";
import { ActionMiddlewareFunc } from "nectic/actions";
import { headers } from "next/headers";

export abstract class AuthMiddleware {
  private static readonly PUBLIC_USER_KEY = "public_user";
  private static readonly PUBLIC_USER_SESSION_KEY = "public_user_session";

  static protectPublicUser: ActionMiddlewareFunc = async ({ next, outcome, ...ctx }, ...args) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return outcome.error({ code: "UNAUTHORIZED", message: "Invalid session" }).fail();
    }
    ctx.set(this.PUBLIC_USER_KEY, session.user satisfies AuthPublicUser);
    ctx.set(this.PUBLIC_USER_SESSION_KEY, session.session satisfies AuthPublicSession);
    return next();
  };

  static getPublicUser({ get }: { get: (key: string) => any }) {
    return get(this.PUBLIC_USER_KEY) as AuthPublicUser;
  }

  static getPublicUserSession({ get }: { get: (key: string) => any }) {
    return get(this.PUBLIC_USER_SESSION_KEY) as AuthPublicSession;
  }
}
