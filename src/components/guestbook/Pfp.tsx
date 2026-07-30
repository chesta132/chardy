import { cn } from "@/libs/utils";
import Image from "next/image";
import { FaUser } from "react-icons/fa";

export const Pfp = ({ classname, user }: { classname?: string; user: { image?: string | null; name: string } }) => {
  return user.image ? (
    <Image alt={`${user.name}'s profile image`} src={user.image} width={50} height={50} className={cn("rounded-full", classname)} />
  ) : (
    <div className={cn("size-12.5 rounded-full border flex justify-center items-center", classname)}>
      <FaUser size={20} />
    </div>
  );
};
