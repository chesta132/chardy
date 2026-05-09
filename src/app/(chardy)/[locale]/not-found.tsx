/**
 * Rendered automatically by Next.js when notFound() is called
 * or when a route simply doesn't exist.
 *
 * next-intl is not available inside the root not-found boundary,
 * so this page lives under the [locale] segment to get the locale
 * from the URL and resolve translations properly.
 */

import { getTranslations } from "next-intl/server";
import { ErrorLayout } from "@/components/error";
import type { ErrorPageData } from "@/components/error";

export default async function NotFoundPage() {
  const t = await getTranslations("Error.Pages.NotFound");

  const data: ErrorPageData = {
    variant: "not-found",
    code: "404",
    title: t("title"),
    description: t("description"),
    actionLabel: t("action"),
    actionHref: "/",
  };

  return <ErrorLayout data={data} />;
}
