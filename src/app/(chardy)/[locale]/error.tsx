"use client";

/**
 * Next.js error boundary — rendered when an unhandled error is thrown
 * during rendering in the [locale] segment tree.
 *
 * Must be a Client Component (Next.js requirement for error.tsx files).
 * Translations are pulled via useTranslations since this runs on the client.
 */

import { useTranslations } from "next-intl";
import { ErrorLayout } from "@/components/error";
import type { ErrorPageData } from "@/components/error";
import { isDevEnv } from "@/config";

interface ErrorPageProps {
  /** The underlying error thrown at runtime */
  error: Error & { digest?: string };
  /** Next.js-provided reset function to retry rendering the segment */
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations("Error.Pages.Unexpected");

  if (isDevEnv()) {
    console.error("[ErrorPage]", error.message, error.digest);
  }

  const data: ErrorPageData = {
    variant: "unexpected",
    code: "500",
    title: t("title"),
    description: t("description"),
    // Reuse the reset callback as the primary CTA so users can recover
    actionLabel: t("action"),
    actionHref: "/",
  };

  // TODO: add email to owner about the error and cache it to make sure same error not notified more than 1 time

  return (
    <div>
      <ErrorLayout data={data} />
      {/* Hidden reset trigger — the main CTA navigates home, but */}
      {/* power users can retry rendering without a full navigation */}
      <button
        onClick={reset}
        className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:right-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary focus:text-white focus:rounded-lg focus:font-supply-mono focus:text-xs"
      >
        {t("retry")}
      </button>
    </div>
  );
}
