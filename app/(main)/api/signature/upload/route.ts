import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import type {
  ApiError,
  UploadSignatureRequest,
  UploadSignatureResponse,
} from "@/types/guestbook";

type UploadSignatureRouteResponse =
  | UploadSignatureResponse
  | ApiError<"INVALID_INPUT" | "UNAUTHORIZED" | "UPLOAD_FAILED">;

const pngDataUrlPrefix = "data:image/png;base64,";
const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;

export async function POST(
  request: NextRequest,
): Promise<NextResponse<UploadSignatureRouteResponse>> {
  const { user } = await auth();

  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "You must be signed in" },
      { status: 401 },
    );
  }

  const body = await request.json().catch(() => null);

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: "Request body must be a JSON object" },
      { status: 400 },
    );
  }

  const { signature } = body;

  if (typeof signature !== "string" || !signature.startsWith(pngDataUrlPrefix)) {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: "Signature must be a PNG data URL" },
      { status: 400 },
    );
  }

  const input: UploadSignatureRequest = { signature };
  const base64Data = input.signature.slice(pngDataUrlPrefix.length);

  if (
    base64Data.length === 0
    || base64Data.length % 4 !== 0
    || !base64Pattern.test(base64Data)
  ) {
    return NextResponse.json(
      { error: "INVALID_INPUT", message: "Signature must be valid PNG data" },
      { status: 400 },
    );
  }

  try {
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
      { status: 500 },
    );
  }
}
