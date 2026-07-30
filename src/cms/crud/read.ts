import { BasePayload, getPayload, Where } from "payload";
import { withCache } from "../cache";
import { Locale } from "@/i18n/types";
import { timeInSec } from "@/libs/manipulate/number";
import config from "@/payload.config";
import { User } from "@/types/payload";

export type ReadPayloadOptions = {
  /** @default "en" */
  locale?: Locale;
  /**
   * if empty: call getPayload in func, that instance already cached by payload so it's safe to call it many times
   * @default await getPayload({ config })
   */
  payload?: BasePayload;
};

export const getHero = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.findGlobal({ slug: "hero", locale }), ["hero", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["hero"],
  });
  return cache();
};

export const getAboutMe = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.findGlobal({ slug: "about-me", locale }), ["about-me", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["about-me"],
  });
  return cache();
};

export const getContactMe = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.findGlobal({ slug: "contact-me", locale }), ["contact-me", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["contact-me"],
  });
  return cache();
};

const getProjectsSort = ["-year", "-id"];

export const getProjects = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.find({ collection: "project", locale, sort: getProjectsSort }), ["projects", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["projects"],
  });
  return cache();
};

export const getProject = async ({ locale = "en", payload }: ReadPayloadOptions = {}, id: number) => {
  payload ||= await getPayload({ config });
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

export const getSocials = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(
    () => payload.findGlobal({ slug: "contact-me", locale, select: { socials: true } }),
    ["contact-me", locale, "socials"],
    {
      revalidate: timeInSec({ day: 1 }),
      tags: ["contact-me", "socials"],
    },
  );
  return (await cache()).socials;
};

export const getFeaturedProjects = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.find({ collection: "featured-project", locale, sort: ["order"] }), ["featured-project", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["featured-project"],
  });
  return cache();
};

export const getAIConfig = async ({ locale = "en", payload }: ReadPayloadOptions = {}) => {
  payload ||= await getPayload({ config });
  const cache = withCache(() => payload.findGlobal({ slug: "ai-config", locale }), ["ai-config", locale], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["ai-config"],
  });
  return cache();
};

export const getUser = async ({
  payload,
  email,
  id,
}: Omit<ReadPayloadOptions, "locale"> & RequireAtLeastOne<{ email: string; id: number }>) => {
  payload ||= await getPayload({ config });
  const where: Where = email ? { email: { equals: email } } : { id: { equals: id } };
  const cache = withCache(() => payload.find({ collection: "users", where, limit: 1 }), ["users", `user-${email}-${id}`], {
    revalidate: timeInSec({ day: 1 }),
    tags: ["users", email ? `user-${email}` : `user-${id}`],
  });
  return ((await cache()).docs[0] || null) as User | null;
};
