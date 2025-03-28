import "./globals.css";

import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import { Urbanist } from "next/font/google";
import { Header } from "~/components/header";
import { CommandBar } from "~/components/command-bar";
import { ThemeProvider } from "~/components/theme-provider";
import { cn } from "~/lib/utils";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const title = "Emilio Heinzmann"
const ogDescription =
  "As an experienced Software Engineer graduated with a B.Sc. degree in Computer Science, I have been working on the development of applications that are daily accessed by thousands of users since 2019. I bring ideas to life through lines of code.";

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
          backgroundColor: "#1A1A1A",
          color: "#FFFFFF",
        },
      }}
    />
  );
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html suppressHydrationWarning lang="en" className={cn(urbanist.className, 'h-full bg-background')}>
      <body className="pb-10 pt-14 px-5 max-w-6xl m-auto min-h-full flex">
        <ThemeProvider attribute="class" defaultTheme="system">
          <CommandBar>
            <Header />
            {children}
            <CustomToaster />
            <Analytics />
            <SpeedInsights />
          </CommandBar>
        </ThemeProvider>
      </body>
    </html>
  );
}
