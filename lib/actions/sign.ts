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

    const insertPost = db
        .prepare("INSERT INTO post (id, created_at, message, user_id, signature) VALUES (?, ?, ?, ?, ?)")
        .run(generateId(15), Math.floor(Date.now() / 1000), message, user.id, signature);

    revalidatePath("/guestbook");
}
