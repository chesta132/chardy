import { FunctionDeclaration } from "@google/genai";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAboutMe, getContactMe, getHero, getProjects } from "@/cms/crud/read";

export const portfolioToolDeclarations: FunctionDeclaration[] = [
  {
    name: "getAboutMe",
    description: "Get information about Chesta including stats, years of experience, and tools used",
  },
  {
    name: "getHero",
    description: "Get the hero section content including title and subtitle",
  },
  {
    name: "getContact",
    description: "Get contact information including GitHub, LinkedIn, and email",
  },
  {
    name: "getProjects",
    description: "Get list of portfolio projects",
  },
];

export const portfolioToolHandlers = {
  getAboutMe: async () => {
    const payload = await getPayload({ config });
    return getAboutMe(payload);
  },
  getHero: async () => {
    const payload = await getPayload({ config });
    return getHero(payload);
  },
  getContact: async () => {
    const payload = await getPayload({ config });
    return getContactMe(payload);
  },
  getProjects: async () => {
    const payload = await getPayload({ config });
    return getProjects(payload);
  },
};
