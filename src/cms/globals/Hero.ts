import { revalidateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const Hero: GlobalConfig = {
  slug: "hero",
  hooks: {
    afterChange: [
      () => {
        revalidateTag("hero", "max");
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "subtitle",
      type: "textarea",
      required: true,
      localized: true,
    },
  ],
};
