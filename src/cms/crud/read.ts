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
  });
  return cache();
};

export const getAboutMe = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "about-me", locale }), ["about-me", locale], {
    revalidate: timeInSec({ day: 1 }),
  });
  return cache();
};

export const getContactMe = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.findGlobal({ slug: "contact-me", locale }), ["contact-me", locale], {
    revalidate: timeInSec({ day: 1 }),
  });
  return cache();
};

export const getProjects = async (payload: BasePayload) => {
  const locale = await getLocale();
  const cache = withCache(() => payload.find({ collection: "project", locale }), ["projects", locale], {
    revalidate: timeInSec({ day: 1 }),
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
    ["projects", locale],
    {
      revalidate: timeInSec({ day: 1 }),
    },
  );
  const projects = (await cache()).docs;
  return projects[0] ? projects[0] : null;
};

export const getProjectWithNav = async (payload: BasePayload, id: number) => {
  const locale = await getLocale();
  const cache = withCache(
    () =>
      payload.find({
        collection: "project",
        locale,
        where: { id: { greater_than_equal: id - 1 } }, // from prev
        limit: 3, // prev, current, next
        sort: "id",
      }),
    ["project-nav", id.toString(), locale],
    { revalidate: timeInSec({ day: 1 }) },
  );

  const docs = (await cache()).docs;
  const idx = docs.findIndex((p) => p.id === id);

  return {
    project: docs[idx] ?? null,
    prevId: docs[idx - 1]?.id ?? null,
    nextId: docs[idx + 1]?.id ?? null,
  };
};
