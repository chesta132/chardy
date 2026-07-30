import type { auth } from "@/auth";

export type AuthPublicUser = typeof auth.$Infer.Session.user;
export type AuthPublicUserSafe = Pick<AuthPublicUser, "id" | "name" | "image">;
export type AuthPublicSession = typeof auth.$Infer.Session.session;
