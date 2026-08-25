import {
  Dialog as HeadlessDialog,
  DialogPanel as HeadlessDialogPanel,
  DialogTitle as HeadlessDialogTitle,
  Transition as HeadlessTransition,
  TransitionChild as HeadlessTransitionChild,
} from "@headlessui/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Fragment } from "react";

import "./form-theme.css";

const panelSizes = stylex.create({
  lg: {
    maxWidth: {
      default: null,
      "@media (min-width: 640px)": "32rem",
    },
  },
  sm: {
    maxWidth: {
      default: null,
      "@media (min-width: 640px)": "24rem",
    },
  },
});

const styles = stylex.create({
  backdrop: {
    backgroundColor: "var(--dialog-backdrop)",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    outline: {
      default: null,
      ":focus": "0",
    },
    overflowY: "auto",
    paddingBlock: {
      default: "0.5rem",
      "@media (min-width: 640px)": "2rem",
      "@media (min-width: 1024px)": "4rem",
    },
    paddingInline: {
      default: "0.5rem",
      "@media (min-width: 640px)": "1.5rem",
      "@media (min-width: 1024px)": "2rem",
    },
    position: "fixed",
    width: "100vw",
  },
  viewport: {
    inset: 0,
    overflowY: "auto",
    paddingTop: {
      default: "1.5rem",
      "@media (min-width: 640px)": 0,
    },
    position: "fixed",
    width: "100vw",
  },
  grid: {
    display: "grid",
    gridTemplateRows: {
      default: "1fr auto",
      "@media (min-width: 640px)": "1fr auto 3fr",
    },
    justifyItems: "center",
    minHeight: "100%",
    padding: {
      default: 0,
      "@media (min-width: 640px)": "1rem",
    },
  },
  panel: {
    backgroundColor: "var(--dialog-panel-background)",
    borderBottomLeftRadius: {
      default: 0,
      "@media (min-width: 640px)": "1rem",
    },
    borderBottomRightRadius: {
      default: 0,
      "@media (min-width: 640px)": "1rem",
    },
    borderTopLeftRadius: {
      default: "1.5rem",
      "@media (min-width: 640px)": "1rem",
    },
    borderTopRightRadius: {
      default: "1.5rem",
      "@media (min-width: 640px)": "1rem",
    },
    boxShadow:
      "0 0 0 1px var(--dialog-panel-ring), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    gridRowStart: 2,
    marginBottom: {
      default: 0,
      "@media (min-width: 640px)": "auto",
    },
    minWidth: 0,
    outlineStyle: {
      default: null,
      "@media (forced-colors: active)": "solid",
    },
    padding: "2rem",
    width: "100%",
  },
  title: {
    color: "var(--form-strong-text)",
    fontSize: {
      default: "1.125rem",
      "@media (min-width: 640px)": "1rem",
    },
    fontWeight: 600,
    lineHeight: "1.5rem",
    textWrap: "balance",
  },
  body: {
    marginTop: "1.5rem",
  },
  actions: {
    alignItems: "center",
    gap: "0.75rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "2rem",
  },
});

type DialogSize = keyof typeof panelSizes;

type DialogProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  size: DialogSize;
};

type DialogSectionProps = {
  children: ReactNode;
  style?: StyleXStyles;
};

export function Dialog({ open, onClose, size, children }: DialogProps) {
  return (
    <HeadlessTransition appear as={Fragment} show={open}>
      <HeadlessDialog onClose={onClose}>
        <HeadlessTransitionChild
          as={Fragment}
          enter="dialog-backdrop-enter"
          enterFrom="dialog-backdrop-enter-from"
          enterTo="dialog-backdrop-enter-to"
          leave="dialog-backdrop-leave"
          leaveFrom="dialog-backdrop-leave-from"
          leaveTo="dialog-backdrop-leave-to"
        >
          <div {...stylex.props(styles.backdrop)} />
        </HeadlessTransitionChild>

        <div {...stylex.props(styles.viewport)}>
          <div {...stylex.props(styles.grid)}>
            <HeadlessTransitionChild
              as={Fragment}
              enter="dialog-panel-enter"
              enterFrom="dialog-panel-enter-from"
              enterTo="dialog-panel-enter-to"
              leave="dialog-panel-leave"
              leaveFrom="dialog-panel-leave-from"
              leaveTo="dialog-panel-leave-to"
            >
              <HeadlessDialogPanel {...stylex.props(styles.panel, panelSizes[size])}>
                {children}
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransition>
  );
}

export function DialogTitle({ children, style }: DialogSectionProps) {
  return (
    <HeadlessDialogTitle {...stylex.props(styles.title, style)}>{children}</HeadlessDialogTitle>
  );
}

export function DialogBody({ children, style }: DialogSectionProps) {
  return <div {...stylex.props(styles.body, style)}>{children}</div>;
}

export function DialogActions({ children, style }: DialogSectionProps) {
  const sx = stylex.props(styles.actions, style);

  return (
    <div className={clsx("dialog-actions", sx.className)} style={sx.style}>
      {children}
    </div>
  );
}
