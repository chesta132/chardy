import { revalidateTag } from "next/cache";
import { CollectionConfig, getPayload } from "payload";
import { getProjectWithNav, ProjectWithNav } from "../crud/read";
import config from "@payload-config";

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
          const payload = await getPayload({ config });
          // safe if it's cached, except it's delete action
          const { nextId, prevId } = await getProjectWithNav(payload, doc.id);
          if (nextId) revalidateTag(`project-${nextId}`, "max");
          if (prevId) revalidateTag(`project-${prevId}`, "max");
        }
      },
    ],
    afterDelete: [
      async ({ doc, context }) => {
        revalidateTag("projects", "max");
        if (doc.id) {
          revalidateTag(`project-${doc.id}`, "max");
        }
        if (context.nav) {
          const { nextId, prevId } = context.nav as ProjectWithNav;
          if (nextId) revalidateTag(`project-${nextId}`, "max");
          if (prevId) revalidateTag(`project-${prevId}`, "max");
        }
      },
    ],
    beforeDelete: [
      async ({ context, id }) => {
        if (!context) context = {};
        if (typeof id === "number") {
          const payload = await getPayload({ config });
          context.nav = await getProjectWithNav(payload, id);
        }
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
