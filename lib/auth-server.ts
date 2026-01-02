import { auth as betterAuth } from "./auth";
import { headers } from "next/headers";
import { cache } from "react";

export const auth = cache(async () => {
  const session = await betterAuth.api.getSession({ headers: await headers() });
  return session
    ? { user: session.user, session: session.session }
    : { user: null, session: null };
});
