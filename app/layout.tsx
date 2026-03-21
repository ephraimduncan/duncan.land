import { Analytics } from "@/components/analytics";
import { AppThemeProvider } from "@/components/mode-toggle";
import { QueryProvider } from "@/lib/query/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Agentation } from "agentation";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

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

const newsreader = Newsreader({
  subsets: ["latin"],
  style: "italic",
  variable: "--font-newsreader",
});

const newsreaderRegular = Newsreader({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-newsreader-regular",
});

const kaisei = localFont({
  src: "../public/fonts/kaisei-tokumin-latin-700-normal.woff2",
  weight: "700",
  variable: "--font-kaisei",
  display: "swap",
});

const HTML_CLASS_NAME = [
  kaisei.variable,
  newsreader.variable,
  newsreaderRegular.variable,
  GeistSans.variable,
  GeistMono.variable,
].join(" ");

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "software engineer",
    "software developer",
    "open source developer",
    "full stack developer",
    "web developer",
    "TypeScript",
    "Go",
    "React",
    "Next.js",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SOCIAL_IMAGE_PATH,
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_SUMMARY,
    creator: "@ephraimduncan",
    images: [SOCIAL_IMAGE_PATH],
  },
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

function RootProviders({ children }: RootLayoutProps) {
  return (
    <>
      <Toaster richColors />

      <QueryProvider>
        <AppThemeProvider>
          {children}
          <Analytics />
          {process.env.NODE_ENV === "development" ? (
            <Agentation endpoint="http://localhost:4747" />
          ) : null}
        </AppThemeProvider>
      </QueryProvider>
    </>
  );
}

function ProductionAnalyticsScript() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <Script
      async
      src="https://analytics.duncan.land/script.js"
      data-website-id="48972d0a-03c2-4a49-b638-d3a0ad8da3e0"
    />
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ViewTransitions>
      <html lang="en" className={HTML_CLASS_NAME} suppressHydrationWarning>
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
            rel="stylesheet"
          />
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </head>
        <body className="antialiased bg-grey-50 dark:bg-grey-950 text-grey-800 dark:text-grey-100">
          <RootProviders>{children}</RootProviders>
        </body>
        <ProductionAnalyticsScript />
      </html>
    </ViewTransitions>
  );
}
