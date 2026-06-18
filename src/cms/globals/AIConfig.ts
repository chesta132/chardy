import { DEFAULT_AI_NAME, DEFAULT_GEMINI_MODEL } from "@/config";
import { revalidatePath, updateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const AIConfig: GlobalConfig = {
  slug: "ai-config",
  label: "AI Config",
  hooks: {
    afterChange: [
      () => {
        updateTag("ai-config");
        revalidatePath("/[locale]");
      },
    ],
  },
  fields: [
    {
      name: "systemPrompt",
      label: "System prompt",
      type: "textarea",
      required: true,
      defaultValue: "",
    },
    {
      name: "model",
      type: "text",
      required: true,
      defaultValue: DEFAULT_GEMINI_MODEL,
    },
    {
      name: "aiName",
      type: "text",
      required: true,
      defaultValue: DEFAULT_AI_NAME,
    },
  ],
};
