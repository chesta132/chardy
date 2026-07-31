import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { Guestbook, useGuestbook } from "@/contexts/Guestbook";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { CommentEntry } from "./CommentEntry";

const useSkeletonEntries = (): Guestbook => {
  const id = useId();
  const date = "2026-07-31T06:39:02.123Z";
  return [
    {
      id: 1,
      author: {
        id: `${id}_1`,
        name: "Chesta",
      },
      userId: `${id}_1`,
      createdAt: date,
      updatedAt: date,
      isAdmin: true,
      message: "Make sure to drop a nice review guys",
      pinned: true,
    },
    {
      id: 2,
      author: {
        id: `${id}_2`,
        name: "Ardiona",
      },
      userId: `${id}_1`,
      createdAt: date,
      updatedAt: date,
      isAdmin: false,
      message: "Wowwwww",
      pinned: false,
    },
    {
      id: 3,
      author: {
        id: `${id}_3`,
        name: "whoami",
      },
      userId: `${id}_3`,
      createdAt: date,
      updatedAt: date,
      isAdmin: false,
      message: "I mean, that's pretty good.",
      pinned: false,
    },
  ];
};

export const CommentList = () => {
  const t = useTranslations("Guestbook.list");
  const { guestbook, moreEntries, nextPage, isFetching } = useGuestbook();
  const [loadingMore, setLoadingMore] = useState(false);
  const skeletonEntries = useSkeletonEntries();

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      await moreEntries();
    } finally {
      setLoadingMore(false);
    }
  };

  if (!isFetching && guestbook.length === 0) {
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
        {isFetching && skeletonEntries.map((entry) => <CommentEntry key={entry.id} entry={entry} isSkeleton />)}
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
