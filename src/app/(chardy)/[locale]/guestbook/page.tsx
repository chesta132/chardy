"use client";

// TODO: refactor this components to another file

import { FormLayout } from "@/components/form/FormLayout";
import { PageTitle } from "@/components/layouts/Title";
import { Main } from "@/components/layouts/Wrapper";
import { Button, SendButton } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Guestbook, useGuestbook } from "@/contexts/Guestbook";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { useForm } from "@/hooks/useForm";
import { authClient, useSession } from "@/libs/auth-client";
import { cn } from "@/libs/utils";
import { GuestbookPayload } from "@/payloads/guestbook";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaGithub, FaTerminal, FaThumbtack, FaTrash, FaUser } from "react-icons/fa";
import z from "zod";
import { MdModeEdit } from "react-icons/md";

export default function GuestbookPage() {
  const t = useTranslations("Guestbook");
  const { data, isPending } = useSession();

  return (
    <Main className="flex flex-col min-h-svh px-5 pt-32 pb-16">
      <PageTitle title={t("title")} subtitle={t("guestbook")} />

      <div className="flex flex-col flex-1 px-5 md:px-10 lg:px-20 pb-0 max-w-4xl mx-auto w-full gap-8">
        {!isPending && data ? <CommentColumn /> : <SignIn />}
        <CommentList />
      </div>
    </Main>
  );
}

const Pfp = ({ classname, user }: { classname?: string; user: { image?: string | null; name: string } }) => {
  return user.image ? (
    <Image alt={`${user.name}'s profile image`} src={user.image} width={50} height={50} className={cn("rounded-full", classname)} />
  ) : (
    <div className={cn("size-12.5 rounded-full border flex justify-center items-center", classname)}>
      <FaUser size={20} />
    </div>
  );
};

const CommentColumn = () => {
  const { data } = useSession();
  const formGroup = useForm({ message: "" }, GuestbookPayload.postEntry);
  const {
    form: [form],
  } = formGroup;
  const { textAreaRef } = useAutosizeTextarea(form.message);
  const { postEntry } = useGuestbook();
  const t = useTranslations("Guestbook.form");
  const [loading, setLoading] = useState(false);

  const handlePost = async (_: any, form: z.output<typeof GuestbookPayload.postEntry>) => {
    try {
      setLoading(true);
      await postEntry({ message: form.message });
      // error handled in form layout
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="flex justify-between gap-2 border border-foreground/30 rounded-lg p-4">
      <Pfp user={data.user} classname="size-10.5 sm:size-11.5 md:size-12.5" />
      <div className="w-full flex flex-col gap-2">
        <span className="font-semibold">{data.user.name}</span>
        <FormLayout
          resetAfterSubmit
          form={formGroup}
          onFormSubmit={handlePost}
          className="flex flex-row items-end gap-2 rounded-2xl rounded-tl-none p-2 bg-primary"
        >
          <div className="flex-1 min-w-0">
            <FormLayout.textarea
              ref={textAreaRef}
              field="message"
              className="w-full min-h-25 outline-none p-2"
              placeholder="Leave a comment!"
              ignoreError
            />
          </div>
          <SendButton loading={loading} disabled={loading || !form.message.trim()} aria-label={loading ? t("loading") : t("send")} />
        </FormLayout>
      </div>
    </div>
  );
};

const SignIn = () => {
  const t = useTranslations("Guestbook.signIn");
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/guestbook",
      errorCallbackURL: "/guestbook",
    });
  };

  return (
    <div className="border border-dashed rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-center sm:text-left">
        <div className="p-3 border rounded-full shrink-0">
          <FaTerminal />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">{t("title")}</p>
          <p className="text-xs text-text-dark/70">{t("subtitle")}</p>
        </div>
      </div>
      <Button className="bg-foreground text-text-light fill-text-light" onClick={handleSignIn}>
        <div className="flex gap-2 items-center">
          <FaGithub />
          GitHub
        </div>
      </Button>
    </div>
  );
};

const CommentList = () => {
  const t = useTranslations("Guestbook.list");
  const { guestbook, moreEntries, nextPage } = useGuestbook();
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      await moreEntries();
    } finally {
      setLoadingMore(false);
    }
  };

  if (guestbook.length === 0) {
    return <p className="text-center text-sm text-text-dark/60 py-10">{t("empty")}</p>;
  }

  // pinned entries surface first, most recent pinned on top
  // this actually already sorted from backend but i do this twice just to make sure
  const sorted = [...guestbook].sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-10">
        {sorted.map((entry) => (
          <CommentEntry key={entry.id} entry={entry} />
        ))}
      </div>

      {nextPage !== null && (
        <Button
          withoutArrow
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="self-center bg-transparent border border-foreground/30 text-text-dark hover:bg-foreground hover:text-text-light disabled:hover:bg-transparent disabled:hover:text-text-dark"
        >
          {loadingMore ? <Loading className="h-4" /> : t("loadMore")}
        </Button>
      )}
    </div>
  );
};

const CommentEntry = ({ entry }: { entry: Guestbook[number] }) => {
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
    if (editMode) {
      try {
        setLoading(true);
        if (!isDefault()) await updateEntry(form);
        setEditMode(false);
      } finally {
        setLoading(false);
      }
    } else {
      setEditMode(true);
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
      <Pfp user={{ ...entry.author }} classname="size-10.5 sm:size-11.5" />

      <div className="flex flex-col gap-1.5 min-w-0 w-full">
        <div className="flex justify-between items-center w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-sm truncate">{entry.author.name}</span>

            {entry.isAdmin && (
              <span className="text-[11px] uppercase tracking-wide text-text-light bg-foreground rounded-md px-2 py-0.5 shrink-0">
                {t("author")}
              </span>
            )}

            {entry.pinned && (
              <span className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-secondary shrink-0">
                <FaThumbtack size={9} />
              </span>
            )}

            <span className="text-[11px] text-text-dark/50 ml-auto shrink-0">
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
                {editMode ? <FaCheck /> : <MdModeEdit />}
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
              placeholder={t("aria.cancel")}
            />
          </FormLayout>
        ) : (
          <p className="text-sm text-text-dark/80 whitespace-pre-wrap wrap-break-word">{entry.message}</p>
        )}
      </div>
    </div>
  );
};
