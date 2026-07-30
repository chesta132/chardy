import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { useGuestbook } from "@/contexts/Guestbook";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CommentEntry } from "./CommentEntry";

export const CommentList = () => {
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
