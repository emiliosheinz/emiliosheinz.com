import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CommandBar } from "~/components/command-bar";
import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";
import {
  InteractiveCube,
  InteractiveCubeErrorBoundary,
} from "~/features/interactive-cube";
import { cn } from "~/lib/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const title = "Emilio Heinzmann";
const ogDescription =
  "I'm an experienced Software Engineer with a B.Sc. in Computer Science. With over 7 years of experience, I build scalable applications that prioritize and enhance the end-user experience. I bring ideas to life. I turn coffee into code.";

export const metadata: Metadata = {
  metadataBase: new URL("https://emiliosheinz.com"),
  title: {
    default: title,
    template: `%s | ${title}`,
  },
  description: ogDescription,
  openGraph: {
    title,
    type: "website",
    siteName: title,
    locale: "en-US",
    description: ogDescription,
    images: "/images/profile.png",
    url: "https://emiliosheinz.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title,
    images: "/images/profile.png",
    card: "summary_large_image",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

function CustomToaster() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          backgroundColor: "var(--accent)",
          color: "var(--foreground)",
        },
      }}
    />
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={cn(urbanist.className, "h-full")}
    >
      <body className="flex min-h-full">
        <div className="pb-10 pt-16 px-5 max-w-6xl m-auto">
          <ThemeProvider
            attribute={["class", "data-theme"]}
            defaultTheme="system"
          >
            <CommandBar>
              <Header />
              {children}
              <CustomToaster />
              <Analytics />
              <SpeedInsights />
              <div className="fixed right-5 bottom-5 w-20 h-20">
                <InteractiveCubeErrorBoundary>
                  <InteractiveCube />
                </InteractiveCubeErrorBoundary>
              </div>
            </CommandBar>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
