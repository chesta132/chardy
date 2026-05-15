import { getPayload } from "payload";
import config from "@payload-config";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ErrorLayout, ErrorPageData } from "@/components/error";
import { getTranslations } from "next-intl/server";
import { getProject } from "@/cms/crud/read";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { APP_NAME, OWNER_FULLNAME } from "@/config";
import { defaultMetadata } from "@/libs/metadata";
import { generateMetadata as generateNotFoundMetadata } from "../../[...notFound]/page";
import { Metadata } from "next";

type Props = PageProps<"/[locale]/projects/[id]">;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  let { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) locale = "en";
  const t = await getTranslations({ locale, namespace: "Metadata.ProjectDetail" });

  const payload = await getPayload({ config });
  const project = await getProject(payload, Number(id));
  if (!project) {
    return {
      ...(await generateNotFoundMetadata()),
      description: t("notFoundDescription"),
    };
  }

  return {
    title: {
      default: t("title", { name: OWNER_FULLNAME, title: project.title }),
      template: `%s | ${APP_NAME}`,
    },
    description: t("description", { name: OWNER_FULLNAME, title: project.title }),
    keywords: [OWNER_FULLNAME, APP_NAME, ...project.tags.map(({ tag }) => tag)],
    ...(await defaultMetadata(locale)),
  };
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("ProjectDetail");

  const notFound: ErrorPageData = {
    code: "404",
    title: t("notFound.title"),
    description: t("notFound.description", { id }),
    actionLabel: t("notFound.action"),
    actionHref: "/projects",
    variant: "not-found",
  };

  if (Number.isNaN(Number(id))) return <ErrorLayout data={notFound} />;
  const payload = await getPayload({ config });
  const project = await getProject(payload, Number(id));

  if (!project) return <ErrorLayout data={notFound} />;

  return <ProjectDetail project={project} />;
}
