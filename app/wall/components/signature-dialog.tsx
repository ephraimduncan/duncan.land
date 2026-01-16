"use client";

import {
  Dialog,
  DialogBody,
  DialogTitle,
} from "@/components/dialog";
import { Button } from "@/components/button";
import type { WallSignature } from "@/lib/data/wall";
import { formatter } from "@/lib/utils";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

interface SignatureDialogProps {
  signature: WallSignature | null;
  onClose: () => void;
}

export function SignatureDialog({ signature, onClose }: SignatureDialogProps) {
  if (!signature) return null;

  const githubUrl = `https://github.com/${signature.username}`;
  const displayName = signature.name || signature.username;
  const formattedDate = formatter.date(new Date(signature.created_at));

  return (
    <Dialog open={!!signature} onClose={onClose} size="sm">
      <DialogTitle>{displayName}</DialogTitle>
      <DialogBody>
        <div className="space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-grey-200 bg-grey-50 dark:border-grey-800 dark:bg-grey-900">
            <Image
              src={signature.signature}
              alt={`Signature by ${displayName}`}
              fill
              className="object-contain p-4 [.dark_&]:invert"
              unoptimized
            />
          </div>

          <div className="flex items-center justify-between text-sm text-grey-600 dark:text-grey-400">
            <span>Signed {formattedDate}</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-grey-900 hover:underline dark:text-grey-100"
            >
              @{signature.username}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}
