import { revalidateTag } from "next/cache";
import { BasePayload, CollectionConfig } from "payload";
import { getFeaturedProjects } from "../crud/read";

const revalidateFeatured = async (id: string | number, payload: BasePayload) => {
  const featured = await getFeaturedProjects(payload);
  if (featured.docs.some((item) => (typeof item.project === "number" ? item.project === id : item.project.id === id))) {
    revalidateTag("featured-project", "max");
  }
};

export const Project: CollectionConfig = {
  slug: "project",
  admin: {
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req: { payload } }) => {
        revalidateTag("projects", "max");
        if (doc.id) {
          revalidateTag(`project-${doc.id}`, "max");
          if (operation === "update") await revalidateFeatured(doc.id, payload);
        }
      },
    ],
    afterDelete: [
      async ({ id }) => {
        revalidateTag("projects", "max");
        revalidateTag(`project-${id}`, "max");
        // skip revalidate featured because project can not be deleted if registered in featured project
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
