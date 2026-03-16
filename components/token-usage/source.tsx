"use client";

import * as React from "react";
import type { MotionValue, TargetAndTransition } from "motion/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import clsx from "clsx";
import type { Activity } from "./data";
import { data } from "./data";
import * as Icons from "./icons";
import { useScrollEnd } from "@/lib/hooks/use-scroll-end";
import { useSound } from "@/lib/hooks/use-sound";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";

export const CURSOR_SIZE = 44;
export const CURSOR_CENTER = CURSOR_SIZE / 2;
export const CURSOR_WIDTH = 2;
export const CURSOR_LARGE_HEIGHT = 400;
export const LINE_GAP = 6;
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
}

const GraphContext = React.createContext<GraphContext>({} as GraphContext);
export const useGraph = () => React.useContext(GraphContext);

////////////////////////////////////////////////////////////////////////////////

export default function LineGraph() {
  const isTouch = useMediaQuery("(hover: none)");

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const boundsRef = React.useRef<HTMLDivElement | null>(null);

  const [morph, setMorph] = React.useState(isTouch);
  const [idle, setIdle] = React.useState(!isTouch);
  const [pressed, setPressed] = React.useState(false);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const activities = data.filter((a) => a.index === activeIndex);
  const activeDate = getFormattedDateByIndex(activeIndex);

  const { scrollX } = useScroll({ container: rootRef });
  const x = useSpring(0, POINTER_SPRING);
  const y = useSpring(0, POINTER_SPRING);

  const lastClientX = React.useRef(0);

  const tick = useSound("/sounds/tick.mp3", SOUND_OPTIONS);
  const popClick = useSound("/sounds/pop-click.wav", SOUND_OPTIONS);

  function getIndexFromX(x: number) {
    const scrollLeft = rootRef.current?.scrollLeft ?? 0;
    const offsetLeft = boundsRef.current?.offsetLeft ?? 0;
    // Account for possible padding, and ignore (subtract) the scroll position
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

    // Take into account any margins or padding on the parent element
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, x, y, morph, idle, pressed],
  );

  return (
    <Provider
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={() => setPressed(false)}
      value={context}
    >
      {/* Lines */}
      <Lines ref={boundsRef} />
      {/* Cursor */}
      <Cursor>
        <AnimatePresence mode="sync">
          <Label key={String(morph) + "date"} position="bottom">
            {activeDate}
          </Label>
          {(activities.length > 0 || morph) && (
            <motion.div
              key="meta"
              {...blur}
              className="absolute bottom-full left-[50%] mb-4 flex translate-x-[-50%] flex-col"
            >
              {activities.map((activity, index) => (
                <Meta key={`activity-${index}`} activity={activity} />
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
        "flex min-h-screen items-center overflow-y-hidden px-48 max",
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
  ...props
}: {
  children?: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
} & React.HTMLProps<HTMLDivElement>) {
  const popSnapIn = useSound("/sounds/pop-1.mp3", SOUND_OPTIONS);
  const popSnapOut = useSound("/sounds/pop-2.wav", SOUND_OPTIONS);

  const { setActiveIndex, setMorph, y } = useGraph();
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
      {Array.from({ length: 365 }).map((_, i) => {
        const activities = Array.from(data)
          .toSorted((a, b) => b.moving_time - a.moving_time)
          .filter((a) => a.index === i);

        let isNewMonth = false;
        let totalDaysPassed = 0;

        for (let month = 0; month < daysInMonth.length; month++) {
          const days = daysInMonth[month] ?? 0;
          if (totalDaysPassed + days > i) {
            isNewMonth = totalDaysPassed === i;
            break;
          }
          totalDaysPassed += days;
        }

        return (
          <div
            key={`day-${i}`}
            className="relative flex flex-col gap-1 select-none [&>*[data-highlight=true]]:bg-[#ff4d00]"
            style={{
              width: LINE_WIDTH,
            }}
          >
            {activities.length === 0 ? (
              <div data-highlight={isNewMonth} className="bg-grey-300 dark:bg-grey-600 h-8 w-full" />
            ) : (
              activities.map((activity) => {
                return (
                  <div
                    key={activity.id}
                    data-highlight={isNewMonth}
                    className="bg-grey-950 dark:bg-grey-100 w-full"
                    style={{ height: getHeightFromMovingTime(activity) }}
                  />
                );
              })
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

export function Meta({ activity }: { activity: Activity }) {
  const isYoga = activity?.type === "Yoga";
  const isRun = activity?.type === "Run";
  const isWalk = activity?.type === "Walk";
  const isRow = activity?.type === "Rowing";
  const isGym = activity?.type === "Workout" || activity?.type === "WeightTraining";
  const isRide = activity?.type === "Ride" || activity?.type === "VirtualRide";

  const title = React.useMemo(() => {
    if (isRun || isWalk || isRow || isRide) {
      return convertDistanceToKm(activity?.distance);
    }
    if (isYoga || isGym) {
      return activity?.average_heartrate.toFixed(0) + "bpm";
    }
    return "Rest";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  const subtitle = React.useMemo(() => {
    if (isRide) {
      return getAvgSpeedKmh(activity).toFixed(1) + "km/h";
    }
    if (isRun || isRow) {
      return convertToPace(activity?.distance, activity?.moving_time);
    }
    if (isWalk) {
      return formatTime(activity?.moving_time);
    }
    if (isYoga || isGym) {
      return formatTime(activity?.moving_time);
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  const icon = React.useMemo(() => {
    if (isRun) return <Icons.RunIcon />;
    if (isRide) return <Icons.RideIcon />;
    if (isWalk) return <Icons.WalkIcon />;
    if (isYoga) return <Icons.YogaIcon />;
    if (isRow) return <Icons.RunIcon />;
    if (isGym) return <Icons.GymIcon />;
    return <Icons.RestIcon />;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity]);

  return (
    <div className="text-grey-950 dark:text-grey-100 flex items-center justify-center gap-2">
      {icon}
      <div className="font-mono text-sm whitespace-nowrap select-none">{title}</div>
      {subtitle && <div className="bg-grey-300 dark:bg-grey-600 h-.5 w-.5 rounded-full" />}
      <div className="font-mono text-sm whitespace-nowrap select-none">{subtitle}</div>
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

export function Time() {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    setTime(getTime());

    const id = setInterval(() => {
      setTime(getTime());
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return time;
}

export function getTime(): string {
  const date = new Date().toLocaleTimeString([], {
    timeZone: "Europe/Tallinn",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const [, time] = date.split(", ");
  return time ?? date;
}

function clamp(val: number, [min, max]: [number, number]): number {
  return Math.min(Math.max(val, min), max);
}

export function getHeightFromMovingTime(activity: Activity) {
  return clamp((activity?.moving_time ?? 0) / 50, [30, 300]);
}

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

export function convertDistanceToKm(distance: number) {
  if (!distance) {
    return null;
  }
  return (distance / 1000).toFixed(2) + "km";
}

export const daysInMonth = Array.from({ length: 12 }, (_, month) => {
  if (month === 1) {
    return isLeapYear(new Date().getFullYear()) ? 29 : 28;
  }
  return new Date(new Date().getFullYear(), month + 1, 0).getDate();
});

export function getFormattedDateByIndex(index: number | null) {
  let currentDate = new Date();

  if (index !== null) {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    currentDate = new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000);
  }

  const month = currentDate.toLocaleString("default", { month: "short" });
  const day = currentDate.getDate();

  let suffix;
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

function convertToPace(distance: number, movingTime: number) {
  // Calculate the pace in minutes per kilometer
  let paceInMinutesPerKm = ((movingTime / distance) * 1000) / 60;
  // Convert the pace to minutes and seconds
  let minutes = Math.floor(paceInMinutesPerKm);
  let seconds = Math.floor((paceInMinutesPerKm - minutes) * 60);
  // Cap the seconds at 59
  if (seconds >= 60) {
    seconds = 59;
  }
  // Keep leading zero for seconds if necessary
  let secondsFormatted = seconds.toString().padStart(2, "0");
  // Format the pace as {x}:{xx} min/km
  let formattedPace = minutes.toString() + ":" + secondsFormatted + "m/km";
  // Return the formatted pace
  return formattedPace;
}

function getAvgSpeedKmh(activity: Activity) {
  const KMH_MULTIPLIER = 3.6;
  return Math.round(activity.average_speed * KMH_MULTIPLIER);
}
