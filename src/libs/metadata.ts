import { APP_NAME, APP_URL, LOCATION, OWNER_FULLNAME } from "@/config";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const defaultMetadata = async (locale: string): Promise<Metadata> => {
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    authors: [{ name: OWNER_FULLNAME, url: APP_URL }],
    creator: OWNER_FULLNAME,
    metadataBase: new URL(APP_URL),

    openGraph: {
      title: t("title", { name: OWNER_FULLNAME }),
      description: t("og.description", { location: LOCATION }),
      url: APP_URL,
      siteName: APP_NAME,
      locale: t("og.locale"),
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title", { name: OWNER_FULLNAME }),
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t("title", { name: OWNER_FULLNAME }),
      description: t("twitter.description", { location: LOCATION }),
      images: ["/og-image.png"],
    },

    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16" },
        { url: "/favicon-32x32.png", sizes: "32x32" },
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
};
