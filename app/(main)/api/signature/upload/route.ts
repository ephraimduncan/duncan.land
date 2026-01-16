import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { user } = await auth();

  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "You must be signed in" },
      { status: 401 }
    );
  }

  try {
    const { signature } = await request.json();

    if (!signature || !signature.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Invalid signature data" },
        { status: 400 }
      );
    }

    const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const blob = await put(`signatures/${user.id}-${Date.now()}.png`, buffer, {
      access: "public",
      contentType: "image/png",
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("[SIGNATURE_UPLOAD]", error);

    return NextResponse.json(
      { error: "UPLOAD_FAILED", message: "Failed to upload signature" },
      { status: 500 }
    );
  }
}
