"use client";

import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { SignaturePad, cn } from "@/components/signature-pad";
import { Textarea } from "@/components/textarea";
import { sign } from "@/lib/actions/sign";
import { User } from "lucia";
import { FormEvent, useState } from "react";

type SignDialogProps = {
    user: User;
};

export const SignDialog = ({ user }: SignDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localSignature, setLocalSignature] = useState<string>("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.target as HTMLFormElement);
        formData.append("signature", localSignature);

        await sign(formData);
        setIsOpen(false);
    };

    return (
        <>
            <Button type="button" onClick={() => setIsOpen(true)}>
                Sign guestbook
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <form onSubmit={handleSubmit}>
                    <DialogTitle>Sign my guestbook 🖋️</DialogTitle>

                    <DialogBody className="space-y-4">
                        <Field>
                            <Label>Message</Label>
                            <Textarea rows={5} name="message" />
                        </Field>
                        <Field>
                            <Label>Signature</Label>
                            <SignaturePad
                                className={cn(
                                    "aspect-video h-48 mt-2 w-full rounded-lg border bg-transparent shadow dark:shadow-none",
                                    "border border-grey-950/10 dark:border-black/10 ",
                                    "bg-transparent dark:bg-black/5"
                                )}
                                onChange={(value) => setLocalSignature(value ?? "")}
                            />
                        </Field>
                    </DialogBody>
                    <DialogActions>
                        <Button plain onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" onClick={() => setIsOpen(false)}>
                            Sign
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
