import { getProjectWithNav } from "@/cms/crud/read";
import { getPayload } from "payload";
import config from "@payload-config";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { ErrorLayout, ErrorPageData } from "@/components/error";
import { getTranslations } from "next-intl/server";

export default async function ProjectDetailPage({ params }: PageProps<"/[locale]/projects/[id]">) {
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
  const { project, nextId, prevId } = await getProjectWithNav(payload, Number(id));

  if (!project) return <ErrorLayout data={notFound} />;

  return <ProjectDetail project={project} nextId={nextId} prevId={prevId} />;
}
