import * as React from "react";

const subscribe = () => {
  return () => {};
};

const getServerSnapshot = () => false;
const getSnapshot = () => true;

export function useIsHydrated() {
  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
}
