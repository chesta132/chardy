import type { Metadata } from "next";
import "../assets/styles/main.css";
import { inter } from "@/fonts/inter";
import { neueMontreal } from "@/fonts/neueMontreal";
import { PPSuplyMono, PPSuplySans } from "@/fonts/ppSupply";

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
    <html lang="en" className={`${inter.variable} ${neueMontreal.variable} ${PPSuplySans.variable} ${PPSuplyMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
