import { createFileRoute, Link } from "@tanstack/react-router";
import { AppThemeSwitcher } from "@/components/mode-toggle";
import * as FadeIn from "@/components/motion";
import { Arrow } from "@/components/ui/Arrow";
import { ExternalLink } from "@/components/ui/ExternalLink";

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
    name: "Refine",
    description: "AI humanizer that rewrites drafts into natural writing.",
    href: "https://refine.so?ref=duncan.land",
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
        <div className="mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-medium tracking-tight text-balance">Ephraim Duncan</h1>
            <div className="hidden sm:block">
              <AppThemeSwitcher />
            </div>
          </div>
          <h2 className="text-base text-grey-500 text-balance sm:text-lg dark:text-grey-400">
            Software Engineer at{" "}
            <a
              href="http://documenso.com/?ref=ephraimduncan.com"
              className="underline decoration-grey-300 underline-offset-2 hover:decoration-grey-500 dark:decoration-grey-700 dark:hover:decoration-grey-500"
            >
              Documenso
            </a>
          </h2>
          <div className="sm:hidden">
            <AppThemeSwitcher />
          </div>
        </div>
      </FadeIn.Item>

      <FadeIn.Item>
        <p className="mb-2 text-pretty">
          I&apos;m a software engineer and open-source developer building polished web experiences
          with magical, unique, and delightful details. As a full-stack developer, I aim to create
          beautiful and functional software that is both intuitive and enjoyable for users.
        </p>
        <p className="text-pretty">
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
        <section className="mt-10">
          <h2 className="text-sm text-grey-500 text-balance dark:text-grey-400">Projects</h2>
          <ul role="list" className="mt-3 flex flex-col gap-3">
            {PROJECTS.map((project) => (
              <li key={project.name}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex w-full min-w-0 flex-col sm:flex-row sm:items-center gap-1 sm:gap-3"
                >
                  <div className="flex min-w-0 items-center gap-0.5">
                    <span className="truncate text-base font-medium text-grey-900 dark:text-grey-100 group-hover:underline underline-offset-2">
                      {project.name}
                    </span>
                    <span className="text-grey-400 dark:text-grey-500">
                      <Arrow size={14} />
                    </span>
                  </div>
                  <span className="text-pretty text-sm text-grey-500 dark:text-grey-400 sm:truncate sm:flex-1">
                    {project.description}
                  </span>
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
          className="mt-10 mb-2 dark:text-grey-100 text-grey-800"
        >
          <path
            d="M402.74 37.59C390.19 37.59 374.77 21.31 374.11 20.62C367.07 12.43 359.94 5.15 349.46 5.15C337.98 5.15 324.48 20.41 324.34 20.56L323.17 21.83C315.73 29.93 308.7 37.59 296.19 37.59C283.64 37.59 268.21 21.31 267.56 20.62C260.51 12.43 253.39 5.15 242.91 5.15C231.42 5.15 217.93 20.41 217.78 20.56L216.68 21.72C208.19 30.58 201.48 37.59 189.64 37.59C177.09 37.59 161.66 21.31 161.01 20.62C153.96 12.43 146.83 5.15 136.36 5.15C124.87 5.15 111.38 20.4 111.23 20.56L110.05 21.84C102.62 29.94 95.59 37.58 83.08 37.58C70.53 37.58 55.1 21.31 54.45 20.62C47.4 12.43 40.27 5.14 29.8 5.14C19.37 5.14 9.87 10.87 4.99 20.1C4.38 21.25 2.94 21.7 1.78 21.09C0.63 20.47 0.19 19.04 0.8 17.88C6.5 7.11 17.61 0.4 29.8 0.4C42.27 0.4 50.55 8.83 57.96 17.45C61.94 21.68 74.36 32.84 83.07 32.84C93.51 32.84 99.26 26.57 106.56 18.63L107.7 17.39C108.27 16.74 122.73 0.4 136.35 0.4C148.82 0.4 157.1 8.83 164.52 17.45C168.49 21.68 180.91 32.84 189.63 32.84C199.45 32.84 204.94 27.11 213.26 18.44L214.29 17.35C214.83 16.73 229.29 0.4 242.91 0.4C255.39 0.4 263.67 8.82 271.08 17.44C275.05 21.67 287.47 32.84 296.19 32.84C306.62 32.84 312.39 26.56 319.69 18.61L320.82 17.38C321.39 16.73 335.85 0.39 349.46 0.39C361.94 0.39 370.23 8.82 377.63 17.44C381.61 21.66 394.02 32.83 402.74 32.83C412.74 32.83 422.06 27.44 427.06 18.76C427.72 17.63 429.16 17.23 430.3 17.89C431.44 18.54 431.82 19.99 431.17 21.13C425.32 31.29 414.43 37.59 402.74 37.59L402.74 37.59Z"
            fill="currentColor"
          />
        </svg>

        <ExternalLink text="follow me on x" href="https://twitter.com/ephraimduncan" />

        <ExternalLink text="let's collaborate on github" href="https://github.com/ephraimduncan" />

        <ExternalLink text="love to talk?" href="https://cal.com/ephraimduncan/30min" />
      </FadeIn.Item>
    </FadeIn.Container>
  );
}
