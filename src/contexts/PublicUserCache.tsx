"use client";

import { getPublicUsers } from "@/libs/auth-client";
import { AuthPublicUserSafe } from "@/types/auth";
import { createContext, useContext, useRef, ReactNode } from "react";

type WithAuthor<T> = T & { author: AuthPublicUserSafe };

type PublicUserCacheValue = {
  /** user id - users safe */
  users: React.RefObject<Map<string, AuthPublicUserSafe>>;
  /** attach `author` property from userId as foreign key */
  attachAuthors: <T extends { userId: string }>(items: T[]) => Promise<WithAuthor<T>[]>;
};

const PublicUserCacheContext = createContext<PublicUserCacheValue | null>(null);

export const PublicUserCacheProvider = ({ children }: { children: ReactNode }) => {
  const users = useRef(new Map<string, AuthPublicUserSafe>());

  const attachAuthors = async <T extends { userId: string }>(_items: T[]) => {
    const items = [..._items] as WithAuthor<T>[];
    // user id - items
    const notAvailable = new Map<string, WithAuthor<T>[]>();

    for (const item of items) {
      const author = users.current.get(item.userId);
      if (author) {
        item.author = author;
      } else {
        const arr = notAvailable.get(item.userId) ?? [];
        arr.push(item);
        notAvailable.set(item.userId, arr);
      }
    }

    if (notAvailable.size) {
      const localUsers = await getPublicUsers(notAvailable.keys().toArray());
      for (const user of localUsers.data) {
        const entries = notAvailable.get(user.id)!;
        for (const item of entries) item.author = user;
        users.current.set(user.id, user);
      }
    }

    return items;
  };

  return <PublicUserCacheContext.Provider value={{ attachAuthors, users }}>{children}</PublicUserCacheContext.Provider>;
};

export const usePublicUserCache = () => {
  const ctx = useContext(PublicUserCacheContext);
  if (!ctx) throw new Error("usePublicUserCache must be used within PublicUserCacheProvider");
  return ctx;
};
