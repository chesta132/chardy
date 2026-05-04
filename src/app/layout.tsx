import type { Metadata } from "next";
import "../assets/styles/main.css";
import { inter } from "@/fonts/inter";
import { neueMontreal } from "@/fonts/neueMontreal";
import { PPSuplyMono, PPSuplySans } from "@/fonts/ppSupply";
import SmoothScroll from "@/contexts/SmoothScroll";
import { cn } from "@/libs/utils";
import { Topbar } from "@/components/layouts/Topbar";

// TODO: better metadata
export const metadata: Metadata = {
  title: "Chardy",
  description: "Chesta Ardiona's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", inter.variable, neueMontreal.variable, PPSuplySans.variable, PPSuplyMono.variable)}>
      <body className="min-h-full flex flex-col bg-background">
        <SmoothScroll>
          <Topbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
