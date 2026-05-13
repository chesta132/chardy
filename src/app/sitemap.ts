import { getPayload } from "payload";
import config from "@payload-config";
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { APP_URL } from "@/config";

const locales = routing.locales;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });

  // Static routes per locale
  const staticRoutes = ["/", "/projects"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${APP_URL}${route === "/" ? "" : route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.8,
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, `${APP_URL}/${locale}${route === "/" ? "" : route}`])),
    },
  }));

  // Dynamic project routes
  let projectEntries: MetadataRoute.Sitemap = [];

  try {
    const { docs: projects } = await payload.find({
      collection: "project",
      limit: 1000,
      select: { id: true, updatedAt: true },
    });

    projectEntries = projects.map((project) => ({
      url: `${APP_URL}/projects/${project.id}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: Object.fromEntries(locales.map((locale) => [locale, `${APP_URL}/${locale}/projects/${project.id}`])),
      },
    }));
  } catch (err) {
    console.error("[sitemap] Failed to fetch projects:", err);
  }

  return [...staticEntries, ...projectEntries];
}
