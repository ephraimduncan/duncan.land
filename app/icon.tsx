import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
    width: 32,
    height: 32,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                tw="flex items-center justify-center bg-zinc-900 text-[20px] leading-8 text-white"
                style={{
                    width: 32,
                    height: 32,
                }}
            >
                E
            </div>
        ),
        {
            ...size,
        }
    );
}
