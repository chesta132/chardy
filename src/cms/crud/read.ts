import { BasePayload } from "payload";
import { withCache } from "../cache";
import { getLocale as getLocaleServer } from "next-intl/server";
import { Locale } from "@/i18n/types";
import { timeInSec } from "@/libs/manipulate/number";
import { routing } from "@/i18n/routing";

const getLocale = async (): Promise<Locale> => {
  try {
    return (await getLocaleServer()) as Locale;
  } catch {
    return routing.defaultLocale;
  }
};

export const getHero = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "hero", locale }), ["hero", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["hero"],
  });
  return cache();
};

export const getAboutMe = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "about-me", locale }), ["about-me", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["about-me"],
  });
  return cache();
};

export const getContactMe = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "contact-me", locale }), ["contact-me", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["contact-me"],
  });
  return cache();
};

const getProjectsSort = ["-year", "-id"];

export const getProjects = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.find({ collection: "project", locale, sort: getProjectsSort }), ["projects", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["projects"],
  });
  return cache();
};

export const getProject = async (payload: BasePayload, id: number) => {
  const locale = await getLocale();
  const cache = withCache(
    () =>
      payload.find({
        collection: "project",
        locale,
        where: {
          id: {
            equals: id,
          },
        },
      }),
    ["projects", locale, id.toString()],
    {
      revalidate: timeInSec({ day: 1 }),
      tags: [`project-${id}`],
    },
  );
  const projects = (await cache()).docs;
  return projects[0] ? projects[0] : null;
};

export const getSocials = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "contact-me", locale, select: { socials: true } }), ["contact-me", locale, "socials"], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["contact-me", "socials"],
  });
  return (await cache()).socials;
};

export const getFeaturedProjects = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.find({ collection: "featured-project", locale, sort: ["order"] }), ["featured-project", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["featured-project"],
  });
  return cache();
};
