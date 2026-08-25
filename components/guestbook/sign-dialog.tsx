import * as stylex from "@stylexjs/stylex";
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
import "./guestbook-theme.css";

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

          <DialogBody style={styles.body}>
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
              <p {...stylex.props(styles.label)}>Draw your signature</p>
              <SignaturePad
                style={styles.pad}
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

const styles = stylex.create({
  body: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    userSelect: "none",
    color: "var(--guestbook-signature-label)",
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "0.875rem",
    },
    fontWeight: 500,
    lineHeight: "1.5rem",
  },
  pad: {
    width: "100%",
    height: "10rem",
    marginTop: "0.5rem",
    aspectRatio: "16 / 9",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--guestbook-signature-border)",
    borderRadius: "0.5rem",
    backgroundColor: "var(--guestbook-signature-surface)",
    boxShadow: "var(--guestbook-signature-shadow)",
  },
});
