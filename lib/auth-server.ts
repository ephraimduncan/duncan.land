import { auth as betterAuth } from "./auth";
import { headers } from "next/headers";
import { cache } from "react";
import type { Session, User } from "./auth";

export type AuthState =
  | { user: User; session: Session }
  | { user: null; session: null };

export const auth = cache(async (): Promise<AuthState> => {
  const authState = await betterAuth.api.getSession({ headers: await headers() });

  if (!authState) {
    return { user: null, session: null };
  }

  return {
    user: authState.user,
    session: authState.session,
  };
});
