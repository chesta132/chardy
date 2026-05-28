import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_URL, APP_URL, INTERNAL_ADMIN_PATH } from "./config";
import { createNectProxy } from "nectic/proxy";

const proxy = createNectProxy();

proxy.use(
  (req) => {
    const url = new URL(req.nextUrl);
    // rewrite to payload cms ui path
    url.pathname = `${INTERNAL_ADMIN_PATH}${url.pathname}`;
    return NextResponse.rewrite(url);
  },
  {
    matcher: (req) => {
      const host = req.getHeader("host") || "";
      const adminUrl = new URL(ADMIN_URL);
      const appUrl = new URL(APP_URL);

      // make sure it does not break when admin url === app url
      const isAdminHost = host === adminUrl.host && host !== appUrl.host;
      return isAdminHost;
    },
  },
);

const intlMw = createMiddleware(routing);
proxy.use((req) => intlMw(req.raw as NextRequest), {
  // if admin url is app url and pathname not start with INTERNAL_ADMIN_PATH
  matcher: (req) => !(ADMIN_URL === APP_URL && req.nextUrl.pathname.startsWith(INTERNAL_ADMIN_PATH)),
});

// best practice to return .next()
proxy.use(() => NextResponse.next());

export default proxy.handle();

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
