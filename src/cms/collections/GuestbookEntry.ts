import { CollectionConfig } from "payload";
import { updateTags } from "../cache";

export const GuestbookEntry: CollectionConfig = {
  slug: "guestbook-entry",
  hooks: {
    afterChange: [
      async () => {
        await updateTags("guestbook-entries");
      },
    ],
    afterDelete: [
      async () => {
        await updateTags("guestbook-entries");
      },
    ],
  },
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
