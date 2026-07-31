"use client";

import {
  deleteGuestbookEntryAction,
  getGuestbookEntriesAction,
  postGuestbookEntryAction,
  updateGuestbookEntryAction,
} from "@/actions/guestbook";
import { AuthPublicUserSafe } from "@/types/auth";
import { GuestbookEntry } from "@/types/payload";
import { nectAction } from "nectic/actions";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { usePublicUserCache } from "./PublicUserCache";

export type Guestbook = (GuestbookEntry & { author: AuthPublicUserSafe })[];
export type SetGuestbook = React.Dispatch<React.SetStateAction<Guestbook>>;

const postGuestbookEntry = nectAction(postGuestbookEntryAction, { fromCSR: true, unsafe: true });
const getGuestbookEntries = nectAction(getGuestbookEntriesAction, { fromCSR: true, unsafe: true });
const updateGuestbookEntry = nectAction(updateGuestbookEntryAction, { fromCSR: true, unsafe: true });
const deleteGuestbookEntry = nectAction(deleteGuestbookEntryAction, { fromCSR: true, unsafe: true });
const GUESTBOOK_ENTRIES_PER_PAGE = 10;

type GuestbookValue = {
  guestbook: Guestbook;
  nextPage: number | null;
  isFetching: boolean;
  setGuestbook: SetGuestbook;
  moreEntries: () => Promise<void>;
  postEntry: typeof postGuestbookEntry;
  updateEntry: typeof updateGuestbookEntry;
  deleteEntry: typeof deleteGuestbookEntry;
};

const GuestbookContext = createContext<GuestbookValue | null>(null);

export const GuestbookProvider = ({ children }: { children: ReactNode }) => {
  const { attachAuthors } = usePublicUserCache();
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [guestbook, setGuestbook] = useState<Guestbook>([]);
  const [isFetching, setIsFetching] = useState(true);
  const pathname = usePathname();

  const withFetching = <F extends (...args: any[]) => Promise<any>>(f: F): F =>
    (async (...args) => {
      try {
        setIsFetching(true);
        return await f(...args);
      } finally {
        setIsFetching(false);
      }
    }) as F;

  const postEntry: typeof postGuestbookEntry = withFetching(async (...args) => {
    const entry = await postGuestbookEntry(...args);
    const withAuthor = await attachAuthors([entry.data]);
    setGuestbook((prev) => [...withAuthor, ...prev].sort((a, b) => Number(b.pinned) - Number(a.pinned)));
    return entry;
  });

  const moreEntries = withFetching(async () => {
    if (nextPage === null) return;
    const newEntries = await getGuestbookEntries({ limit: GUESTBOOK_ENTRIES_PER_PAGE, page: nextPage });
    const withAuthor = await attachAuthors(newEntries.data.docs);
    setNextPage(newEntries.data.nextPage || null);
    setGuestbook((prev) => [...prev, ...withAuthor]);
  });

  const updateEntry: typeof updateGuestbookEntry = async (...args) => {
    const updated = await updateGuestbookEntry(...args);
    if (updated.data) {
      const withAuthor = (await attachAuthors([updated.data]))[0];
      setGuestbook((prev) => prev.map((entry) => (entry.id === withAuthor.id ? withAuthor : entry)));
    }
    return updated;
  };

  const deleteEntry: typeof deleteGuestbookEntry = async (...args) => {
    const deleted = await deleteGuestbookEntry(...args);
    if (deleted.data) {
      setGuestbook((prev) => prev.filter((entry) => entry.id !== deleted.data!.id));
    }
    return deleted;
  };

  const fetchedRef = useRef(false);
  useEffect(() => {
    const f = withFetching(async () => {
      if (pathname?.endsWith("/guestbook") && !fetchedRef.current) {
        const entries = await getGuestbookEntries({ limit: GUESTBOOK_ENTRIES_PER_PAGE });
        setGuestbook(await attachAuthors(entries.data.docs));
        setNextPage(entries.data.nextPage || null);
        fetchedRef.current = true;
      }
    });
    f();
  }, [pathname]);

  return (
    <GuestbookContext.Provider value={{ guestbook, setGuestbook, postEntry, moreEntries, updateEntry, deleteEntry, nextPage, isFetching }}>
      {children}
    </GuestbookContext.Provider>
  );
};

export const useGuestbook = () => {
  const ctx = useContext(GuestbookContext);
  if (!ctx) throw new Error("useGuestbook must be used within GuestbookProvider");
  return ctx;
};
