import { getPayload } from "payload";
import config from "@payload-config";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { APP_URL } from "@/config";

const locales = routing.locales;
type SitemapEntry = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  // Static routes per locale
  const staticRoutes = ["/", "/projects"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    locales.map(
      (locale) =>
        ({
          url: `${APP_URL}/${locale}${route === "/" ? "" : route}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: route === "/" ? 1 : 0.8,
        }) as SitemapEntry,
    ),
  );

  // Dynamic project routes
  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const { docs: projects } = await payload.find({
      collection: "project",
      limit: 1000,
      select: { id: true, updatedAt: true },
    });

    projectEntries = projects.flatMap((project) =>
      locales.map(
        (locale) =>
          ({
            url: `${APP_URL}/${locale}/projects/${project.id}`,
            lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          }) satisfies SitemapEntry,
      ),
    );
  } catch (err) {
    console.error("[sitemap] Failed to fetch projects:", err);
  }

  return [...staticEntries, ...projectEntries];
}
