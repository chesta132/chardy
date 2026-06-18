import { GlobalConfig } from "payload";
import { revalidatePaths, updateTags } from "../cache";

export const Hero: GlobalConfig = {
  slug: "hero",
  hooks: {
    afterChange: [
      async () => {
        await updateTags("hero");
        await revalidatePaths(["/(chardy)/[locale]", "page"]);
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
