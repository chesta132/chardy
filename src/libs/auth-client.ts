import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/auth";
import { nectAction } from "nectic/actions";
import { getPublicUsersAction } from "@/actions/auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const { useSession } = authClient;

export const getPublicUsers = nectAction(getPublicUsersAction, { unsafe: true, fromCSR: true });
