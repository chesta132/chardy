import { revalidatePath, updateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const AboutMe: GlobalConfig = {
  slug: "about-me",
  hooks: {
    afterChange: [
      () => {
        updateTag("about-me");
        revalidatePath("/[locale]");
      },
    ],
  },
  fields: [
    {
      name: "stats",
      type: "group",
      required: true,
      fields: [
        {
          name: "yearsOfExperience",
          type: "number",
          required: true,
          label: "Years of Experience",
        },
        {
          name: "projectsCompleted",
          type: "number",
          required: true,
          label: "Projects Completed",
        },
        {
          name: "technologiesUsed",
          type: "number",
          required: true,
          label: "Technologies Used",
        },
      ],
    },

    {
      name: "cardContent",
      type: "richText",
      required: true,
      localized: true,
      label: "Card Content",
    },

    {
      name: "tools",
      type: "array",
      required: true,
      fields: [{ name: "logo", type: "upload", relationTo: "media", required: true, unique: true }],
      label: "Tools Used",
    },
  ],
};
