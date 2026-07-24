import { cn } from "@/libs/utils";
import { FaX } from "react-icons/fa6";
import { FaCheck, FaChevronDown } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useTagInputController } from "@/hooks/useTagInputController";

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

  const {
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
  } = useTagInputController({ value, onChange, options });

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
