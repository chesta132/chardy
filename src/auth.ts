import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./libs/db";
import { APP_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from "./config";
import { getUser } from "./cms/crud/read";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  baseURL: APP_URL,

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
