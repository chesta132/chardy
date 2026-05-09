/**
 * Explicit forbidden route rendered when the user tries to access
 * a resource they don't have permission for.
 *
 * Trigger by redirecting to /<locale>/forbidden from a middleware
 * or server action when an auth check fails.
 */

import { getTranslations } from "next-intl/server";
import { ErrorLayout } from "@/components/error";
import type { ErrorPageData } from "@/components/error";

export default async function ForbiddenPage() {
  const t = await getTranslations("Error.Pages.Forbidden");

  const data: ErrorPageData = {
    variant: "forbidden",
    code: "403",
    title: t("title"),
    description: t("description"),
    actionLabel: t("action"),
    actionHref: "/",
  };

  return <ErrorLayout data={data} />;
}
