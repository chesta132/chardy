"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { useOutsideClick } from "./useOutsideClick";
import { useListboxAnimation } from "./useListboxAnimation";

interface UseTagInputControllerOptions {
  value: string[];
  onChange: (tags: string[]) => void;
  options: string[];
}

export function useTagInputController({ value, onChange, options }: UseTagInputControllerOptions) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const labelId = `${uid}-label`;
  const errorId = `${uid}-error`;

  const filtered = options.filter((opt) => !value.includes(opt) && opt.toLowerCase().includes(search.toLowerCase()));

  const { animateClose } = useListboxAnimation({ listRef, open });

  const getOptionElements = () => (listRef.current ? listRef.current.querySelectorAll<HTMLElement>("[role='option']") : []);

  const announce = (msg: string) => {
    if (!announceRef.current) return;
    announceRef.current.textContent = "";
    setTimeout(() => {
      if (announceRef.current) announceRef.current.textContent = msg;
    }, 10);
  };

  const openDropdown = () => {
    if (!open) setOpen(true);
  };

  const closeDropdown = () => {
    if (open) animateClose(() => setOpen(false));
  };

  useOutsideClick(containerRef, () => {
    closeDropdown();
    setSearch("");
  });

  const addTag = (tag: string) => {
    if (!value.includes(tag)) {
      onChange([...value, tag]);
      announce(`${tag} added`);
    }
    setSearch("");
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
    announce(`${tag} removed`);
    inputRef.current?.focus();
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Escape":
        closeDropdown();
        return;
      case "ArrowDown":
        e.preventDefault();
        if (!open) {
          setOpen(true);
          setTimeout(() => getOptionElements()[0]?.focus(), 50);
        } else {
          getOptionElements()[0]?.focus();
        }
        return;
      case "Enter":
        e.preventDefault();
        if (filtered.length === 1) addTag(filtered[0]);
        return;
      case "Backspace":
        if (search === "" && value.length > 0) {
          removeTag(value[value.length - 1]);
        }
        return;
    }
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, opt: string, index: number) => {
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        addTag(opt);
        return;
      case "Escape":
        closeDropdown();
        inputRef.current?.focus();
        return;
      case "ArrowDown":
        e.preventDefault();
        getOptionElements()[index + 1]?.focus();
        return;
      case "ArrowUp":
        e.preventDefault();
        if (index === 0) inputRef.current?.focus();
        else getOptionElements()[index - 1]?.focus();
        return;
      case "Tab": {
        const opts = getOptionElements();
        if (!e.shiftKey) {
          if (index < opts.length - 1) {
            e.preventDefault();
            opts[index + 1]?.focus();
          } else {
            closeDropdown();
          }
        } else {
          e.preventDefault();
          if (index === 0) inputRef.current?.focus();
          else opts[index - 1]?.focus();
        }
      }
    }
  };

  return {
    open,
    search,
    setSearch,
    filtered,
    ids: { listboxId, labelId, errorId },
    refs: { containerRef, inputRef, listRef, announceRef },
    openDropdown,
    addTag,
    removeTag,
    handleInputKeyDown,
    handleOptionKeyDown,
  };
}
