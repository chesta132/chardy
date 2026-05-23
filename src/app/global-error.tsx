"use client";

import { ErrorLayout, ErrorPageData } from "@/components/error";
import { isDevEnv } from "@/config";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (isDevEnv()) {
      console.error("[GlobalErrorPage]", error.message, error.digest);
    } else {
      Sentry.captureException(error);
    }
  }, [error]);

  // english as default
  const data: ErrorPageData = {
    variant: "unexpected",
    code: "500",
    title: "Something Went Wrong",
    description: "An unexpected error occurred on our end. We have been notified and are working on a fix.",
    actionLabel: "Back to Home",
    actionHref: "/",
  };

  return (
    <html lang="en">
      <body>
        <ErrorLayout data={data} />
        <button
          onClick={reset}
          className="sr-only focus:not-sr-only focus:fixed focus:bottom-6 focus:right-6 focus:z-50 focus:px-4 focus:py-2 focus:bg-secondary focus:text-white focus:rounded-lg focus:font-supply-mono focus:text-xs"
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
