import { FormLayout } from "@/components/form/FormLayout";
import { Guestbook, useGuestbook } from "@/contexts/Guestbook";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { useForm } from "@/hooks/useForm";
import { useSession } from "@/libs/auth-client";
import { GuestbookPayload } from "@/payloads/guestbook";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaThumbtack, FaTrash } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { Pfp } from "./Pfp";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { FaX } from "react-icons/fa6";

export const CommentEntry = ({ entry }: { entry: Guestbook[number] }) => {
  const t = useTranslations("Guestbook.list");
  const format = useFormatter();
  const { data } = useSession();
  const [editMode, setEditMode] = useState(false);
  const formGroup = useForm({ message: entry.message, id: entry.id }, GuestbookPayload.editEntry);
  const {
    form: [form],
    resetForm,
    isDefault,
  } = formGroup;
  const { textAreaRef } = useAutosizeTextarea(form.message);
  const { updateEntry, deleteEntry } = useGuestbook();
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editContainerRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();

  // handle touch/click outside
  useEffect(() => {
    if (!editMode) return;

    const handlePointerDown = (e: TouchEvent) => {
      if (editContainerRef.current && !editContainerRef.current.contains(e.target as Node)) {
        cancelEdit();
      }
    };

    document.addEventListener("touchstart", handlePointerDown);
    return () => document.removeEventListener("touchstart", handlePointerDown);
  }, [editMode]);

  useEffect(() => {
    if (editMode) {
      textAreaRef.current?.focus();
    }
  }, [editMode]);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);

  const toggleEditMode = async () => {
    if (editMode && form.message) {
      try {
        setLoading(true);
        if (!isDefault()) await updateEntry(form);
        setEditMode(false);
      } finally {
        setLoading(false);
      }
    } else {
      setEditMode((prev) => !prev);
    }
  };

  const cancelEdit = () => {
    resetForm();
    setEditMode(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const handleDeleteClick = () => {
    if (confirmDelete) {
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
      setConfirmDelete(false);
      deleteEntry({ id: entry.id });
      return;
    }

    setConfirmDelete(true);
    deleteTimeoutRef.current = setTimeout(() => {
      setConfirmDelete(false);
    }, 1000);
  };

  return (
    <div className="flex gap-3 group">
      <Pfp user={{ ...entry.author }} classname="size-9.5 sm:size-11.5" />

      <div className="flex flex-col gap-1.5 min-w-0 w-full" ref={editContainerRef}>
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[clamp(0.3rem,3vw,0.9rem)] font-semibold text-sm truncate">{entry.author.name}</span>

              {entry.isAdmin && (
                <span className="text-[clamp(0.5rem,2vw,0.6rem)] uppercase tracking-wide text-text-light bg-foreground rounded-md px-2 py-0.5 shrink-0">
                  {t("author")}
                </span>
              )}

              {entry.pinned && (
                <span className="flex items-center gap-1 uppercase tracking-wide text-secondary shrink-0">
                  <FaThumbtack size={9} />
                </span>
              )}
            </div>

            <span className="text-[clamp(0.6rem,2vw,0.7rem)] text-text-dark/50 shrink-0">
              {format.relativeTime(new Date(entry.createdAt), new Date())}
            </span>
          </div>

          {data && data.user.id === entry.userId && (
            <div className="ml-auto flex gap-3 xl:opacity-0 xl:group-hover:opacity-100 transition">
              <button
                className="transition-colors hover:bg-primary/80 cursor-pointer p-2 rounded-sm disabled:opacity-50"
                aria-label={editMode ? t("aria.save") : t("aria.edit")}
                onClick={toggleEditMode}
                disabled={loading}
              >
                {editMode ? form.message ? <FaCheck /> : <FaX size={14} /> : <MdModeEdit />}
              </button>
              <button
                onClick={handleDeleteClick}
                className="transition-colors hover:bg-red-300 cursor-pointer p-2 rounded-sm"
                aria-label={confirmDelete ? t("aria.confirmDelete") : t("aria.delete")}
              >
                {confirmDelete ? <FaCheck /> : <FaTrash />}
              </button>
            </div>
          )}
        </div>

        {editMode ? (
          <FormLayout form={formGroup}>
            <FormLayout.textarea
              className="text-sm text-text-dark/80 whitespace-pre-wrap wrap-break-word outline-none"
              ref={textAreaRef}
              field="message"
              onKeyDown={handleKeyDown}
              placeholder={isDesktop ? t("aria.cancel") : t("aria.mobileCancel")}
            />
          </FormLayout>
        ) : (
          <p className="text-sm text-text-dark/80 whitespace-pre-wrap wrap-break-word">{entry.message}</p>
        )}
      </div>
    </div>
  );
};
