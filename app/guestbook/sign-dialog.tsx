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
import { User } from "lucia";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type SignDialogProps = {
  user: User;
};

export const SignDialog = ({ user }: SignDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [messageInvalid, setMessageInvalid] = useState(false);

  const signMutation = useSignGuestbook();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validation
    if (!message.trim()) {
      setMessageInvalid(true);
      toast.error("Please enter a message");
      return;
    }

    setMessageInvalid(false);

    // Execute mutation with user info for optimistic updates
    signMutation.mutate(
      {
        message: message.trim(),
        signature,
        optimisticUser: {
          username: user.username,
          name: user.name ?? null,
        },
      },
      {
        onSuccess: () => {
          // Close dialog and reset form
          setIsOpen(false);
          setMessage("");
          setSignature("");
        },
      }
    );
  };

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
                  "aspect-video h-40 mt-2 w-full rounded-lg border bg-transparent shadow-sm dark:shadow-none",
                  "border border-grey-950/10 dark:border-black/10",
                  "bg-transparent dark:bg-black/5"
                )}
                onChange={(value) => setSignature(value ?? "")}
              />
            </Field>
          </DialogBody>

          <DialogActions>
            <Button
              plain
              onClick={() => setIsOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              disabled={signMutation.isPending}
              type="submit"
            >
              {signMutation.isPending ? "Signing..." : "Sign"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
