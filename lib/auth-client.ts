"use client";

import { createAuthClient } from "better-auth/react";
import { requiredEnv } from "./env";

const baseURL = requiredEnv(
  "NEXT_PUBLIC_BETTER_AUTH_URL",
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL
);

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, useSession } = authClient;
