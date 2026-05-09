import { type DependencyList, type RefObject, useEffect, useRef } from "react";

export function useScrollEnd(
  callback: () => void,
  target: RefObject<HTMLDivElement | null>,
  deps: DependencyList = [],
) {
  const callbackRef = useRef(callback);

  // oxlint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    callbackRef.current = callback;
  }, deps);

  useEffect(() => {
    const el = target.current;
    if (!el) {
      return;
    }

    const handleScrollEnd = () => callbackRef.current();
    el.addEventListener("scrollend", handleScrollEnd);
    return () => {
      el.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [target]);
}
