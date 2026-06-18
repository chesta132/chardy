import { DEFAULT_AI_NAME, DEFAULT_GEMINI_MODEL } from "@/config";
import { GlobalConfig } from "payload";
import { revalidatePaths, updateTags } from "../cache";

export const AIConfig: GlobalConfig = {
  slug: "ai-config",
  label: "AI Config",
  hooks: {
    afterChange: [
      async () => {
        await updateTags("ai-config");
        await revalidatePaths(["/(chardy)/[locale]", "page"]);
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
