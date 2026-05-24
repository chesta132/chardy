import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_URL, APP_URL, INTERNAL_ADMIN_PATH } from "./config";

const intlMw = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const adminUrl = new URL(ADMIN_URL);
  const appUrl = new URL(APP_URL);

  // make sure it does not break when admin url === app url
  const isAdminHost = host === adminUrl.host && host !== appUrl.host;

  if (isAdminHost) {
    const url = request.nextUrl.clone();
    // rewrite to payload cms ui path
    url.pathname = `${INTERNAL_ADMIN_PATH}${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  const shouldSkipIntl = ADMIN_URL === APP_URL && request.nextUrl.pathname.startsWith(INTERNAL_ADMIN_PATH);

  if (shouldSkipIntl) return NextResponse.next();
  return intlMw(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
