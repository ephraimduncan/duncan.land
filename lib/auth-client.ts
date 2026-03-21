"use client";

import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL;

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
});

export const { signIn, signOut, useSession } = authClient;
