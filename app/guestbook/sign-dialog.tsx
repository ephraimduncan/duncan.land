"use client";

import { Button } from "@/components/button";
import { Dialog, DialogActions, DialogBody, DialogTitle } from "@/components/dialog";
import { Field, Label } from "@/components/fieldset";
import { SignaturePad, cn } from "@/components/signature-pad";
import { Textarea } from "@/components/textarea";
import { sign } from "@/lib/actions/sign";
import { User } from "lucia";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { set } from "date-fns";

type SignDialogProps = {
    user: User;
};

export const SignDialog = ({ user }: SignDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localSignature, setLocalSignature] = useState<string>("");
    const [textInvalid, setTextInvalid] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormLoading(true);
        const formData = new FormData(event.target as HTMLFormElement);

        if (!formData.get("message")) {
            setTextInvalid(true);
            setIsOpen(true);

            toast.error("Please enter a message");
            setFormLoading(false);
            return;
        }

        formData.append("signature", localSignature);

        try {
            await sign(formData);
            setIsOpen(false);
            setFormLoading(false);
        } catch (err: any) {
            toast.error(err.message);
            setIsOpen(false);
            setFormLoading(false);
        }
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
                            <Textarea invalid={textInvalid} rows={3} name="message" />
                        </Field>
                        <Field>
                            <Label>Sign Here</Label>
                            <SignaturePad
                                className={cn(
                                    "aspect-video h-40 mt-2 w-full rounded-lg border bg-transparent shadow dark:shadow-none",
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
                        <Button disabled={formLoading} type="submit">
                            Sign
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};
