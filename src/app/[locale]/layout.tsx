import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import { GlobalErrorProvider, ViewGlobalError } from "@/contexts/GlobalError";
import SmoothScroll from "@/contexts/SmoothScroll";
import { Topbar } from "@/components/layouts/Topbar";
import { Footer } from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { getMessages, getTranslations } from "next-intl/server";
import { APP_NAME, APP_URL, LOCATION, OWNER_FULLNAME } from "@/config";
import { Metadata } from "next";

type MetadataProps = {
  params: Promise<{ locale?: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  let { locale } = await params;
  if (!hasLocale(routing.locales, locale)) locale = "en";
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: {
      default: t("title", { name: OWNER_FULLNAME }),
      template: `%s | ${APP_NAME}`,
    },
    description: t("description", { name: OWNER_FULLNAME, location: LOCATION }),
    keywords: [
      OWNER_FULLNAME,
      APP_NAME,
      "Frontend Developer",
      "Fullstack Developer",
      "Backend Developer",
      "Golang",
      "TypeScript",
      "Go Developer",
      "Portfolio",
      "Indonesia",
      "Bekasi",
    ],
    authors: [{ name: OWNER_FULLNAME, url: APP_URL }],
    creator: OWNER_FULLNAME,
    metadataBase: new URL(APP_URL),

    openGraph: {
      title: t("title", { name: OWNER_FULLNAME }),
      description: t("og.description", { location: LOCATION }),
      url: APP_URL,
      siteName: APP_NAME,
      locale: t("og.locale"),
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title", { name: OWNER_FULLNAME }),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t("title", { name: OWNER_FULLNAME }),
      description: t("twitter.description", { location: LOCATION }),
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

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  const messages = await getMessages();
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <GlobalErrorProvider>
        <SmoothScroll>
          <Topbar />
          {children}
          <Footer hideOnHomeWithXL />
        </SmoothScroll>
        <ViewGlobalError />
        <Toaster />
      </GlobalErrorProvider>
    </NextIntlClientProvider>
  );
}
