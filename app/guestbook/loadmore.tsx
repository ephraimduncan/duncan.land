"use client";
import { Button } from "@/components/button";
import * as React from "react";

type loadMoreAction<T extends string | number = any> = T extends number
    ? (offset: T) => Promise<readonly [React.JSX.Element, number | null]>
    : T extends string
      ? (offset: T) => Promise<readonly [React.JSX.Element, string | null]>
      : any;

const Loader = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
    </svg>
);

const LoadMore = <T extends string | number = any>({
    children,
    initialOffset,
    loadMoreAction,
}: React.PropsWithChildren<{
    initialOffset: T;
    loadMoreAction: loadMoreAction<T>;
}>) => {
    const ref = React.useRef<HTMLButtonElement>(null);
    const [loadMoreNodes, setLoadMoreNodes] = React.useState<React.JSX.Element[]>([]);
    const currentOffsetRef = React.useRef<number | string | undefined>(initialOffset);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);

    const loadMore = React.useCallback(
        async (abortController?: AbortController) => {
            setLoading(true);

            // @ts-expect-error Can't yet figure out how to type this
            loadMoreAction(currentOffsetRef.current)
                .then(([node, next]) => {
                    if (abortController?.signal.aborted) return;
                    setLoadMoreNodes((prev) => [...prev, node]);
                    if (next === null) {
                        setHasMore(false);
                        currentOffsetRef.current ??= undefined;
                        return;
                    }

                    currentOffsetRef.current = next;
                })
                .catch(() => {})
                .finally(() => setLoading(false));
        },
        [loadMoreAction]
    );

    React.useEffect(() => {
        const signal = new AbortController();
        const element = ref.current;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && element?.disabled === false) {
                loadMore(signal);
            }
        });

        if (element) {
            observer.observe(element);
        }

        return () => {
            signal.abort();
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [loadMore]);

    return (
        <>
            {children}
            {loadMoreNodes}

            {hasMore && (
                <span className="flex items-center justify-center">
                    <Button className="" disabled={loading} onClick={() => loadMore()} ref={ref}>
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Loading...
                            </span>
                        ) : (
                            "Load More"
                        )}
                    </Button>
                </span>
            )}
        </>
    );
};

export default LoadMore;
