import { FunctionDeclaration } from "@google/genai";
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
  getAboutMe: getAboutMe,
  getHero: getHero,
  getContact: getContactMe,
  getProjects: getProjects,
};
