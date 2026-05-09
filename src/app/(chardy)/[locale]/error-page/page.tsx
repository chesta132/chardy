/**
 * Generic error page that accepts arbitrary error details via query params.
 *
 * Usage: redirect to /<locale>/error?code=422&message=Unprocessable+Entity
 *
 * This keeps one-off error scenarios out of the error.tsx boundary
 * while still giving users a consistent, branded experience.
 */

import { getTranslations } from "next-intl/server";
import { ErrorLayout } from "@/components/error";
import type { ErrorPageData } from "@/components/error";

interface CustomErrorPageProps {
  searchParams: Promise<{
    code?: string;
    message?: string;
  }>;
}

export default async function CustomErrorPage({ searchParams }: CustomErrorPageProps) {
  const t = await getTranslations("Error.Pages.Custom");
  const { code, message } = await searchParams;

  const data: ErrorPageData = {
    variant: "custom",
    // Fall back to generic "ERR" when no code is provided
    code: code ?? "ERR",
    title: t("title"),
    // Prefer the message from the query string; fall back to translation
    description: message ?? t("description"),
    actionLabel: t("action"),
    actionHref: "/",
  };

  return <ErrorLayout data={data} />;
}
