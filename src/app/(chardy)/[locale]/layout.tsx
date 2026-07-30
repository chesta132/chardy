import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import { GlobalErrorProvider, ViewGlobalError } from "@/contexts/GlobalError";
import SmoothScroll from "@/contexts/SmoothScroll";
import { Topbar } from "@/components/layouts/Topbar";
import { Footer } from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { APP_NAME, LOCATION, OWNER_FULLNAME } from "@/config";
import { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAIConfig, getSocials } from "@/cms/crud/read";
import { defaultMetadata } from "@/libs/metadata";
import { AIChatProvider } from "@/contexts/AIChat";
import { AIChatButton, AIChatPanel } from "@/components/ai";
import { PreferenceProvider } from "@/contexts/Preference";
import { RootLayout } from "@/components/layouts/Root";
import { GuestbookProvider } from "@/contexts/Guestbook";
import { PublicUserCacheProvider } from "@/contexts/PublicUserCache";

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
    ...(await defaultMetadata(locale)),
  };
}

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  const payload = await getPayload({ config });
  const [socials, aiConfig] = await Promise.all([getSocials({ locale, payload }), getAIConfig({ locale, payload })]);

  return (
    <RootLayout locale={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <PreferenceProvider>
          <GlobalErrorProvider>
            <PublicUserCacheProvider>
              <GuestbookProvider>
                <AIChatProvider aiConfig={aiConfig}>
                  <SmoothScroll>
                    <Topbar socials={socials} />
                    {children}
                    <Footer hideOnHomeWithXL socials={socials} />
                  </SmoothScroll>
                  <AIChatButton />
                  <AIChatPanel />
                  <ViewGlobalError />
                  <Toaster />
                </AIChatProvider>
              </GuestbookProvider>
            </PublicUserCacheProvider>
          </GlobalErrorProvider>
        </PreferenceProvider>
      </NextIntlClientProvider>
    </RootLayout>
  );
}
