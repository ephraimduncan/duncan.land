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
import type { User } from "@/lib/auth";
import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import type { UploadSignatureResponse } from "@/types/guestbook";

type SubmitState = "idle" | "uploading-signature" | "signing";

class SignatureUploadError extends Error {
  constructor() {
    super("Failed to upload signature");
  }
}

interface SignDialogProps {
  user: User;
}

export function SignDialog({ user }: SignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [showMessageError, setShowMessageError] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const signMutation = useSignGuestbook();
  const isSubmitting = submitState !== "idle";
  const submitLabel =
    submitState === "uploading-signature"
      ? "Uploading signature..."
      : submitState === "signing"
        ? "Signing..."
        : "Sign";

  function resetForm() {
    setMessage("");
    setSignature("");
    setShowMessageError(false);
  }

  function closeDialog() {
    setIsOpen(false);
    resetForm();
  }

  async function uploadSignature(signatureData: string): Promise<string> {
    const response = await fetch("/api/signature/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signature: signatureData }),
    });

    if (!response.ok) {
      throw new SignatureUploadError();
    }

    const { url } = (await response.json()) as UploadSignatureResponse;
    return url;
  }

  function handleMessageChange(value: string) {
    setMessage(value);

    if (showMessageError && value.trim()) {
      setShowMessageError(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setShowMessageError(true);
      toast.error("Please enter a message");
      return;
    }

    try {
      let signatureUrl: string | null = null;

      if (signature) {
        setSubmitState("uploading-signature");
        signatureUrl = await uploadSignature(signature);
      }

      setSubmitState("signing");

      await signMutation.mutateAsync({
        message: trimmedMessage,
        signature: signatureUrl,
        author: {
          username: user.username,
          name: user.name ?? null,
        },
      });

      closeDialog();
    } catch (error) {
      if (error instanceof SignatureUploadError) {
        toast.error(error.message);
      }
    } finally {
      setSubmitState("idle");
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Sign guestbook
      </Button>

      <Dialog open={isOpen} onClose={isSubmitting ? () => {} : closeDialog} size="lg">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Sign my guestbook</DialogTitle>

          <DialogBody className="space-y-4">
            <Field>
              <Label>Leave a message</Label>
              <Textarea
                invalid={showMessageError}
                rows={3}
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                maxLength={500}
              />
            </Field>

            <Field>
              <Label>Sign Here</Label>
              <SignaturePad
                className="aspect-video h-40 mt-2 w-full rounded-lg border border-grey-950/10 bg-transparent shadow-xs dark:border-black/10 dark:bg-black/5 dark:shadow-none"
                onChange={(value) => setSignature(value ?? "")}
              />
            </Field>
          </DialogBody>

          <DialogActions>
            <Button disabled={isSubmitting} variant="plain" onClick={closeDialog} type="button">
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {submitLabel}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
