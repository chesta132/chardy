import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import React from "react";
import { GlobalErrorProvider, ViewGlobalError } from "@/contexts/GlobalError";
import SmoothScroll from "@/contexts/SmoothScroll";
import { Topbar } from "@/components/layouts/Topbar";
import { Footer } from "@/components/layouts/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { getMessages } from "next-intl/server";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
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
