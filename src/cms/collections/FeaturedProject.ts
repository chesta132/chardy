import { revalidatePath, updateTag } from "next/cache";
import { CollectionConfig } from "payload";

export const revalidateFeaturedProject = () => {
  updateTag("featured-project");
  revalidatePath("/[locale]", "page");
};

export const FeaturedProject: CollectionConfig = {
  slug: "featured-project",
  hooks: {
    afterChange: [
      () => {
        revalidateFeaturedProject();
      },
    ],
    afterDelete: [
      () => {
        revalidateFeaturedProject();
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
