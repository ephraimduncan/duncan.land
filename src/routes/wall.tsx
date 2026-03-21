import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getAllSignatures } from "@/lib/data/wall";
import { WallCanvas } from "@/src/features/wall/components/wall-canvas";
import { computeSignatureLayout } from "@/src/features/wall/lib/signature-layout";
import "@/src/features/wall/wall.css";

const loadWallData = createServerFn({ method: "GET" }).handler(async () => {
  const signatures = await getAllSignatures();
  return computeSignatureLayout(signatures);
});

export const Route = createFileRoute("/wall")({
  loader: () => loadWallData(),
  head: () => ({
    meta: [
      { title: "Signature Wall | Ephraim Duncan" },
      { name: "description", content: "A canvas of all guestbook signatures" },
    ],
  }),
  component: WallPage,
});

function WallPage() {
  const layout = Route.useLoaderData();

  return (
    <div className="wall-root">
      <WallCanvas positions={layout.positions} revealOrder={layout.revealOrder} />
    </div>
  );
}
