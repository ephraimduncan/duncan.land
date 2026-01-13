import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzleDb } from "./drizzle";
import * as schema from "./schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") || [],
  database: drizzleAdapter(drizzleDb, {
    provider: "sqlite",
    schema,
  }),
  user: {
    additionalFields: {
      github_id: { type: "number", required: true, input: false },
      username: { type: "string", required: true, input: false },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["read:user", "user:email"],
      mapProfileToUser: (profile) => ({
        github_id: profile.id,
        username: profile.login,
        name: profile.name || profile.login,
        email: profile.email,
        image: profile.avatar_url,
      }),
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
