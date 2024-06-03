"use client";
import { Button } from "@/components/button";
import * as React from "react";

type loadMoreAction<T extends string | number = any> = T extends number
    ? (offset: T) => Promise<readonly [React.JSX.Element, number | null]>
    : T extends string
      ? (offset: T) => Promise<readonly [React.JSX.Element, string | null]>
      : any;

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
                    <Button className="" disabled={loading} onClick={() => loadMore()}>
                        {loading ? "Loading..." : "Load More"}
                    </Button>
                </span>
            )}
        </>
    );
};

export default LoadMore;
