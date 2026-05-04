import localFont from "next/font/local";

export const PPSuplyMono = localFont({
  src: [
    { path: "../assets/fonts/pp-suply/PPSupplyMono-Ultralight.otf", weight: "200", style: "normal" },
    { path: "../assets/fonts/pp-suply/PPSupplyMono-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-pp-supply-mono",
});

export const PPSuplySans = localFont({
  src: [
    { path: "../assets/fonts/pp-suply/PPSupplySans-Ultralight.otf", weight: "200", style: "normal" },
    { path: "../assets/fonts/pp-suply/PPSupplySans-Regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-pp-supply-sans",
});
