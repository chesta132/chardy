import { Button } from "@/components/ui/Button";
import { authClient } from "@/libs/auth-client";
import { useTranslations } from "next-intl";
import { FaGithub, FaTerminal } from "react-icons/fa";

export const SignIn = () => {
  const t = useTranslations("Guestbook.signIn");
  const handleSignIn = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/guestbook",
      errorCallbackURL: "/guestbook",
    });
  };

  return (
    <div className="border border-dashed rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
        <div className="p-3 border rounded-full shrink-0">
          <FaTerminal />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-sm">{t("title")}</p>
          <p className="text-xs text-text-dark/70">{t("subtitle")}</p>
        </div>
      </div>
      <Button className="bg-foreground text-text-light fill-text-light" onClick={handleSignIn}>
        <div className="flex gap-2 items-center">
          <FaGithub />
          GitHub
        </div>
      </Button>
    </div>
  );
};
