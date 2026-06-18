import { revalidatePath, updateTag } from "next/cache";
import { GlobalConfig, TextFieldSingleValidation } from "payload";

export const ContactMe: GlobalConfig = {
  slug: "contact-me",
  hooks: {
    afterChange: [
      () => {
        updateTag("contact-me");
        revalidatePath("/[locale]");
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
