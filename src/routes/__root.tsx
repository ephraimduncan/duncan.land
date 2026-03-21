import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppThemeProvider } from "@/components/mode-toggle";
import { QueryProvider } from "@/lib/query/providers";
import { Agentation } from "agentation";
import { Toaster } from "sonner";

import globalsCss from "@/src/globals.css?url";
import geistMonoCss from "geist/font/mono?url";
import geistSansCss from "geist/font/sans?url";

const SITE_URL = "https://ephraimduncan.com";
const SITE_NAME = "Ephraim Duncan";
const SITE_DESCRIPTION =
  "Software engineer and open-source developer building polished web experiences. Passionate about TypeScript, Go, and creating beautiful, functional software.";
const SITE_TITLE = `${SITE_NAME} — Software Engineer & Open Source Developer`;
const SITE_SUMMARY =
  "Software engineer and open-source developer building polished web experiences.";
const SOCIAL_IMAGE_PATH = "/static/images/card.png";
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: SITE_URL,
      jobTitle: "Software Engineer",
      description: SITE_SUMMARY,
      sameAs: [
        "https://github.com/ephraimduncan",
        "https://www.linkedin.com/in/ephraimduncan1/",
        "https://twitter.com/ephraimduncan",
      ],
      image: `${SITE_URL}/static/images/avatar.jpeg`,
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_SUMMARY,
      publisher: {
        "@id": PERSON_ID,
      },
    },
  ],
};

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      {
        name: "keywords",
        content:
          "software engineer, software developer, open source developer, full stack developer, web developer, TypeScript, Go, React, Next.js",
      },
      { name: "author", content: SITE_NAME },
      { name: "creator", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: SOCIAL_IMAGE_PATH },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: SITE_TITLE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_TITLE },
      { name: "twitter:description", content: SITE_SUMMARY },
      { name: "twitter:creator", content: "@ephraimduncan" },
      { name: "twitter:image", content: SOCIAL_IMAGE_PATH },
      { name: "robots", content: "index, follow" },
    ],
    links: [
      { rel: "stylesheet", href: globalsCss },
      { rel: "stylesheet", href: geistSansCss },
      { rel: "stylesheet", href: geistMonoCss },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css",
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased bg-grey-50 dark:bg-grey-950 text-grey-800 dark:text-grey-100">
        <RootProviders>{children}</RootProviders>
        {import.meta.env.PROD && (
          <script
            async
            src="https://analytics.duncan.land/script.js"
            data-website-id="48972d0a-03c2-4a49-b638-d3a0ad8da3e0"
          />
        )}
        <Scripts />
      </body>
    </html>
  );
}

function RootProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster richColors />
      <QueryProvider>
        <AppThemeProvider>
          {children}
          {import.meta.env.DEV ? (
            <Agentation endpoint="http://localhost:4747" />
          ) : null}
        </AppThemeProvider>
      </QueryProvider>
    </>
  );
}
