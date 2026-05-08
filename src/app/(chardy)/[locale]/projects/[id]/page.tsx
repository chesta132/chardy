import { getProjectWithNav } from "@/cms/crud/read";
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

export default async function ProjectDetailPage({ params }: PageProps<"/[locale]/projects/[id]">) {
  const { id } = await params;

  if (Number.isNaN(Number(id))) return notFound();
  const payload = await getPayload({ config });
  const { project, nextId, prevId } = await getProjectWithNav(payload, Number(id));

  if (!project) return notFound();

  return <ProjectDetail project={project} nextId={nextId} prevId={prevId} />;
}
