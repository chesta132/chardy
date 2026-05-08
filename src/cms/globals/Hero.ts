import { GlobalConfig } from "payload";

export const Hero: GlobalConfig = {
  slug: "hero",
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
