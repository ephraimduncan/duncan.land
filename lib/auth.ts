import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { requiredEnv, requiredEnvList } from "./env";
import { drizzleDb } from "./drizzle";
import * as schema from "./schema";

const baseURL = process.env.BETTER_AUTH_URL;

const trustedOrigins = process.env.BETTER_AUTH_TRUSTED_ORIGINS
  ? requiredEnvList(
      "BETTER_AUTH_TRUSTED_ORIGINS",
      process.env.BETTER_AUTH_TRUSTED_ORIGINS
    )
  : baseURL
    ? [baseURL]
    : undefined;

export const auth = betterAuth({
  ...(baseURL ? { baseURL } : {}),
  ...(trustedOrigins ? { trustedOrigins } : {}),
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
      clientId: requiredEnv("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID),
      clientSecret: requiredEnv(
        "GITHUB_CLIENT_SECRET",
        process.env.GITHUB_CLIENT_SECRET
      ),
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
