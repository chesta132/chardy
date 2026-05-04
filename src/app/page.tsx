import Image from "next/image";
import Logo from "@/assets/images/logo-1k.svg";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Image className="invert dark:invert-0" src={Logo} alt="Chardy logo" width={100} height={20} priority />
    </main>
  );
}
