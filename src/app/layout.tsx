import type { Metadata } from "next";
import "../assets/styles/main.css";
import { inter } from "@/fonts/inter";
import { neueMontreal } from "@/fonts/neueMontreal";
import { PPSuplyMono, PPSuplySans } from "@/fonts/ppSupply";
import SmoothScroll from "@/contexts/SmoothScroll";
import { cn } from "@/libs/utils";
import { Topbar } from "@/components/layouts/Topbar";
import { Footer } from "@/components/layouts/Footer";
import { GlobalErrorProvider, ViewGlobalError } from "@/contexts/GlobalError";
import { Toaster } from "@/components/ui/Toaster";
import { APP_URL } from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  // TODO: update to get data from cms
  // TODO: add i18n

  return {
    title: {
      default: "Chardy — Chesta Ardiona",
      template: "%s | Chardy",
    },
    description:
      "Personal portfolio of Chesta Ardiona — a fullstack developer from Bekasi, Indonesia. Specializing in backend development with Go and TypeScript.",
    keywords: [
      "Chesta Ardiona",
      "Chardy",
      "Fullstack Developer",
      "Backend Developer",
      "Golang",
      "TypeScript",
      "Go Developer",
      "Portfolio",
      "Indonesia",
      "Bekasi",
    ],
    authors: [{ name: "Chesta Ardiona", url: APP_URL }],
    creator: "Chesta Ardiona",
    metadataBase: new URL(APP_URL),

    openGraph: {
      title: "Chardy — Chesta Ardiona",
      description: "Web developer from Bekasi, Indonesia. Building clean, modern, and performant web experiences.",
      url: APP_URL,
      siteName: "Chardy",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Chardy — Chesta Ardiona Portfolio",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: "Chardy — Chesta Ardiona",
      description: "Web developer from Bekasi, Indonesia. TypeScript, React, Next.js, Golang, and more.",
      images: ["/og-image.png"],
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16" },
        { url: "/favicon-32x32.png", sizes: "32x32" },
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, neueMontreal.variable, PPSuplySans.variable, PPSuplyMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <GlobalErrorProvider>
          <SmoothScroll>
            <Topbar />
            {children}
            <Footer className="xl:hidden" />
          </SmoothScroll>
          <ViewGlobalError />
          <Toaster />
        </GlobalErrorProvider>
      </body>
    </html>
  );
}
