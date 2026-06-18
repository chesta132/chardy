import { GlobalConfig, TextFieldSingleValidation } from "payload";
import { revalidatePaths, updateTags } from "../cache";

export const ContactMe: GlobalConfig = {
  slug: "contact-me",
  hooks: {
    afterChange: [
      async () => {
        await updateTags("contact-me");
        await revalidatePaths(["/(chardy)/[locale]", "page"]);
      },
    ],
  },
  fields: [
    {
      name: "socials",
      type: "group",
      required: true,
      fields: [
        {
          name: "github",
          type: "text",
          required: true,
          label: "GitHub",
          validate: ((val) => val?.startsWith("https://github.com/")) as TextFieldSingleValidation,
        },
        {
          name: "linkedin",
          type: "text",
          required: true,
          label: "LinkedIn",
          validate: ((val) => val?.startsWith("https://linkedin.com/")) as TextFieldSingleValidation,
        },
        { name: "email", type: "email", required: true, label: "Email" },
      ],
    },
  ],
};
