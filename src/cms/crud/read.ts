import { BasePayload } from "payload";
import { withCache } from "../cache";
import { getLocale as getLocaleServer } from "next-intl/server";
import { Locale } from "@/i18n/types";
import { timeInSec } from "@/libs/manipulate/number";
import { routing } from "@/i18n/routing";
import { reverseSort } from "../utils";

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

// to update this u need to update getProjectWithNav
const getProjectsSort = ["-year", "-id"];

export const getProjects = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.find({ collection: "project", locale, sort: getProjectsSort }), ["projects", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["projects"],
  });
  return cache();
};

const baseGetProjectWithNav = async (payload: BasePayload, id: number, locale: Locale) => {
  const current = await payload.findByID({
    collection: "project",
    id,
    locale,
  });

  const [prevResult, nextResult] = await Promise.all([
    // prev
    payload.find({
      collection: "project",
      locale,
      where: {
        or: [{ year: { less_than: current.year } }, { and: [{ year: { equals: current.year } }, { id: { less_than: id } }] }],
      },
      sort: getProjectsSort,
      limit: 1,
    }),
    // next
    payload.find({
      collection: "project",
      locale,
      where: {
        or: [{ year: { greater_than: current.year } }, { and: [{ year: { equals: current.year } }, { id: { greater_than: id } }] }],
      },
      sort: reverseSort(getProjectsSort),
      limit: 1,
    }),
  ]);

  return {
    project: current,
    prevId: (prevResult.docs[0]?.id ?? null) as number | null,
    nextId: (nextResult.docs[0]?.id ?? null) as number | null,
  };
};

export type ProjectWithNav = Awaited<ReturnType<typeof baseGetProjectWithNav>>;

export const getProjectWithNav = async (payload: BasePayload, id: number) => {
  const locale = await getLocale();
  const cache = withCache(() => baseGetProjectWithNav(payload, id, locale), ["projects", locale, `project-${id}-nav`], {
    revalidate: timeInSec({ day: 1 }),
    tags: [`project-${id}`],
  });
  return await cache();
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
