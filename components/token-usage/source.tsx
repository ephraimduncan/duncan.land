import * as React from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { MotionValue } from "motion/react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import * as m from "motion/react-m";
import * as Icons from "./icons";
import type { UsageDay } from "./data";
import { colors, fonts } from "../../src/styles/tokens.stylex";
import "./graph-theme.css";
import { useScrollEnd } from "@/lib/hooks/use-scroll-end";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useIsHydrated } from "@/lib/hooks/use-is-hydrated";
import { sounds } from "@/lib/sounds";

const CURSOR_SIZE = 44;
const CURSOR_CENTER = CURSOR_SIZE / 2;
const CURSOR_WIDTH = 2;
const CURSOR_LARGE_HEIGHT = 380;
const LINE_GAP = 10;
const LINE_WIDTH = 1;
const LINE_STEP = LINE_GAP + LINE_WIDTH;
const POINTER_SPRING = { stiffness: 500, damping: 40 };

////////////////////////////////////////////////////////////////////////////////

interface GraphContext {
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
const useGraph = () => React.use(GraphContext);

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
  const activeDay = activeIndex === null ? null : (data[activeIndex] ?? null);
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
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [activeIndex, x, y, morph, idle, pressed, data],
  );

  return (
    <LazyMotion features={domAnimation}>
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
              <m.div key="meta" {...blur} {...stylex.props(styles.metaList)}>
                {activeDay.clients.map((client) => (
                  <Meta
                    key={`${activeDay.date}-${client.modelId}`}
                    modelId={client.modelId}
                    cost={client.cost}
                  />
                ))}
              </m.div>
            )}
          </AnimatePresence>
        </Cursor>
      </Provider>
    </LazyMotion>
  );
}

////////////////////////////////////////////////////////////////////////////////

function Provider({
  children,
  ref,
  value,
  style,
  ...props
}: Omit<React.HTMLProps<HTMLDivElement>, "className" | "style" | "value"> & {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
  value: GraphContext;
  style?: StyleXStyles;
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
      {...stylex.props(styles.provider, style)}
      {...props}
    >
      <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

function Lines({
  children,
  style,
  ref,
  maxCost,
  ...props
}: {
  children?: React.ReactNode;
  ref: React.RefObject<HTMLDivElement | null>;
  maxCost: number;
  style?: StyleXStyles;
} & Omit<React.HTMLProps<HTMLDivElement>, "className" | "style">) {
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
      {...stylex.props(styles.lines, style)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      {data.map((day, i) => {
        const isFirstOfMonth = i === 0 || getMonth(day.date) !== getMonth(data[i - 1]!.date);
        const clients = day.clients.toSorted((a, b) => b.cost - a.cost);
        const height = getHeightFromCost(day.cost, maxCost);

        return (
          <div key={day.date} {...stylex.props(styles.day)}>
            {day.cost === 0 ? (
              <div {...stylex.props(styles.line, isFirstOfMonth && styles.highlighted)} />
            ) : clients.length === 0 ? (
              <div
                {...stylex.props(
                  styles.bar,
                  styles.barHeight(height),
                  isFirstOfMonth && styles.highlighted,
                )}
              />
            ) : (
              clients.map((client) => (
                <div
                  key={`${day.date}-${client.modelId}`}
                  {...stylex.props(
                    styles.bar,
                    styles.barHeight(getHeightFromCost(client.cost, maxCost)),
                    isFirstOfMonth && styles.highlighted,
                  )}
                />
              ))
            )}
          </div>
        );
      })}
      <div aria-hidden {...stylex.props(styles.rightHitArea)} />
      <div aria-hidden {...stylex.props(styles.bottomHitArea)} />
      {children}
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////

function Cursor({ children, style }: { children?: React.ReactNode; style?: StyleXStyles }) {
  const isHydrated = useIsHydrated();
  const { x, y, morph, isTouch } = useGraph();
  const sx = stylex.props(styles.cursor, style);
  if (!isHydrated) return null;
  return (
    <m.div
      initial={false}
      className={sx.className}
      style={{ x, y, ...sx.style }}
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
    </m.div>
  );
}

////////////////////////////////////////////////////////////////////////////////

function Label({ children, position }: { children: React.ReactNode; position: "top" | "bottom" }) {
  return (
    <m.div
      {...blur}
      {...stylex.props(styles.label, position === "top" ? styles.labelTop : styles.labelBottom)}
    >
      {children}
    </m.div>
  );
}

////////////////////////////////////////////////////////////////////////////////

function Meta({ modelId, cost }: { modelId: string; cost: number }) {
  const Icon = getModelIcon(modelId);

  return (
    <div {...stylex.props(styles.meta)}>
      {Icon && (
        <div {...stylex.props(styles.metaIcon)}>
          <Icon size={12} />
        </div>
      )}
      <div {...stylex.props(styles.metaValue)}>{getModelDisplayName(modelId)}</div>
      <div aria-hidden {...stylex.props(styles.metaDot)} />
      <div {...stylex.props(styles.metaValue)}>{formatCost(cost)}</div>
    </div>
  );
}

const blur = {
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
  "claude-opus-4-8": "Opus 4.8",
  "claude-opus-4-7": "Opus 4.7",
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
    .replace(/(\d)-(\d)/g, "$1.$2")
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

const styles = stylex.create({
  provider: {
    marginInline: "auto",
    display: "flex",
    minHeight: "100dvh",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "hidden",
    paddingInline: {
      default: "1.5rem",
      "@media (min-width: 640px)": "3rem",
      "@media (min-width: 1024px)": "12rem",
    },
  },
  metaList: {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    marginBottom: "1rem",
    display: "flex",
    transform: "translateX(-50%)",
    flexDirection: "column",
  },
  lines: {
    position: "relative",
    display: "flex",
    alignItems: "flex-end",
    gap: LINE_GAP,
  },
  day: {
    position: "relative",
    display: "flex",
    width: LINE_WIDTH,
    flexDirection: "column",
    gap: "0.125rem",
    userSelect: "none",
  },
  line: {
    width: "100%",
    height: "0.25rem",
    borderRadius: 0,
    backgroundColor: "var(--usage-graph-line)",
  },
  bar: {
    width: "100%",
    borderRadius: 0,
    backgroundColor: "var(--usage-graph-bar)",
  },
  barHeight: (height: number) => ({
    height,
  }),
  highlighted: {
    backgroundColor: "var(--usage-graph-highlight)",
  },
  rightHitArea: {
    position: "absolute",
    top: 0,
    left: "100%",
    width: LINE_GAP,
    height: "100%",
  },
  bottomHitArea: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    height: 25,
  },
  cursor: {
    "--label-offset": "-36px",
    position: "fixed",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--usage-graph-cursor)",
    pointerEvents: "none",
  },
  label: {
    position: "absolute",
    left: "50%",
    width: "fit-content",
    transform: "translateX(-50%)",
    color: colors.foregroundSubtle,
    fontFamily: fonts.mono,
    fontSize: "13px",
    whiteSpace: "nowrap",
    userSelect: "none",
    pointerEvents: "none",
  },
  labelTop: {
    top: "var(--label-offset)",
  },
  labelBottom: {
    top: "100%",
    marginTop: "0.75rem",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    color: "var(--usage-graph-meta-text)",
  },
  metaIcon: {
    display: "flex",
    width: "0.75rem",
    height: "0.75rem",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  metaValue: {
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    whiteSpace: "nowrap",
    userSelect: "none",
  },
  metaDot: {
    width: "0.25rem",
    height: "0.25rem",
    flexShrink: 0,
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--usage-graph-dot)",
  },
});
