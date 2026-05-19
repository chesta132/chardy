import { useState, useRef, useEffect, useId, type KeyboardEvent } from "react";
import { cn } from "@/libs/utils";
import { FaX } from "react-icons/fa6";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { gsap } from "@/libs/gsap/register";
import { useTranslations } from "next-intl";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
}

export function TagInput({ value, onChange, options, placeholder = "Select...", className, error, label }: TagInputProps) {
  const t = useTranslations("Form.components.TagInput");

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const uid = useId();
  const listboxId = `${uid}-listbox`;
  const labelId = `${uid}-label`;
  const errorId = `${uid}-error`;

  const filtered = options.filter((opt) => !value.includes(opt) && opt.toLowerCase().includes(search.toLowerCase()));

  const getOptions = () => (listRef.current ? Array.from(listRef.current.querySelectorAll<HTMLElement>("[role='option']")) : []);

  const announce = (msg: string) => {
    if (!announceRef.current) return;
    announceRef.current.textContent = "";
    setTimeout(() => {
      if (announceRef.current) announceRef.current.textContent = msg;
    }, 10);
  };

  // GSAP open animation
  const animateOpen = () => {
    const list = listRef.current;
    if (!list) return;

    list.hidden = false;
    isAnimatingRef.current = true;

    const items = list.querySelectorAll("[role='option']");

    gsap.fromTo(
      list,
      { opacity: 0, scaleY: 0.85, transformOrigin: "top center" },
      {
        opacity: 1,
        scaleY: 1,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      },
    );

    gsap.fromTo(
      items,
      { opacity: 0, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: "power2.out",
        stagger: 0.03,
        delay: 0.04,
      },
    );
  };

  // GSAP close animation
  const animateClose = (onComplete: () => void) => {
    const list = listRef.current;
    if (!list) {
      onComplete();
      return;
    }

    isAnimatingRef.current = true;

    gsap.to(list, {
      opacity: 0,
      scaleY: 0.85,
      transformOrigin: "top center",
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        list.hidden = true;
        isAnimatingRef.current = false;
        onComplete();
      },
    });
  };

  // Sync open state → GSAP
  useEffect(() => {
    if (open) {
      animateOpen();
    } else {
      animateClose(() => {});
    }
  }, [open, filtered.length]); // re-run on filtered so stagger refreshes on search

  const openDropdown = () => {
    if (!open) setOpen(true);
  };

  const closeDropdown = () => {
    if (open) {
      animateClose(() => setOpen(false));
    }
  };

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
    if (e.key === "Escape") {
      closeDropdown();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setTimeout(() => getOptions()[0]?.focus(), 50);
      } else {
        getOptions()[0]?.focus();
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length === 1) addTag(filtered[0]);
      return;
    }
    if (e.key === "Backspace" && search === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleOptionKeyDown = (e: KeyboardEvent<HTMLLIElement>, opt: string, index: number) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      addTag(opt);
      return;
    }
    if (e.key === "Escape") {
      closeDropdown();
      inputRef.current?.focus();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      getOptions()[index + 1]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) inputRef.current?.focus();
      else getOptions()[index - 1]?.focus();
      return;
    }
    if (e.key === "Tab") {
      const opts = getOptions();
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
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closeDropdown();
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("w-full relative", className)}>
      <div ref={announceRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

      {label && (
        <label id={labelId} className="block mb-1 text-sm font-medium text-foreground/70">
          {label}
        </label>
      )}

      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-owns={listboxId}
        aria-labelledby={label ? labelId : undefined}
        aria-errormessage={error ? errorId : undefined}
        aria-invalid={!!error}
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-foreground/15 bg-primary px-2 py-1.5 cursor-text",
          error && "border-red-500/60 focus-within:border-red-500/60",
          open && "rounded-b-none",
        )}
        onClick={() => {
          openDropdown();
          inputRef.current?.focus();
        }}
      >
        {value.map((tag) => (
          <span
            key={tag}
            role="group"
            aria-label={`${tag}, press delete to remove`}
            className="inline-flex items-center gap-1 rounded bg-background border border-foreground/15 px-2 py-0.5 text-xs text-foreground/80"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50 rounded transition-colors ml-0.5"
            >
              <FaX className="h-2 w-2" aria-hidden="true" />
            </button>
          </span>
        ))}

        <div className="flex items-center flex-1 min-w-20 gap-1">
          <input
            ref={inputRef}
            role="searchbox"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-label={label ? undefined : placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              openDropdown();
            }}
            onFocus={openDropdown}
            onKeyDown={handleInputKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/35 outline-none min-w-15"
          />
          <FaChevronDown
            aria-hidden="true"
            className={cn("h-3.5 w-3.5 text-foreground/40 shrink-0 transition-transform duration-200", open && "rotate-180")}
          />
        </div>
      </div>

      {/* Listbox — hidden attr controlled by GSAP, not React conditional */}
      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        aria-label={label ? `${label} options` : "Options"}
        aria-multiselectable="true"
        hidden={true} // GSAP will toggle this
        className={cn("absolute z-50 w-full rounded-b-md border border-foreground/15 bg-primary shadow-sm overflow-hidden")}
        style={{ transformOrigin: "top center" }}
      >
        {filtered.length > 0 ? (
          <div className="max-h-48 overflow-y-auto py-1" data-lenis-prevent>
            {filtered.map((opt, i) => (
              <li
                key={opt}
                id={`${listboxId}-opt-${i}`}
                role="option"
                aria-selected={value.includes(opt)}
                tabIndex={0}
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(opt);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, opt, i)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-background cursor-pointer transition-colors",
                  "focus:outline-none focus:bg-background",
                )}
              >
                <FaCheck
                  aria-hidden="true"
                  className={cn("h-3.5 w-3.5 shrink-0 text-secondary", value.includes(opt) ? "opacity-100" : "opacity-0")}
                />
                {opt}
              </li>
            ))}
          </div>
        ) : (
          <li role="option" aria-selected={false} className="px-3 py-2 text-sm text-foreground/40">
            {t("noOptions")}
          </li>
        )}
      </ul>

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
