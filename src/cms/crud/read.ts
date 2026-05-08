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
