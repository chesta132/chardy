import { CollectionConfig } from "payload";

export const ContactRateLimit: CollectionConfig = {
  slug: "contact-rate-limit",
  admin: {
    // if i wanna clean up all manually
    hidden: false,
  },
  fields: [
    { name: "email", type: "email", required: true },
    {
      name: "sentAt",
      type: "date",
      required: true,
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
  ],
};
