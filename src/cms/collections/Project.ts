import { revalidateTag } from "next/cache";
import { CollectionConfig } from "payload";

export const Project: CollectionConfig = {
  slug: "project",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [
      async ({ doc }) => {
        revalidateTag("projects", "max");
        if (doc.id) {
          revalidateTag(`project-${doc.id}`, "max");
        }
      },
    ],
    afterDelete: [
      async ({ id }) => {
        revalidateTag("projects", "max");
        revalidateTag(`project-${id}`, "max");
      },
    ],
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
      name: "sites",
      type: "array",
      label: "Sites",
      fields: [
        {
          name: "site",
          type: "group",
          required: true,
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              label: "Label",
              localized: true,
              defaultValue: ({ locale }) => (locale === "en" ? "Visit site" : "Kunjungi situs"),
            },
            { name: "url", type: "text", required: true, label: "URL" },
          ],
        },
      ],
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
