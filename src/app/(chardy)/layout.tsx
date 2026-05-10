import "@/assets/styles/main.css";
import { inter } from "@/fonts/inter";
import { neueMontreal } from "@/fonts/neueMontreal";
import { PPSuplyMono, PPSuplySans } from "@/fonts/ppSupply";
import { cn } from "@/libs/utils";
import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("h-full", "antialiased", inter.variable, neueMontreal.variable, PPSuplySans.variable, PPSuplyMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
