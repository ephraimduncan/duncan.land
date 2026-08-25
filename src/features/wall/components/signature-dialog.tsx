import * as stylex from "@stylexjs/stylex";
import { Dialog, DialogBody, DialogTitle } from "@/components/dialog";
import { Button } from "@/components/button";
import type { GuestbookSignature } from "@/types/guestbook";
import { formatter } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { colors } from "../../../styles/tokens.stylex";

interface SignatureDialogProps {
  signature: GuestbookSignature;
  onClose: () => void;
}

export function SignatureDialog({ signature, onClose }: SignatureDialogProps) {
  const githubUrl = `https://github.com/${signature.username}`;
  const displayName = signature.name ?? signature.username;
  const formattedDate = formatter.date(new Date(signature.created_at));

  return (
    <Dialog open onClose={onClose} size="sm">
      <DialogTitle>{displayName}</DialogTitle>
      <DialogBody>
        <div>
          <div {...stylex.props(styles.stackItem, styles.preview)}>
            <img
              src={signature.signature}
              alt={`Signature by ${displayName}`}
              {...stylex.props(styles.image)}
              loading="lazy"
            />
          </div>

          <div {...stylex.props(styles.stackItem, styles.meta)}>
            <span>Signed {formattedDate}</span>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.link)}
            >
              @{signature.username}
              <ExternalLink {...stylex.props(styles.icon)} />
            </a>
          </div>
        </div>

        <div {...stylex.props(styles.actions)}>
          <Button onClick={onClose} type="button">
            Close
          </Button>
        </div>
      </DialogBody>
    </Dialog>
  );
}

const styles = stylex.create({
  stackItem: {
    marginTop: {
      default: "1rem",
      ":first-child": "0",
    },
  },
  preview: {
    position: "relative",
    aspectRatio: "16 / 9",
    width: "100%",
    overflow: "hidden",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: colors.separator,
    backgroundColor: "var(--wall-preview-bg)",
  },
  image: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "1rem",
    filter: "var(--signature-filter)",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    color: colors.foregroundMuted,
  },
  link: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    color: "var(--wall-link-text)",
    textDecorationLine: {
      default: null,
      ":hover": "underline",
    },
  },
  icon: {
    width: "0.75rem",
    height: "0.75rem",
  },
  actions: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "flex-end",
  },
});
