"use client";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { SignaturePad } from "@/components/signature-pad";
import { Textarea } from "@/components/textarea";
import { useSignGuestbook } from "@/lib/hooks/use-guestbook";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/auth";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

type SignDialogProps = {
  user: User;
};

export function SignDialog({ user }: SignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [messageInvalid, setMessageInvalid] = useState(false);

  const signMutation = useSignGuestbook();

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!message.trim()) {
      setMessageInvalid(true);
      toast.error("Please enter a message");
      return;
    }

    setMessageInvalid(false);

    let signatureUrl: string | null = null;

    if (signature) {
      try {
        const uploadRes = await fetch('/api/signature/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signature }),
        });

        if (!uploadRes.ok) {
          toast.error("Failed to upload signature");
          return;
        }

        const { url } = await uploadRes.json();
        signatureUrl = url;
      } catch {
        toast.error("Failed to upload signature");
        return;
      }
    }

    signMutation.mutate(
      {
        message: message.trim(),
        signature: signatureUrl ?? "",
        optimisticUser: {
          username: user.username,
          name: user.name ?? null,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setMessage("");
          setSignature("");
        },
      }
    );
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Sign guestbook
      </Button>

      <Dialog open={isOpen} onClose={setIsOpen}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Sign my guestbook</DialogTitle>

          <DialogBody className="space-y-4">
            <Field>
              <Label>Leave a message</Label>
              <Textarea
                name="message"
                autoComplete="off"
                placeholder="Write your message here…"
                invalid={messageInvalid}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
            </Field>

            <Field>
              <Label>Sign Here</Label>
              <SignaturePad
                className={cn(
                  "aspect-video h-40 mt-2 w-full rounded-lg border bg-transparent shadow-xs dark:shadow-none",
                  "border border-grey-950/10 dark:border-black/10",
                  "bg-transparent dark:bg-black/5"
                )}
                onChange={(value) => setSignature(value ?? "")}
              />
            </Field>
          </DialogBody>

          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)} type="button">
              Cancel
            </Button>
            <Button disabled={signMutation.isPending} type="submit">
              {signMutation.isPending ? "Signing..." : "Sign"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
