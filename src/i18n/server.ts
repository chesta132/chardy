import { createTranslator, Messages, NamespaceKeys, NestedKeyOf } from "next-intl";
import { Locale } from "./types";

export async function getServerTranslations<NestedKey extends NamespaceKeys<Messages, NestedKeyOf<Messages>>>(locale: Locale, namespace?: NestedKey) {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return createTranslator({ locale, messages });
}
