import { getTranslations } from "next-intl/server";
import { ErrorLayout } from "@/components/error";
import type { ErrorPageData } from "@/components/error";
import { OWNER_FULLNAME } from "@/config";

export const generateMetadata = async () => {
  const t = await getTranslations("Metadata.NotFound");

  return {
    title: t("title", { name: OWNER_FULLNAME }),
    description: t("description"),
  };
};

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
