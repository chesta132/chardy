"use client";

import { FormLayout } from "@/components/form/FormLayout";
import { PageTitle } from "@/components/layouts/Title";
import { Main } from "@/components/layouts/Wrapper";
import { Button, SendButton } from "@/components/ui/Button";
import { useAutosizeTextarea } from "@/hooks/useAutosizeTextarea";
import { useForm } from "@/hooks/useForm";
import { authClient, useSession } from "@/libs/auth-client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { FaGithub, FaTerminal, FaUser } from "react-icons/fa";
import z from "zod";

export default function GuestbookPage() {
  const t = useTranslations("Guestbook");
  const { data, isPending } = useSession();

  return (
    <Main className="flex flex-col min-h-svh px-5 pt-32 pb-16">
      <PageTitle title={t("title")} subtitle={t("guestbook")} />

      <div className="flex flex-col flex-1 px-5 md:px-10 lg:px-20 pb-0 max-w-4xl mx-auto w-full">
        {!isPending && data ? <CommentColumn /> : <SignIn />}
      </div>
    </Main>
  );
}

const formSchema = z.object({
  message: z.string(),
});

const CommentColumn = () => {
  const { data } = useSession();
  const formGroup = useForm({ message: "" }, formSchema);
  const {
    form: [form],
  } = formGroup;
  const { textAreaRef } = useAutosizeTextarea(form.message);
  const t = useTranslations("Guestbook.form");
  const [loading, setLoading] = useState(false);

  const handlePost = (_: any, form: z.output<typeof formSchema>) => {
    try {
      setLoading(true);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return null;

  return (
    <div className="flex justify-between gap-2 border border-foreground/30 rounded-lg p-4">
      {data.user.image ? (
        <Image
          alt={`${data.user.name}'s profile image`}
          src={data.user.image}
          width={50}
          height={50}
          className="size-10.5 sm:size-11.5 md:size-12.5 rounded-full"
        />
      ) : (
        <div className="size-12.5 rounded-full border flex justify-center items-center">
          <FaUser size={20} />
        </div>
      )}
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
