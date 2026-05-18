import { DEFAULT_AI_NAME, DEFAULT_GEMINI_MODEL } from "@/config";
import { revalidateTag } from "next/cache";
import { GlobalConfig } from "payload";

export const AIConfig: GlobalConfig = {
  slug: "ai-config",
  label: "AI Config",
  hooks: {
    afterChange: [
      () => {
        revalidateTag("ai-config", "max");
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
