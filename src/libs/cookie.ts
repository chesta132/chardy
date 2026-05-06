import { NextApiRequest, NextApiResponse } from "next";
import { serialize, SerializeOptions } from "cookie";

const getCookies = (res: NextApiResponse) => {
  const existing = res.getHeader("Set-Cookie") || [];
  return Array.isArray(existing) ? existing : [String(existing)];
};

export const cookieCrud = (req: NextApiRequest, res: NextApiResponse) => ({
  get: (name: string) => req.cookies[name] || "",
  set: (name: string, value: string, options?: SerializeOptions) => {
    const cookieString = serialize(name, value, { path: "/", ...options });
    const cookies = getCookies(res);
    res.setHeader("Set-Cookie", [...cookies, cookieString]);
  },
  delete: (name: string) => {
    const cookieString = serialize(name, "", { path: "/", maxAge: 0 });
    const cookies = getCookies(res);
    res.setHeader("Set-Cookie", [...cookies, cookieString]);
  },
});

export type CookieCrud = ReturnType<typeof cookieCrud>;
