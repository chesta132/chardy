import { getProjects } from "@/cms/crud/read";
import { ProjectListPage } from "@/components/projects/ProjectListPage";
import { getPayload } from "payload";
import config from "@payload-config";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { APP_NAME, OWNER_FULLNAME } from "@/config";
import { defaultMetadata } from "@/libs/metadata";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> => {
  let { locale } = await params;
  if (!hasLocale(routing.locales, locale)) locale = "en";
  const t = await getTranslations({ locale, namespace: "Metadata.ProjectList" });

  return {
    title: {
      default: t("title", { name: OWNER_FULLNAME }),
      template: `%s | ${APP_NAME}`,
    },
    description: t("description", { name: OWNER_FULLNAME }),
    keywords: [OWNER_FULLNAME, APP_NAME, "projects", "developer's projects", "portfolio"],
    ...(await defaultMetadata(locale)),
  };
};

export const revalidate = 604800; // one week
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage() {
  const payload = await getPayload({ config });
  const projects = await getProjects(payload);

  return <ProjectListPage projects={projects.docs} />;
}
