export const extractUsername = (githubUrl: string) => githubUrl.split("/").pop() || "";
