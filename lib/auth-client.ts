import { createAuthClient } from "better-auth/react";

const baseURL = import.meta.env.VITE_BETTER_AUTH_URL;

const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
});

export const { signIn, signOut } = authClient;
