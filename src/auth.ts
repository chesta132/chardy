import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./libs/db";
import { APP_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "./config";
import { getUser } from "./cms/crud/read";
import { admin } from "better-auth/plugins";
import * as schema from "../auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  baseURL: APP_URL,
  plugins: [admin()],

  socialProviders: {
    github: {
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET,

      async mapProfileToUser(profile) {
        const user = profile.email && (await getUser({ email: profile.email }));
        return {
          isAdmin: !!user,
        };
      },
    },
  },

  user: {
    additionalFields: {
      isAdmin: {
        type: "boolean",
        required: true,
      },
    },
  },
});
