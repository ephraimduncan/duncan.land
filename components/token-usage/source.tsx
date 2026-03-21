import * as React from "react";
import type { MotionValue } from "motion/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import clsx from "clsx";
import * as Icons from "./icons";
import type { UsageDay } from "./data";
import { useScrollEnd } from "@/lib/hooks/use-scroll-end";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";
import { sounds } from "@/lib/sounds";

export const CURSOR_SIZE = 44;
export const CURSOR_CENTER = CURSOR_SIZE / 2;
export const CURSOR_WIDTH = 2;
export const CURSOR_LARGE_HEIGHT = 380;
export const LINE_GAP = 10;
export const LINE_WIDTH = 1;
export const LINE_STEP = LINE_GAP + LINE_WIDTH;
export const POINTER_SPRING = { stiffness: 500, damping: 40 };

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

export default function TokenUsageGraph({ data }: { data: UsageDay[] }) {
  const isTouch = useMediaQuery("(hover: none)");

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const boundsRef = React.useRef<HTMLDivElement | null>(null);

  const [morph, setMorph_] = React.useState(isTouch);
  const morphRef = React.useRef(isTouch);
  const setMorph = React.useCallback((v: React.SetStateAction<boolean>) => {
    const next = typeof v === "function" ? v(morphRef.current) : v;
    morphRef.current = next;
    setMorph_(next);
  }, []);
  const [idle, setIdle] = React.useState(!isTouch);
  const [pressed, setPressed] = React.useState(false);

  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const activeDay = activeIndex === null ? null : data[activeIndex] ?? null;
  const activeDate = formatDate(activeDay?.date ?? null);

  const { scrollX } = useScroll({ container: rootRef });
  const x = useSpring(0, POINTER_SPRING);
  const y = useSpring(0, POINTER_SPRING);

  const lastClientX = React.useRef(0);

  const isTinyDevice = useMediaQuery("(max-width: 480px)");
  const soundEnabled = !isTouch && !isTinyDevice;

  const maxCost = React.useMemo(() => Math.max(...data.map((d) => d.cost), 1), [data]);

  function clampIndex(index: number) {
    return Math.max(0, Math.min(data.length - 1, index));
  }

  function getIndexFromClientX(clientX: number) {
    const boundsEl = boundsRef.current;
    if (!boundsEl) return 0;
    return Math.floor((clientX - boundsEl.getBoundingClientRect().left) / LINE_STEP);
  }

  function getSnappedX(index: number) {
    const boundsEl = boundsRef.current;
    if (!boundsEl) return 0;
    return boundsEl.getBoundingClientRect().left + index * LINE_STEP;
  }

  function getClampedIndex(clientX: number) {
    const rawIndex = getIndexFromClientX(clientX);
    if (rawIndex < 0) return null;
    return clampIndex(rawIndex);
  }

  function setIndexWithSound(index: number) {
    setActiveIndex((prevIndex) => {
      const hasStopped = y.get() === y.getPrevious();
      if (prevIndex !== index && hasStopped && soundEnabled) {
        sounds.tick();
      }
      return index;
    });
  }

  function onPointerDown() {
    if (soundEnabled) sounds.click();
    setPressed(true);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") {
      return;
    }

    lastClientX.current = e.clientX;

    if (morphRef.current) {
      const index = getClampedIndex(e.clientX);
      if (index === null) return;
      x.set(getSnappedX(index));
      setIndexWithSound(index);
      return;
    }

    if (idle) {
      setIdle(false);
    }
  }

  useScrollEnd(
    () => {
      if (morph && !isTouch) {
        const index = getClampedIndex(lastClientX.current);
        if (index === null) return;
        x.set(getSnappedX(index));
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

      const index = Math.floor(latest / LINE_STEP);
      setActiveIndex(index);
      return;
    }
    if (morph) {
      const index = getClampedIndex(x.get());
      if (index === null) return;
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
          {activeDay && (
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
          value.setIdle(true);
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
  const isTouch = useMediaQuery("(hover: none)");
  const { setActiveIndex, setMorph, y, data } = useGraph();

  function onPointerEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;

    if (!isTouch) {
      sounds.popIn();
    }
    setMorph(true);
    const el = ref.current;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const yTop = bounds.top - CURSOR_LARGE_HEIGHT + bounds.height;
    y.jump(yTop);
  }

  function onPointerLeave(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    if (!isTouch) {
      sounds.popOut();
    }
    setMorph(false);
    setTimeout(() => {
      setActiveIndex(null);
    });
  }

  return (
    <div
      ref={ref}
      className={clsx("relative flex items-end", className)}
      style={{ gap: LINE_GAP, ...style }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      {data.map((day, i) => {
        const isFirstOfMonth = i === 0 || getMonth(day.date) !== getMonth(data[i - 1]!.date);
        const clients = [...day.clients].sort((a, b) => b.cost - a.cost);
        const height = getHeightFromCost(day.cost, maxCost);

        return (
          <div
            key={day.date}
            className="relative flex flex-col gap-0.5 select-none [&>*[data-highlight=true]]:bg-grey-600 dark:[&>*[data-highlight=true]]:bg-grey-300"
            style={{ width: LINE_WIDTH }}
          >
            {day.cost === 0 ? (
              <div data-highlight={isFirstOfMonth} className="bg-grey-300 dark:bg-grey-600 h-1 w-full rounded-none" />
            ) : clients.length === 0 ? (
              <div
                data-highlight={isFirstOfMonth}
                className="bg-grey-950 dark:bg-grey-100 w-full rounded-none"
                style={{ height }}
              />
            ) : (
              clients.map((client, index) => (
                <div
                  key={`${day.date}-${client.modelId}-${index}`}
                  data-highlight={isFirstOfMonth}
                  className="bg-grey-950 dark:bg-grey-100 w-full rounded-none"
                  style={{ height: getHeightFromCost(client.cost, maxCost) }}
                />
              ))
            )}
          </div>
        );
      })}
      <div aria-hidden className="absolute top-0 left-full" style={{ width: LINE_GAP, height: "100%" }} />
      <div aria-hidden className="absolute top-full left-0" style={{ width: "100%", height: 25 }} />
      {children}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

export function Cursor({
  children,
  className,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const isHydrated = useIsHydrated();
  const { x, y, morph, isTouch } = useGraph();
  if (!isHydrated) return null;
  return (
    <motion.div
      initial={false}
      className={clsx(
        "bg-grey-400 dark:bg-grey-500 pointer-events-none fixed rounded-full [--label-offset:-36px]",
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
        transition: { opacity: { duration: 0.15, ease: "easeOut" }, duration: 0 },
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
  const Icon = getModelIcon(modelId);

  return (
    <div className="text-grey-950 dark:text-grey-100 flex items-center justify-center gap-2">
      {Icon && (
        <div className="flex size-3 shrink-0 items-center justify-center">
          <Icon size={12} />
        </div>
      )}
      <div className="font-mono text-sm whitespace-nowrap select-none">{getModelDisplayName(modelId)}</div>
      <div aria-hidden className="bg-grey-300 dark:bg-grey-600 h-1 w-1 shrink-0 rounded-full" />
      <div className="font-mono text-sm whitespace-nowrap select-none">{formatCost(cost)}</div>
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

const MODEL_DISPLAY_NAMES: Record<string, string> = {
  "claude-opus-4-6": "Opus 4.6",
  "claude-opus-4-5": "Opus 4.5",
  "claude-sonnet-4-6": "Sonnet 4.6",
  "claude-sonnet-4-5": "Sonnet 4.5",
  "claude-haiku-4-5": "Haiku 4.5",
  "claude-3.5-haiku": "Haiku 3.5",
  "gpt-5.4": "GPT-5.4",
  "gpt-5.3-codex": "GPT-5.3 Codex",
  "gpt-5.3-codex-spark": "GPT-5.3 Codex Spark",
  "gpt-5.2": "GPT-5.2",
  "gpt-5.2-codex": "GPT-5.2 Codex",
  "gpt-5.1-codex": "GPT-5.1 Codex",
  "gpt-5.1-codex-max": "GPT-5.1 Codex Max",
  "gpt-5-codex": "GPT-5 Codex",
  "gemini-3-flash-preview": "Gemini 3 Flash",
  "gemini-3-pro-preview": "Gemini 3 Pro",
  "gemini-3.1-pro-preview-customtools": "Gemini 3.1 Pro",
  "antigravity-gemini-3.1-pro": "Antigravity Gemini 3.1 Pro",
  "glm-4.7": "GLM 4.7",
  "glm-4.7-free": "GLM 4.7",
  "kimi-k2.5-free": "Kimi K2.5",
};

type ModelIconComponent = ({ size }: { size?: number }) => React.JSX.Element;

function getModelDisplayName(modelId: string) {
  return MODEL_DISPLAY_NAMES[modelId] ?? formatFallbackModelName(modelId);
}

function getModelIcon(modelId: string): ModelIconComponent | null {
  if (modelId.startsWith("claude-")) return Icons.ClaudeIcon;
  if (modelId.startsWith("gpt-")) return Icons.OpenAIIcon;
  if (modelId.startsWith("antigravity-")) return Icons.AntigravityIcon;
  if (modelId.startsWith("gemini-")) return Icons.GeminiIcon;
  if (modelId.startsWith("kimi-")) return Icons.KimiIcon;
  if (modelId.startsWith("glm-")) return Icons.GLMIcon;
  return null;
}

function formatFallbackModelName(modelId: string) {
  return modelId
    .split("-")
    .map((part) => {
      if (part === "gpt" || part === "glm") return part.toUpperCase();
      if (part === "claude") return "Claude";
      if (part === "gemini") return "Gemini";
      if (part === "kimi") return "Kimi";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}
