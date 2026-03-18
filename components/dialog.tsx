import {
    Dialog as HeadlessDialog,
    DialogPanel as HeadlessDialogPanel,
    DialogTitle as HeadlessDialogTitle,
    Transition as HeadlessTransition,
    TransitionChild as HeadlessTransitionChild,
} from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Fragment } from "react";

const panelSizes = {
    lg: "sm:max-w-lg",
    sm: "sm:max-w-sm",
} as const;

type DialogSize = keyof typeof panelSizes;

type DialogProps = {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
    size: DialogSize;
};

type DialogSectionProps = {
    children: ReactNode;
    className?: string;
};

export function Dialog({
    open,
    onClose,
    size,
    children,
}: DialogProps) {
    return (
        <HeadlessTransition appear as={Fragment} show={open}>
            <HeadlessDialog onClose={onClose}>
                <HeadlessTransitionChild
                    as={Fragment}
                    enter="ease-out duration-100"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 flex w-screen justify-center overflow-y-auto bg-grey-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-grey-950/80" />
                </HeadlessTransitionChild>

                <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
                    <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
                        <HeadlessTransitionChild
                            as={Fragment}
                            enter="ease-out duration-100"
                            enterFrom="opacity-0 translate-y-12 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-100"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-12 sm:translate-y-0"
                        >
                            <HeadlessDialogPanel
                                className={clsx(
                                    panelSizes[size],
                                    "row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-(--gutter) shadow-lg ring-1 ring-grey-950/10 [--gutter:--spacing(8)] sm:mb-auto sm:rounded-2xl dark:bg-grey-950 dark:ring-white/10 forced-colors:outline-solid"
                                )}
                            >
                                {children}
                            </HeadlessDialogPanel>
                        </HeadlessTransitionChild>
                    </div>
                </div>
            </HeadlessDialog>
        </HeadlessTransition>
    );
}

export function DialogTitle({ children, className }: DialogSectionProps) {
    return (
        <HeadlessDialogTitle
            className={clsx(
                className,
                "text-balance text-lg/6 font-semibold text-grey-950 sm:text-base/6 dark:text-white"
            )}
        >
            {children}
        </HeadlessDialogTitle>
    );
}

export function DialogBody({ children, className }: DialogSectionProps) {
    return <div className={clsx(className, "mt-6")}>{children}</div>;
}

export function DialogActions({ children, className }: DialogSectionProps) {
    return (
        <div
            className={clsx(className, "mt-8 flex flex-row items-center justify-end gap-3 *:w-full  sm:*:w-auto")}
        >
            {children}
        </div>
    );
}
