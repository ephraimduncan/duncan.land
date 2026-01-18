import { Analytics } from "@/components/analytics";
import { AppThemeProvider } from "@/components/mode-toggle";
import { QueryProvider } from "@/lib/query/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ViewTransitions } from "next-view-transitions";
import { Newsreader } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

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

export const metadata = {
  metadataBase: new URL("https://ephraimduncan.com"),
  title: {
    default: "Ephraim Duncan — Software Engineer & Open Source Developer",
    template: "%s | Ephraim Duncan",
  },
  description:
    "Software engineer and open-source developer building polished web experiences. Passionate about TypeScript, Go, and creating beautiful, functional software.",
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
  authors: [{ name: "Ephraim Duncan", url: "https://ephraimduncan.com" }],
  creator: "Ephraim Duncan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ephraimduncan.com",
    siteName: "Ephraim Duncan",
    title: "Ephraim Duncan — Software Engineer & Open Source Developer",
    description:
      "Software engineer and open-source developer building polished web experiences. Passionate about TypeScript, Go, and creating beautiful, functional software.",
    images: [
      {
        url: "/static/images/card.png",
        width: 1200,
        height: 630,
        alt: "Ephraim Duncan — Software Engineer & Open Source Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ephraim Duncan — Software Engineer & Open Source Developer",
    description:
      "Software engineer and open-source developer building polished web experiences.",
    creator: "@ephraimduncan",
    images: ["/static/images/card.png"],
  },
  alternates: {
    canonical: "https://ephraimduncan.com",
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

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${kaisei.variable} ${newsreader.variable} ${newsreaderRegular.variable} ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
            rel="stylesheet"
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "Person",
                    "@id": "https://ephraimduncan.com/#person",
                    name: "Ephraim Duncan",
                    url: "https://ephraimduncan.com",
                    jobTitle: "Software Engineer",
                    description:
                      "Software engineer and open-source developer building polished web experiences.",
                    sameAs: [
                      "https://github.com/ephraimduncan",
                      "https://www.linkedin.com/in/ephraimduncan1/",
                      "https://twitter.com/ephraimduncan",
                    ],
                    image: "https://ephraimduncan.com/static/images/avatar.jpeg",
                  },
                  {
                    "@type": "WebSite",
                    "@id": "https://ephraimduncan.com/#website",
                    url: "https://ephraimduncan.com",
                    name: "Ephraim Duncan",
                    description:
                      "Software engineer and open-source developer building polished web experiences.",
                    publisher: {
                      "@id": "https://ephraimduncan.com/#person",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
        <body className="antialiased bg-grey-50 dark:bg-grey-950 text-grey-800 dark:text-grey-100">
          <Toaster richColors />

          <QueryProvider>
            <AppThemeProvider>
              {children}
              <Analytics />
            </AppThemeProvider>
          </QueryProvider>
        </body>
        {process.env.NODE_ENV === "production" && (
          <Script
            async
            src="https://analytics.duncan.land/script.js"
            data-website-id="48972d0a-03c2-4a49-b638-d3a0ad8da3e0"
          />
        )}
      </html>
    </ViewTransitions>
  );
}
