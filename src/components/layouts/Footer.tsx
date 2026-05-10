"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { ChardyLogo } from "../ui/Logo";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { cn } from "@/libs/utils";
import { APP_DOMAIN, OWNER_FULLNAME } from "@/config";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { useTranslations } from "next-intl";
import { ContactMe } from "@/types/payload";
import { getSocialItems } from "../home/ContactMe";

const NAV_ITEMS = [
  { t: "home", href: "/#" },
  { t: "projects", href: "/projects" },
  { t: "about", href: "/#about-me" },
  { t: "contact", href: "/#contact-me" },
] as const;

type FooterProps = { className?: string; asChild?: boolean; hideOnHomeWithXL?: boolean; socials: ContactMe["socials"] };

export const Footer = ({ className, asChild, hideOnHomeWithXL, socials }: FooterProps) => {
  const t = useTranslations();

  const lenis = useSmoothScroll();
  const pathname = usePathname();

  const handleNavClick = (item: (typeof NAV_ITEMS)[number], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href.startsWith("/#") && pathname === "/") {
      lenis.scrollTo(item.href.substring(1), { duration: 1.2 });
    } else if (item.href === pathname) {
      lenis.scrollTo(0, { duration: 1.2 });
    }
  };

  const Wrapper = asChild ? "div" : "footer";

  return (
    <Wrapper
      className={cn(
        "w-full border-t border-foreground/10 px-6 py-8 flex flex-col gap-6",
        hideOnHomeWithXL && pathname === "/" && "xl:hidden",
        className,
      )}
    >
      <div className="flex flex-col gap-6  sm:items-start sm:justify-between">
        {/* Logo + tagline */}
        <div className="flex flex-col text-center sm:text-start gap-2">
          <div className="invert-40 flex justify-center sm:justify-start">
            <ChardyLogo animateOnHover className="h-8 w-fit" />
          </div>
          <p className="text-xs font-supply-mono text-foreground/40 uppercase tracking-widest mt-1">{t("Footer.header", { name: OWNER_FULLNAME })}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30 mb-1">{t("Footer.pages")}</span>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex group gap-2 uppercase text-[0.7rem] leading-4 cursor-pointer text-foreground/60 hover:text-secondary",
                  rollingLabelGroupClass,
                )}
                onClick={(e) => handleNavClick(item, e)}
              >
                <RollingLabel>{t(`Nav.${item.t}`)}</RollingLabel>
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30 mb-1">{t("Footer.socials")}</span>
            {getSocialItems(socials).map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.label}${item.href.startsWith("mailto:") ? "" : " (opens in new tab)"}`}
                className={cn(
                  "flex group gap-2 uppercase text-[0.7rem] leading-4 cursor-pointer text-foreground/60 hover:text-secondary",
                  rollingLabelGroupClass,
                )}
              >
                <item.icon className="text-foreground/40!" aria-hidden="true" />
                <RollingLabel>{item.label}</RollingLabel>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/10 pt-4 flex flex-col justify-between gap-2">
        <p className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30">
          {t("Footer.copyright", { year: new Date().getFullYear(), name: OWNER_FULLNAME })}
        </p>
        <p className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/20">{APP_DOMAIN}</p>
      </div>
    </Wrapper>
  );
};
