"use server";

import { cookies } from "next/headers";
import { auth, lucia } from "../auth";
import { redirect } from "next/navigation";

interface ActionResult {
    error: string | null;
}

export async function logout(): Promise<ActionResult> {
    "use server";
    const { session } = await auth();

    if (!session) {
        return {
            error: "Unauthorized",
        };
    }

    await lucia.invalidateSession(session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/");
}
