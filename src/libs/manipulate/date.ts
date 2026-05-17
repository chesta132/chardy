import { timeInMs } from "./number";

export const generateDeleteTTL = () => {
  return new Date(Date.now() + timeInMs({ week: 2 }));
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
