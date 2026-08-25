import * as stylex from "@stylexjs/stylex";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import TokenUsageGraph from "@/components/token-usage/source";
import { fetchUsageData } from "@/components/token-usage/data";
import { colors, fonts } from "../styles/tokens.stylex";

const loadUsageData = createServerFn({ method: "GET" }).handler(() => {
  return fetchUsageData();
});

export const Route = createFileRoute("/token-usage")({
  loader: () => loadUsageData(),
  head: () => ({
    meta: [{ title: "Token Usage | Ephraim Duncan" }],
  }),
  component: TokenUsagePage,
  errorComponent: () => (
    <div {...stylex.props(styles.center)}>
      <div {...stylex.props(styles.message)}>
        <Link to="/" aria-label="Back to home" {...stylex.props(styles.backLink)}>
          ←
        </Link>
        <p {...stylex.props(styles.messageCopy)}>Failed to load usage data</p>
      </div>
    </div>
  ),
});

function formatCost(cost: number) {
  return cost.toFixed(2);
}

function TokenUsagePage() {
  const data = Route.useLoaderData();

  if (data.length === 0) {
    return (
      <div {...stylex.props(styles.center)}>
        <div {...stylex.props(styles.message)}>
          <Link to="/" aria-label="Back to home" {...stylex.props(styles.backLink)}>
            ←
          </Link>
          <p {...stylex.props(styles.messageCopy)}>No usage data available</p>
        </div>
      </div>
    );
  }

  const totalCost = data.reduce((sum, day) => sum + day.cost, 0);

  return (
    <>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInner)}>
          <Link
            to="/"
            aria-label="Back to home"
            {...stylex.props(styles.headerText, styles.headerLink)}
          >
            ←
          </Link>
          <div {...stylex.props(styles.headerText, styles.total)}>${formatCost(totalCost)}</div>
        </div>
      </header>
      <TokenUsageGraph data={data} />
    </>
  );
}

const styles = stylex.create({
  center: {
    display: "flex",
    minHeight: "100dvh",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    fontFamily: fonts.mono,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
  backLink: {
    color: colors.foreground,
  },
  messageCopy: {
    marginTop: "1rem",
    color: colors.foregroundSubtle,
  },
  header: {
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 50,
    paddingTop: "30px",
    paddingBottom: "0.75rem",
  },
  headerInner: {
    marginInline: "auto",
    display: "flex",
    width: "100%",
    maxWidth: "712px",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: "1rem",
  },
  headerText: {
    color: colors.foreground,
    fontFamily: fonts.mono,
    fontSize: "0.75rem",
    lineHeight: "1rem",
  },
  headerLink: {
    pointerEvents: "auto",
  },
  total: {
    fontVariantNumeric: "tabular-nums",
  },
});
