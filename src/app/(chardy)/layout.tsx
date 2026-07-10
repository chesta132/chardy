import "@/assets/styles/main.css";
import { isProdEnv, TELEMETRY_PATH, UMAMI_URL, UMAMI_WEBSITE_ID } from "@/config";
import { inter } from "@/fonts/inter";
import { neueMontreal } from "@/fonts/neueMontreal";
import { PPSuplyMono, PPSuplySans } from "@/fonts/ppSupply";
import { cn } from "@/libs/utils";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, neueMontreal.variable, PPSuplySans.variable, PPSuplyMono.variable)}
      suppressHydrationWarning
    >
      <head>
        {isProdEnv() && UMAMI_URL && UMAMI_WEBSITE_ID && <Script defer src={TELEMETRY_PATH} data-website-id={UMAMI_WEBSITE_ID} />}
      </head>
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-lg focus:border focus:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
