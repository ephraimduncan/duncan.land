import type { Metadata } from "next";
import { getAllSignatures } from "@/lib/data/wall";
import { WallCanvas } from "./components/wall-canvas";
import { computeSignatureLayout } from "./lib/signature-layout";
import "./wall.css";

export const metadata: Metadata = {
  title: "Signature Wall | Ephraim Duncan",
  description: "A canvas of all guestbook signatures",
};

export default async function WallPage() {
  const signatures = await getAllSignatures();
  const layout = computeSignatureLayout(signatures);

  return (
    <div className="wall-root">
      <WallCanvas positions={layout.positions} revealOrder={layout.revealOrder} />
    </div>
  );
}
