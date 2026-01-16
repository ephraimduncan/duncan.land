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
  title: "Ephraim Duncan",
  description: "✨ My personal website and portfolio.",
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
