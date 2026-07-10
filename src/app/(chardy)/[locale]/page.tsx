import { AboutMe } from "@/components/home/AboutMe";
import { ContactMe } from "@/components/home/ContactMe";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAboutMe, getContactMe, getFeaturedProjects, getHero } from "@/cms/crud/read";
import { Main } from "@/components/layouts/Wrapper";
import { routing } from "@/i18n/routing";

export const revalidate = 604800; // one week
export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home() {
  const payload = await getPayload({ config });

  const [heroData, aboutMeData, contactMeData, featuredProjectsData] = await Promise.all([
    getHero(payload),
    getAboutMe(payload),
    getContactMe(payload),
    getFeaturedProjects(payload),
  ]);

  return (
    <Main className="flex flex-col flex-1 items-center justify-center overflow-x-hidden">
      <Hero data={heroData} />
      <FeaturedProjects featuredProjectsData={featuredProjectsData.docs} />
      <AboutMe data={aboutMeData} githubUrl={contactMeData.socials.github} />
      <ContactMe data={contactMeData} />
    </Main>
  );
}
