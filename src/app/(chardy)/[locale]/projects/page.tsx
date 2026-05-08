import { getProjects } from "@/cms/crud/read";
import { ProjectListPage } from "@/components/projects/ProjectListPage";
import { getPayload } from "payload";
import config from "@payload-config";

export default async function ProjectsPage() {
  const payload = await getPayload({config});
  const projects = await getProjects(payload);

  return <ProjectListPage projects={projects.docs} />;
}
