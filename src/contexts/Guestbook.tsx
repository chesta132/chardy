"use client";

import {
  deleteGuestbookEntryAction,
  getGuestbookEntriesAction,
  postGuestbookEntryAction,
  updateGuestbookEntryAction,
} from "@/actions/guestbook";
import { getPublicUsers } from "@/libs/auth-client";
import { AuthPublicUserSafe } from "@/types/auth";
import { GuestbookEntry } from "@/types/payload";
import { nectAction } from "nectic/actions";
import { usePathname } from "next/navigation";
import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

export type Guestbook = (GuestbookEntry & { author: AuthPublicUserSafe })[];
export type SetGuestbook = React.Dispatch<React.SetStateAction<Guestbook>>;

const postGuestbookEntry = nectAction(postGuestbookEntryAction, { fromCSR: true, unsafe: true });
const getGuestbookEntries = nectAction(getGuestbookEntriesAction, { fromCSR: true, unsafe: true });
const updateGuestbookEntry = nectAction(updateGuestbookEntryAction, { fromCSR: true, unsafe: true });
const deleteGuestbookEntry = nectAction(deleteGuestbookEntryAction, { fromCSR: true, unsafe: true });
const GUESTBOOK_ENTRIES_PER_PAGE = 10;

type GuestbookValue = {
  guestbook: Guestbook;
  /** `nextPage` will be null if all guestbook loaded */
  nextPage: number | null;
  setGuestbook: SetGuestbook;
  moreEntries: () => Promise<void>;
  postEntry: typeof postGuestbookEntry;
  updateEntry: typeof updateGuestbookEntry;
  deleteEntry: typeof deleteGuestbookEntry;
};

const GuestbookContext = createContext<GuestbookValue | null>(null);

// TODO: refactor: put users to another ctx

export const GuestbookProvider = ({ children }: { children: ReactNode }) => {
  const users = useRef(new Map<string, AuthPublicUserSafe>());
  // null if reach max
  const [nextPage, setNextPage] = useState<number | null>(0);
  const [guestbook, setGuestbook] = useState<Guestbook>([]);
  const pathname = usePathname();

  const insertAuthor = async (_guestbooks: GuestbookEntry[]) => {
    const guestbooks = [..._guestbooks];
    // user id - guestbook
    const notAvailable = new Map<string, Guestbook>();

    for (const gb of guestbooks) {
      const guestbook = gb as Guestbook[number];
      const author = users.current.get(guestbook.userId);

      if (author) {
        guestbook.author = author;
      } else {
        const arr = notAvailable.get(guestbook.userId) ?? [];
        arr.push(guestbook);
        notAvailable.set(guestbook.userId, arr);
      }
    }

    if (notAvailable.size) {
      const localUsers = await getPublicUsers(notAvailable.keys().toArray());
      for (const user of localUsers.data) {
        const entries = notAvailable.get(user.id)!;
        for (const gb of entries) gb.author = user;
        users.current.set(user.id, user);
      }
    }

    return guestbooks as Guestbook;
  };

  const postEntry: typeof postGuestbookEntry = async (...args) => {
    const entry = await postGuestbookEntry(...args);
    const withAuthor = await insertAuthor([entry.data]);
    setGuestbook((prev) => [...withAuthor, ...prev].sort((a, b) => Number(b.pinned) - Number(a.pinned)));
    return entry;
  };

  const moreEntries = async () => {
    if (nextPage === null) return;
    const newEntries = await getGuestbookEntries({ limit: GUESTBOOK_ENTRIES_PER_PAGE, page: nextPage });
    const withAuthor = await insertAuthor(newEntries.data.docs);
    setNextPage(newEntries.data.nextPage || null);
    setGuestbook((prev) => [...prev, ...withAuthor]);
  };

  const updateEntry: typeof updateGuestbookEntry = async (...args) => {
    const updated = await updateGuestbookEntry(...args);
    if (updated.data) {
      const withAuthor = (await insertAuthor([updated.data]))[0];
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
    const f = async () => {
      if (pathname?.endsWith("/guestbook") && !fetchedRef.current) {
        const entries = await getGuestbookEntries({ limit: GUESTBOOK_ENTRIES_PER_PAGE });
        setGuestbook(await insertAuthor(entries.data.docs));
        setNextPage(entries.data.nextPage || null);
        fetchedRef.current = true;
      }
    };
    f();
  }, [pathname]);

  return (
    <GuestbookContext.Provider value={{ guestbook, setGuestbook, postEntry, moreEntries, updateEntry, deleteEntry, nextPage }}>
      {children}
    </GuestbookContext.Provider>
  );
};

export const useGuestbook = () => {
  const ctx = useContext(GuestbookContext);
  if (!ctx) throw new Error("useGuestbook must be used within GuestbookProvider");
  return ctx;
};
