import { useIsomorphicLayoutEffect } from "motion/react";
import * as React from "react";

let globalIsHydrated = false;

export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = React.useState(globalIsHydrated);

  useIsomorphicLayoutEffect(() => {
    setIsHydrated(true);
    globalIsHydrated = true;
  }, []);

  return isHydrated;
}
