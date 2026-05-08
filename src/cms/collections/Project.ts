import { CollectionConfig } from "payload";

export const Project: CollectionConfig = {
  slug: "project",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Title",
    },
    {
      name: "tags",
      type: "array",
      required: true,
      fields: [{ name: "tag", type: "text", required: true, label: "Tag" }],
      label: "Tags",
    },
    {
      name: "year",
      type: "number",
      required: true,
      label: "Year",
    },
    {
      name: "thumbnail",
      type: "upload",
      required: true,
      relationTo: "media",
      label: "Thumbnail",
    },
    {
      name: "liveSite",
      type: "text",
    },
    {
      name: "description",
      type: "richText",
      required: true,
      localized: true,
      label: "Description",
    },
    {
      name: "screenshot",
      type: "upload",
      relationTo: "media",
      label: "Screenshot",
    },
  ],
};
