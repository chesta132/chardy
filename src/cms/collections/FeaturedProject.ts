import { CollectionConfig } from "payload";

export const FeaturedProject: CollectionConfig = {
  slug: "featured-project",

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
