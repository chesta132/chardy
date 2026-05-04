import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center overflow-x-hidden">
      <Hero />
      <div className="h-screen w-screen" />
    </main>
  );
}
