import { CollectionConfig } from "payload";

export const GuestbookEntry: CollectionConfig = {
  slug: "guestbook-entry",
  fields: [
    {
      name: "userId",
      type: "text",
      admin: {
        readOnly: true,
      },
      access: {
        create: () => false,
        update: () => false,
      },
      required: true,
    },
    {
      name: "message",
      type: "text",
      admin: {
        readOnly: true,
      },
      required: true,
    },
    {
      name: "pinned",
      type: "checkbox",
      defaultValue: false,
      required: true,
    },
    {
      name: "isAdmin",
      type: "checkbox",
      admin: {
        readOnly: true,
      },
      defaultValue: false,
      required: true,
    },
  ],
};
