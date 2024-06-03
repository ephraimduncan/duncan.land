import { clsx } from "clsx";
import { Link } from "./link";

export function Text({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
    return (
        <p
            {...props}
            data-slot="text"
            className={clsx(className, "text-base/6 text-grey-500 sm:text-sm/6 dark:text-grey-400")}
        />
    );
}

export function TextLink({ className, ...props }: React.ComponentPropsWithoutRef<typeof Link>) {
    return (
        <Link
            {...props}
            className={clsx(
                className,
                "text-grey-950 underline decoration-grey-950/50 data-[hover]:decoration-grey-950 dark:text-white dark:decoration-white/50 dark:data-[hover]:decoration-white"
            )}
        />
    );
}

export function Strong({ className, ...props }: React.ComponentPropsWithoutRef<"strong">) {
    return <strong {...props} className={clsx(className, "font-medium text-grey-950 dark:text-white")} />;
}

export function Code({ className, ...props }: React.ComponentPropsWithoutRef<"code">) {
    return (
        <code
            {...props}
            className={clsx(
                className,
                "rounded border border-grey-950/10 bg-grey-950/[2.5%] px-0.5 text-sm font-medium text-grey-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white"
            )}
        />
    );
}
