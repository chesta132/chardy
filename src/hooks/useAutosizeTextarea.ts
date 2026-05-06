import { useEffect, useRef } from "react";

export const useAutosizeTextarea = (value: string) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const { current } = textAreaRef;
    if (current) {
      current.style.height = "auto";
      current.style.height = `${current.scrollHeight + 10}px`;
    }
  }, [value]);

  return { textAreaRef };
};
