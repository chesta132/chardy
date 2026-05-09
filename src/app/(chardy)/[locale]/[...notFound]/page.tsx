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
