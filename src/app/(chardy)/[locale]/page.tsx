import { AboutMe } from "@/components/home/AboutMe";
import { ContactMe } from "@/components/home/ContactMe";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Hero } from "@/components/home/Hero";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAboutMe, getContactMe, getFeaturedProjects, getHero } from "@/cms/crud/read";

export default async function Home() {
  const payload = await getPayload({ config });

  const heroData = await getHero(payload);
  const aboutMeData = await getAboutMe(payload);
  const contactMeData = await getContactMe(payload);
  const featuredProjectsData = await getFeaturedProjects(payload);

  return (
    <main className="flex flex-col flex-1 items-center justify-center overflow-x-hidden">
      <Hero data={heroData} />
      <FeaturedProjects featuredProjectsData={featuredProjectsData.docs} />
      <AboutMe data={aboutMeData} githubUrl={contactMeData.socials.github} />
      <ContactMe data={contactMeData} />
    </main>
  );
}
