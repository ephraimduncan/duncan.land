import { type DependencyList, type RefObject, useCallback, useEffect } from "react";

export function useScrollEnd(
  callback: () => void,
  target: RefObject<HTMLDivElement | null>,
  deps: DependencyList = [],
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableCallback = useCallback(callback, deps);

  useEffect(() => {
    const el = target.current;
    if (!el) {
      return;
    }
    el.addEventListener("scrollend", stableCallback);
    return () => {
      el.removeEventListener("scrollend", stableCallback);
    };
  }, [target, stableCallback]);
}
