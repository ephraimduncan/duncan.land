import { createFileRoute, Link } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { AppThemeSwitcher } from "@/components/mode-toggle";
import * as FadeIn from "@/components/motion";
import { Arrow } from "@/components/ui/Arrow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { colors } from "../../styles/tokens.stylex";
import "./routes-theme.css";

const PROJECTS = [
  {
    name: "Blocks",
    description: "Clean, modern shadcn/ui blocks you can copy and paste.",
    href: "https://blocks.so?ref=duncan.land",
  },
  {
    name: "Formbase",
    description: "Backend for HTML forms with uploads, alerts, and integrations.",
    href: "https://formbase.dev?ref=duncan.land",
  },
  {
    name: "Minimal",
    description: "Simple, fast bookmark manager with private collections.",
    href: "https://minimal.so?ref=duncan.land",
  },
  {
    name: "Telemetry",
    description: "Observability for AI apps — traces with tokens, cost, and errors.",
    href: "https://telemetry.dev?ref=duncan.land",
  },
  {
    name: "Weekday",
    description: "Open-source, privacy-first calendar with AI scheduling.",
    href: "https://weekday.so?ref=duncan.land",
  },
  {
    name: "Writer",
    description: "All-in-one AI writing workspace for research, drafting, and edits.",
    href: "https://writer.so?ref=duncan.land",
  },
] as const;

export const Route = createFileRoute("/_main/")({
  component: Home,
  head: () => ({
    meta: [
      {
        title: "Ephraim Duncan — Software Engineer & Open Source Developer",
      },
    ],
  }),
});

function Home() {
  return (
    <FadeIn.Container>
      <FadeIn.Item>
        <div {...stylex.props(styles.intro)}>
          <div {...stylex.props(styles.introHeader)}>
            <h1 {...stylex.props(styles.title)}>Ephraim Duncan</h1>
            <div {...stylex.props(styles.desktopTheme)}>
              <AppThemeSwitcher />
            </div>
          </div>
          <h2 {...stylex.props(styles.subtitle)}>Design Engineer</h2>
          <div {...stylex.props(styles.mobileTheme)}>
            <AppThemeSwitcher />
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <p {...stylex.props(styles.copy, styles.copyLead)}>
          I&apos;m a software engineer and open-source developer building polished web experiences
          with magical, unique, and delightful details. As a full-stack developer, I aim to create
          beautiful and functional software that is both intuitive and enjoyable for users.
        </p>
        <p {...stylex.props(styles.copy)}>
          I have a passion for learning, and I am constantly seeking to improve my skills through
          reading and{" "}
          <Link to="/blog">
            <span className="inline-link">writing</span>
          </Link>
          . I&apos;m interested in
          <em> TypeScript</em> and <em> Go</em>, and at the same time, I&apos;m also experimenting
          with native apps with <em> Swift</em>.
        </p>
      </FadeIn.Item>
      <FadeIn.Item>
        <section {...stylex.props(styles.projects)}>
          <h2 {...stylex.props(styles.sectionTitle)}>Projects</h2>
          <ul role="list" {...stylex.props(styles.projectList)}>
            {PROJECTS.map((project) => (
              <li key={project.name}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...stylex.props(stylex.defaultMarker(), styles.projectLink)}
                >
                  <div {...stylex.props(styles.projectNameRow)}>
                    <span {...stylex.props(styles.projectName)}>{project.name}</span>
                    <span {...stylex.props(styles.projectArrow)}>
                      <Arrow size={14} />
                    </span>
                  </div>
                  <span {...stylex.props(styles.projectDescription)}>{project.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </FadeIn.Item>
      <FadeIn.Item>
        <svg
          aria-hidden="true"
          width="80"
          height="16"
          viewBox="0 0 432 38"
          fill="none"
          {...stylex.props(styles.squiggle)}
        >
          <path
            d="M402.74 37.59C390.19 37.59 374.77 21.31 374.11 20.62C367.07 12.43 359.94 5.15 349.46 5.15C337.98 5.15 324.48 20.41 324.34 20.56L323.17 21.83C315.73 29.93 308.7 37.59 296.19 37.59C283.64 37.59 268.21 21.31 267.56 20.62C260.51 12.43 253.39 5.15 242.91 5.15C231.42 5.15 217.93 20.41 217.78 20.56L216.68 21.72C208.19 30.58 201.48 37.59 189.64 37.59C177.09 37.59 161.66 21.31 161.01 20.62C153.96 12.43 146.83 5.15 136.36 5.15C124.87 5.15 111.38 20.4 111.23 20.56L110.05 21.84C102.62 29.94 95.59 37.58 83.08 37.58C70.53 37.58 55.1 21.31 54.45 20.62C47.4 12.43 40.27 5.14 29.8 5.14C19.37 5.14 9.87 10.87 4.99 20.1C4.38 21.25 2.94 21.7 1.78 21.09C0.63 20.47 0.19 19.04 0.8 17.88C6.5 7.11 17.61 0.4 29.8 0.4C42.27 0.4 50.55 8.83 57.96 17.45C61.94 21.68 74.36 32.84 83.07 32.84C93.51 32.84 99.26 26.57 106.56 18.63L107.7 17.39C108.27 16.74 122.73 0.4 136.35 0.4C148.82 0.4 157.1 8.83 164.52 17.45C168.49 21.68 180.91 32.84 189.63 32.84C199.45 32.84 204.94 27.11 213.26 18.44L214.29 17.35C214.83 16.73 229.29 0.4 242.91 0.4C255.39 0.4 263.67 8.82 271.08 17.44C275.05 21.67 287.47 32.84 296.19 32.84C306.62 32.84 312.39 26.56 319.69 18.61L320.82 17.38C321.39 16.73 335.85 0.39 349.46 0.39C361.94 0.39 370.23 8.82 377.63 17.44C381.61 21.66 394.02 32.83 402.74 32.83C412.74 32.83 422.06 27.44 427.06 18.76C427.72 17.63 429.16 17.23 430.3 17.89C431.44 18.54 431.82 19.99 431.17 21.13C425.32 31.29 414.43 37.59 402.74 37.59L402.74 37.59Z"
            fill="currentColor"
          />
        </svg>

        <ExternalLink text="follow me on x" href="https://twitter.com/ephraimduncan" />

        <ExternalLink text="let's collaborate on github" href="https://github.com/ephraimduncan" />

        <ExternalLink text="love to talk?" href="https://cal.com/ephraimduncan/short" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}

const styles = stylex.create({
  intro: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginBottom: "1rem",
  },
  introHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: "1.5rem",
    lineHeight: "2rem",
    fontWeight: 500,
    letterSpacing: "-0.025em",
    textWrap: "balance",
  },
  desktopTheme: {
    display: {
      default: "none",
      "@media (min-width: 640px)": "block",
    },
  },
  subtitle: {
    color: colors.foregroundSubtle,
    fontSize: {
      default: "1rem",
      "@media (min-width: 640px)": "1.125rem",
    },
    lineHeight: {
      default: "1.5rem",
      "@media (min-width: 640px)": "1.75rem",
    },
    textWrap: "balance",
  },
  mobileTheme: {
    display: {
      default: "block",
      "@media (min-width: 640px)": "none",
    },
  },
  copy: {
    textWrap: "pretty",
  },
  copyLead: {
    marginBottom: "0.5rem",
  },
  projects: {
    marginTop: "2.5rem",
  },
  sectionTitle: {
    color: colors.foregroundSubtle,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    textWrap: "balance",
  },
  projectList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "0.75rem",
  },
  projectLink: {
    display: "flex",
    width: "100%",
    minWidth: 0,
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
    alignItems: {
      default: "normal",
      "@media (min-width: 640px)": "center",
    },
    gap: {
      default: "0.25rem",
      "@media (min-width: 640px)": "0.75rem",
    },
  },
  projectNameRow: {
    display: "flex",
    minWidth: 0,
    alignItems: "center",
    gap: "0.125rem",
  },
  projectName: {
    overflow: "hidden",
    color: "var(--home-project-name)",
    fontSize: "1rem",
    lineHeight: "1.5rem",
    fontWeight: 500,
    textDecorationLine: {
      default: "none",
      [stylex.when.ancestor(":hover")]: "underline",
    },
    textOverflow: "ellipsis",
    textUnderlineOffset: "2px",
    whiteSpace: "nowrap",
  },
  projectArrow: {
    color: colors.foregroundSubtle,
  },
  projectDescription: {
    color: colors.foregroundSubtle,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    textWrap: {
      default: "pretty",
      "@media (min-width: 640px)": "nowrap",
    },
    overflow: {
      default: "visible",
      "@media (min-width: 640px)": "hidden",
    },
    flexGrow: {
      default: 0,
      "@media (min-width: 640px)": 1,
    },
    flexBasis: {
      default: "auto",
      "@media (min-width: 640px)": "0%",
    },
    textOverflow: {
      default: "clip",
      "@media (min-width: 640px)": "ellipsis",
    },
    whiteSpace: {
      default: "normal",
      "@media (min-width: 640px)": "nowrap",
    },
  },
  squiggle: {
    marginTop: "2.5rem",
    marginBottom: "0.5rem",
    color: colors.foreground,
  },
});
