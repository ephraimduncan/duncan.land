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

    const insert = db.execute({
        sql: "INSERT INTO post (id, created_at, message, user_id, signature) VALUES (?, ?, ?, ?, ?)",
        args: [generateId(15), Math.floor(Date.now() / 1000), message, user.id, signature],
    });

    console.log("insert", insert);

    revalidatePath("/guestbook");
}
