"use server";

import { generateId } from "lucia";
import { auth } from "../auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sign(formData: FormData) {
    const { user } = await auth();
    const message = formData.get("message") as string;
    const signature = formData.get("signature") as string;

    if (!user) {
        return;
    }

    // query to check if the user has made a post ever
    const hasMadePostQuery = await db.execute({
        sql: "SELECT * FROM post WHERE user_id = ?",
        args: [user.id],
    });

    // if post, prevent them from making another post
    if (hasMadePostQuery.rows.length) {
        throw new Error("You have already signed the guestbook");
    }

    await db.execute({
        sql: "INSERT INTO post (id, created_at, message, user_id, signature) VALUES (?, ?, ?, ?, ?)",
        args: [generateId(15), Math.floor(Date.now() / 1000), message, user.id, signature],
    });

    revalidatePath("/guestbook");
}
