"use client";

import * as React from "react";
import type { MotionValue, TargetAndTransition } from "motion/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import clsx from "clsx";
import type { UsageDay } from "./data";
import { useScrollEnd } from "@/lib/hooks/use-scroll-end";
import { useSound } from "@/lib/hooks/use-sound";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";

export const CURSOR_SIZE = 44;
export const CURSOR_CENTER = CURSOR_SIZE / 2;
export const CURSOR_WIDTH = 2;
export const CURSOR_LARGE_HEIGHT = 400;
export const LINE_GAP = 10;
export const LINE_WIDTH = 1;
export const LINE_STEP = LINE_GAP + LINE_WIDTH;
export const POINTER_SPRING = { stiffness: 500, damping: 40 };
const SOUND_OPTIONS = { volume: 0.3 };

////////////////////////////////////////////////////////////////////////////////

export interface GraphContext {
  morph: boolean;
  idle: boolean;
  activeIndex: number | null;
  setMorph: React.Dispatch<React.SetStateAction<boolean>>;
  setIdle: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
  x: MotionValue<number>;
  y: MotionValue<number>;
  pressed: boolean;
  isTouch: boolean;
  data: UsageDay[];
}

const GraphContext = React.createContext<GraphContext>({} as GraphContext);
export const useGraph = () => React.useContext(GraphContext);

////////////////////////////////////////////////////////////////////////////////

export default function LineGraph({ data }: { data: UsageDay[] }) {
  const isTouch = useMediaQuery("(hover: none)");

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const boundsRef = React.useRef<HTMLDivElement | null>(null);

  const [morph, setMorph] = React.useState(isTouch);
  const [idle, setIdle] = React.useState(!isTouch);
  const [pressed, setPressed] = React.useState(false);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const activeDay = activeIndex !== null ? data[activeIndex] ?? null : null;
  const activeDate = activeDay ? formatDate(activeDay.date) : formatDate(null);

  const { scrollX } = useScroll({ container: rootRef });
  const x = useSpring(0, POINTER_SPRING);
  const y = useSpring(0, POINTER_SPRING);

  const lastClientX = React.useRef(0);

  const tick = useSound("/sounds/tick.mp3", SOUND_OPTIONS);
  const popClick = useSound("/sounds/pop-click.wav", SOUND_OPTIONS);

  const maxCost = React.useMemo(() => Math.max(...data.map((d) => d.cost), 1), [data]);

  function getIndexFromX(x: number) {
    const scrollLeft = rootRef.current?.scrollLeft ?? 0;
    const offsetLeft = boundsRef.current?.offsetLeft ?? 0;
    const offset = offsetLeft - scrollLeft - LINE_WIDTH;
    const index = Math.floor((x - offset) / LINE_STEP);
    return index;
  }

  function getSnappedX(clientX: number) {
    const scrollLeft = rootRef.current?.scrollLeft ?? 0;
    const offsetLeft = boundsRef.current?.offsetLeft ?? 0;
    const offset = scrollLeft - offsetLeft;

    const rootEl = rootRef.current;
    if (!rootEl) return 0;
    const rootRect = rootEl.getBoundingClientRect();
    const relativeX = clientX - rootRect.left + offset;

    const snappedX = Math.floor(relativeX / LINE_STEP) * LINE_STEP + offsetLeft - scrollLeft;

    return snappedX;
  }

  function setIndexWithSound(index: number) {
    setActiveIndex((prevIndex) => {
      const hasStopped = y.get() === y.getPrevious();
      if (prevIndex !== index && hasStopped && index !== null) {
        tick();
      }
      return index;
    });
  }

  function onPointerDown() {
    popClick();
    setPressed(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") {
      return;
    }

    lastClientX.current = e.clientX;

    if (morph) {
      const snappedX = getSnappedX(e.clientX);
      const index = getIndexFromX(snappedX);
      if (index < 0) return;
      x.set(snappedX);
      setIndexWithSound(index);
      return;
    }

    const { left, top } = e.currentTarget.getBoundingClientRect();

    const relativeClientX = e.clientX - left + e.currentTarget.offsetLeft;
    const relativeClientY = e.clientY - top + e.currentTarget.offsetTop;

    const x_ = relativeClientX - CURSOR_CENTER;
    const y_ = relativeClientY - CURSOR_CENTER;

    if (idle) {
      setIdle(false);
      x.jump(x_);
      y.jump(y_);
    } else {
      x.set(x_);
      y.set(y_);
    }
  }

  useScrollEnd(
    () => {
      if (morph && !isTouch) {
        const snappedX = getSnappedX(lastClientX.current);
        x.set(snappedX);
      }
    },
    rootRef,
    [morph, isTouch],
  );

  useMotionValueEvent(scrollX, "change", (latest) => {
    if (isTouch) {
      if (latest < 0) {
        x.set(0);
        return;
      }

      const index = Math.floor(latest / (LINE_GAP + LINE_WIDTH));
      setActiveIndex(index);
      return;
    }
    if (morph) {
      const index = getIndexFromX(latest);
      setIndexWithSound(index);
    }
  });

  const context = React.useMemo(
    () => ({
      idle,
      morph,
      activeIndex,
      setMorph,
      setIdle,
      setActiveIndex,
      x,
      y,
      isTouch,
      pressed,
      data,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, x, y, morph, idle, pressed, data],
  );

  return (
    <Provider
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={() => setPressed(false)}
      value={context}
    >
      <Lines ref={boundsRef} maxCost={maxCost} />
      <Cursor>
        <AnimatePresence mode="sync">
          <Label key={String(morph) + "date"} position="bottom">
            {activeDate}
          </Label>
          {(activeDay !== null || morph) && activeDay && (
            <motion.div
              key="meta"
              {...blur}
              className="absolute bottom-full left-[50%] mb-4 flex translate-x-[-50%] flex-col"
            >
              {activeDay.clients.map((client, index) => (
                <Meta key={`client-${index}`} modelId={client.modelId} cost={client.cost} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Cursor>
    </Provider>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Provider({
  children,
  ref,
  value,
  className,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, "value"> & {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
  value: GraphContext;
  className?: string;
  onPointerDown?: () => void;
}) {
  return (
    <div
      ref={ref}
      onPointerLeave={(e) => {
        if (e.pointerType !== "touch") {
          value.setIdle?.(true);
        }
      }}
      className={clsx(
        "flex min-h-screen items-center justify-center overflow-y-hidden px-48 max mx-auto",
        className,
      )}
      {...props}
    >
      <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Lines({
  children,
  className,
  style,
  ref,
  maxCost,
  ...props
}: {
  children?: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
  maxCost: number;
} & React.HTMLProps<HTMLDivElement>) {
  const popSnapIn = useSound("/sounds/pop-1.mp3", SOUND_OPTIONS);
  const popSnapOut = useSound("/sounds/pop-2.wav", SOUND_OPTIONS);

  const { setActiveIndex, setMorph, y, data } = useGraph();
  const rubberband = React.useRef(false);

  function onPointerEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;

    popSnapIn?.();
    setMorph(true);
    const el = ref.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const yCenter = bounds.y + (bounds.height / 2 - CURSOR_LARGE_HEIGHT / 2);

    const unsubscribe = y.on("change", (latest) => {
      if (latest === yCenter) {
        unsubscribe();
        rubberband.current = true;
      }
    });

    setTimeout(() => {
      y.set(yCenter);
    });
  }

  function onPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    popSnapOut?.();
    rubberband.current = false;
    setMorph(false);
    setTimeout(() => {
      setActiveIndex(null);
    });
  }

  function onPointerMove({ movementY, pointerType }: React.PointerEvent<HTMLDivElement>) {
    if (pointerType === "touch") return;
    if (rubberband.current) {
      movementY = movementY / 4;
      let newY = y.get() + movementY;
      y.jump(newY);
    }
  }

  return (
    <div
      ref={ref}
      className={clsx("relative flex items-end", className)}
      style={{ gap: LINE_GAP, ...style }}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      {data.map((day, i) => {
        const height = getHeightFromCost(day.cost, maxCost);
        const isFirstOfMonth = i === 0 || getMonth(day.date) !== getMonth(data[i - 1]!.date);

        return (
          <div
            key={day.date}
            className="relative flex flex-col gap-1 select-none [&>*[data-highlight=true]]:bg-[#ff4d00]"
            style={{ width: LINE_WIDTH }}
          >
            {day.cost === 0 ? (
              <div data-highlight={isFirstOfMonth} className="bg-grey-300 dark:bg-grey-600 h-1 w-full" />
            ) : (
              <div
                data-highlight={isFirstOfMonth}
                className="bg-grey-950 dark:bg-grey-100 w-full"
                style={{ height }}
              />
            )}
          </div>
        );
      })}
      {children}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Cursor({
  children,
  className,
  style,
  animate,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  animate?: TargetAndTransition;
}) {
  const isHydrated = useIsHydrated();
  const { x, y, idle, morph, pressed, isTouch } = useGraph();
  if (!isHydrated) return null;
  return (
    <motion.div
      initial={false}
      className={clsx(
        "bg-[#ff4d00] pointer-events-none fixed rounded-full [--label-offset:-36px]",
        className,
      )}
      style={{ x, y, ...style }}
      animate={{
        opacity: morph ? 1 : 0,
        width: CURSOR_WIDTH,
        height: CURSOR_LARGE_HEIGHT,
        scale: 1,
        top: isTouch ? "unset" : 0,
        left: isTouch ? "unset" : 0,
        transition: { duration: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Label({
  children,
  position,
  ...props
}: {
  children: React.ReactNode;
  position: "top" | "bottom";
}) {
  return (
    <motion.div
      className={clsx(
        "text-grey-500 dark:text-grey-400 pointer-events-none absolute left-[50%] w-fit -translate-x-1/2 font-mono text-[13px] whitespace-nowrap select-none",
        {
          "top-[--label-offset]": position === "top",
          "top-full mt-3": position === "bottom",
        },
      )}
      {...blur}
      {...props}
    >
      {children}
    </motion.div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Meta({ modelId, cost }: { modelId: string; cost: number }) {
  return (
    <div className="text-grey-950 dark:text-grey-100 flex items-center justify-center gap-2">
      <div className="font-mono text-[13px] whitespace-nowrap select-none">{modelId}</div>
      <div className="bg-grey-300 dark:bg-grey-600 h-.5 w-.5 rounded-full" />
      <div className="font-mono text-[13px] whitespace-nowrap select-none">{formatCost(cost)}</div>
    </div>
  );
}

export const blur = {
  initial: {
    opacity: 0,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
  },
  transition: {
    ease: "easeInOut",
    duration: 0.25,
  },
} as const;

////////////////////////////////////////////////////////////////////////////////

function clamp(val: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(val, min), max);
}

function getHeightFromCost(cost: number, maxCost: number) {
  if (cost === 0) return 0;
  return clamp((cost / maxCost) * 300, [1, 300]);
}

function getMonth(dateStr: string) {
  return dateStr.slice(0, 7);
}

function formatDate(dateStr: string | null) {
  if (!dateStr) {
    const now = new Date();
    return formatDateObj(now);
  }
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year!, month! - 1, day);
  return formatDateObj(date);
}

function formatDateObj(date: Date) {
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  let suffix: string;
  if (day === 1 || day === 21 || day === 31) {
    suffix = "st";
  } else if (day === 2 || day === 22) {
    suffix = "nd";
  } else if (day === 3 || day === 23) {
    suffix = "rd";
  } else {
    suffix = "th";
  }
  return `${month} ${day}${suffix}`;
}

function formatCost(cost: number) {
  return `$${cost.toFixed(2)}`;
}
