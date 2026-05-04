import Logo from "@/assets/images/logo-1k.svg";
import { cn } from "@/libs/utils";
import Image from "next/image";

export const ChardyLogo = ({ className, ...props }: Omit<React.ComponentProps<typeof Image>, "src" | "alt">) => {
  return <Image src={Logo} alt="Chardy logo" className={cn("w-auto h-6", className)} {...props} />;
};
