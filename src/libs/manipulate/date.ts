import { timeInMs } from "./number";

export const generateDeleteTTL = () => {
  return new Date(Date.now() + timeInMs({ week: 2 }));
};
