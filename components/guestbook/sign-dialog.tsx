import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "@/components/dialog";
import { ErrorMessage, Field, Label } from "@/components/fieldset";
import { SignaturePad } from "@/components/signature-pad";
import { Textarea } from "@/components/textarea";
import { useSignGuestbook } from "@/lib/hooks/use-guestbook";
import { signatureApi, SignatureUploadError } from "@/lib/api/signature";
import type { User } from "@/lib/auth";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

type SubmitState = "idle" | "uploading-signature" | "signing";
interface SignDialogProps {
  user: User;
}

export function SignDialog({ user }: SignDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const signatureRef = useRef<string | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const [showMessageError, setShowMessageError] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const signMutation = useSignGuestbook();
  const isSubmitting = submitState !== "idle";
  const submitLabel =
    submitState === "uploading-signature"
      ? "Uploading signature…"
      : submitState === "signing"
        ? "Signing guestbook…"
        : "Sign guestbook";

  function resetForm() {
    setMessage("");
    signatureRef.current = null;
    setShowMessageError(false);
  }

  function closeDialog() {
    setIsOpen(false);
    resetForm();
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
      messageRef.current?.focus();
      return;
    }

    try {
      let signatureUrl: string | null = null;

      if (signatureRef.current) {
        setSubmitState("uploading-signature");
        signatureUrl = await signatureApi.upload(signatureRef.current);
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
        Sign the guestbook
      </Button>

      <Dialog open={isOpen} onClose={isSubmitting ? () => {} : closeDialog} size="lg">
        <form onSubmit={handleSubmit}>
          <DialogTitle>Sign the guestbook</DialogTitle>

          <DialogBody className="space-y-4">
            <Field>
              <Label>Leave a message</Label>
              <Textarea
                ref={messageRef}
                invalid={showMessageError}
                rows={3}
                value={message}
                onChange={(e) => handleMessageChange(e.target.value)}
                maxLength={500}
              />
              {showMessageError ? (
                <ErrorMessage>Enter a message before signing.</ErrorMessage>
              ) : null}
            </Field>

            <div>
              <p className="select-none text-base/6 font-medium text-grey-950 sm:text-sm/6 dark:text-white">
                Draw your signature
              </p>
              <SignaturePad
                className="aspect-video h-40 mt-2 w-full rounded-lg border border-grey-950/10 bg-transparent shadow-xs dark:border-black/10 dark:bg-black/5 dark:shadow-none"
                onChange={(value) => {
                  signatureRef.current = value;
                }}
              />
            </div>
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
