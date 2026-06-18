import { CollectionConfig } from "payload";
import { revalidatePaths, updateTags } from "../cache";

export const revalidateFeaturedProject = async () => {
  await updateTags("featured-project");
  await revalidatePaths(["/(chardy)/[locale]", "page"]);
};

export const FeaturedProject: CollectionConfig = {
  slug: "featured-project",
  hooks: {
    afterChange: [
      async () => {
        await revalidateFeaturedProject();
      },
    ],
    afterDelete: [
      async () => {
        await revalidateFeaturedProject();
      },
    ],
  },

  fields: [
    {
      name: "project",
      type: "relationship",
      relationTo: "project",
      required: true,
      label: "Project",
    },
    {
      name: "order",
      type: "number",
      required: true,
      label: "Order",
      unique: true,
    },
    {
      name: "span",
      type: "select",
      options: [
        { label: "Full", value: "full" },
        { label: "Wide", value: "wide" },
        { label: "Normal", value: "normal" },
      ],
    },
  ],
};
