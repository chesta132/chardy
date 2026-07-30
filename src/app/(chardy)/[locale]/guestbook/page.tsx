"use client";

import { CommentColumn } from "@/components/guestbook/CommentColumn";
import { CommentList } from "@/components/guestbook/CommentList";
import { SignIn } from "@/components/guestbook/SignIn";
import { PageTitle } from "@/components/layouts/Title";
import { Main } from "@/components/layouts/Wrapper";
import { useSession } from "@/libs/auth-client";
import { useTranslations } from "next-intl";

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
