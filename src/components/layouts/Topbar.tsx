"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ChardyLogo } from "../ui/Logo";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { useState, useRef } from "react";
import { MdAnimation } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { Button } from "../ui/Button";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { Locale } from "@/i18n/types";
import { cn } from "@/libs/utils";
import { ContactMe } from "@/types/payload";
import { getSocialItems } from "../home/ContactMe";
import { motionPreference, usePreference } from "@/contexts/Preference";
import { useTopbarGSAP } from "@/libs/gsap/layout/topbar";

const NAV_ITEMS = [
  { t: "home", href: "/#" },
  { t: "projects", href: "/projects" },
  { t: "about", href: "/#about-me" },
] as const;

const LANG_MAP: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};
const LANG_MAP_ENTRIES = Object.entries(LANG_MAP) as [Locale, string][];

export const Topbar = ({ socials }: { socials: ContactMe["socials"] }) => {
  // translations
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { motion, setMotion } = usePreference();
  const lenis = useSmoothScroll();

  const [open, setOpen] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLElement[]>([]);

  useTopbarGSAP({ itemsRef, menuRef, navRef, open, setOpen });

  const setLocale = (locale: Locale) => {
    router.replace(pathname, { locale });
  };

  const handleNavClick = (item: (typeof NAV_ITEMS)[number], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href.startsWith("/#") && pathname === "/") {
      lenis?.scrollTo(item.href.substring(1), { duration: 1.2 });
    } else if (item.href === pathname) {
      lenis?.scrollTo(0, { duration: 1.2 });
    }
  };

  const handleNextLocale = () => {
    const current = routing.locales.indexOf(locale as any);
    const next = routing.locales[(current + 1) % routing.locales.length];
    setLocale(next);
  };

  const handleNextMotion = () => {
    const current = motionPreference.indexOf(motion);
    const next = current === motionPreference.length - 1 ? 0 : current + 1;
    setMotion(motionPreference[next]);
  };

  return (
    <nav
      ref={navRef}
      className="m-4 md:m-6 lg:m-8 p-4 lg:py-5 lg:px-7 lg:justify-between lg:flex lg:items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-foreground/35 rounded-xl border border-background/20"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-between">
        <Link
          href={pathname === "/" ? "#" : "/"}
          onClick={() => {
            if (pathname === "/") {
              lenis?.scrollTo(0, { duration: 1.2 });
            }
          }}
        >
          <ChardyLogo className="h-10" animateOnHover />
        </Link>
        <button
          className="mr-2 lg:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <Hamburger open={open} />
        </button>
      </div>

      {/* desktop menu */}
      <div className="space-x-10 hidden lg:flex absolute left-1/2 -translate-x-1/2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => {
              handleNavClick(item, e);
            }}
            className="group gap-2 uppercase leading-4 cursor-pointer text-primary hover:text-secondary transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
          >
            <RollingLabel>{t(item.t)}</RollingLabel>
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex gap-2">
        <Button
          placeholder={
            <div className="flex gap-2 items-center justify-center" aria-hidden="true">
              <MdAnimation />
              ANIMATION
            </div>
          }
          withoutArrow
          onClick={() => handleNextMotion()}
        >
          <div className="flex gap-2 items-center justify-center" aria-hidden="true">
            <MdAnimation />
            {motion.toUpperCase()}
          </div>
        </Button>
        <Button withoutArrow onClick={handleNextLocale} aria-label={`Switch language, current: ${LANG_MAP[locale as Locale]}`}>
          <div className="flex gap-2 items-center" aria-hidden="true">
            <FaGlobe />
            {locale.toUpperCase()}
          </div>
        </Button>
        <Link href={"/#contact-me"} onClick={() => lenis?.scrollTo("#contact-me", { duration: 1.2 })}>
          <Button>{t("contact")}</Button>
        </Link>
      </div>

      {/* mobile menu */}
      <div
        ref={menuRef}
        id="mobile-menu"
        style={{ display: "none" }}
        className="overflow-hidden lg:hidden!"
        aria-label="Mobile navigation menu"
      >
        <div className="mt-10 space-y-10">
          <div className="flex flex-col space-y-2">
            <span className="text-xs leading-4 cursor-pointer text-primary/80 uppercase text-left">Language</span>
            {LANG_MAP_ENTRIES.map(([l, label], i) => (
              <button
                key={l}
                type="button"
                aria-label={`Switch language to ${label}`}
                aria-pressed={l === locale}
                className={cn(
                  "text-xs leading-4 cursor-pointer text-primary hover:text-secondary uppercase text-left",
                  rollingLabelGroupClass,
                  l === locale && "text-secondary",
                )}
                onClick={() => l !== locale && setLocale(l)}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
              >
                <RollingLabel>{label}</RollingLabel>
              </button>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs leading-4 cursor-pointer text-primary/80 uppercase text-left">Animation</span>
            {motionPreference.map((m, i) => (
              <button
                key={m}
                aria-label={`Switch animation to ${m}`}
                aria-pressed={m === motion}
                className={cn(
                  "text-xs leading-4 cursor-pointer text-primary hover:text-secondary uppercase text-left",
                  rollingLabelGroupClass,
                  m === motion && "text-secondary",
                )}
                ref={(el) => {
                  if (el) itemsRef.current[LANG_MAP_ENTRIES.length + i] = el;
                }}
                onClick={() => setMotion(m)}
              >
                <RollingLabel>{m}</RollingLabel>
              </button>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs leading-4 cursor-pointer text-primary/80 uppercase text-left">Pages</span>
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  if (el) itemsRef.current[motionPreference.length + LANG_MAP_ENTRIES.length + i] = el;
                }}
                className={cn("uppercase leading-4 text-xs cursor-pointer text-primary hover:text-secondary", rollingLabelGroupClass)}
                onClick={(e) => {
                  handleNavClick(item, e);
                  setOpen(false);
                }}
              >
                <RollingLabel>{t(item.t)}</RollingLabel>
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-xs leading-4 cursor-pointer text-primary/80 uppercase text-left">Social Media</span>
            {getSocialItems(socials).map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${item.label}${item.href.startsWith("mailto:") ? "" : " (opens in new tab)"}`}
                ref={(el) => {
                  if (el) itemsRef.current[motionPreference.length + LANG_MAP_ENTRIES.length + NAV_ITEMS.length + i] = el;
                }}
                className={cn(
                  "flex gap-2 uppercase leading-4 text-xs cursor-pointer text-primary hover:text-secondary",
                  rollingLabelGroupClass,
                )}
              >
                <item.icon className="text-primary!" aria-hidden="true" />
                <RollingLabel>{item.label}</RollingLabel>
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Line = ({ className }: { className?: string }) => (
  <div className={`w-full h-0.5 bg-background rounded-full transition-all duration-300 ${className}`} />
);

const Hamburger = ({ open }: { open: boolean }) => {
  const { motion } = usePreference();
  return (
    <div className="space-y-2 w-5 cursor-pointer" aria-hidden="true">
      <Line className={cn(open && "rotate-45 translate-y-1.25", motion === "lite" && "duration-0!")} />
      <Line className={cn(open && "-rotate-45 -translate-y-1.25", motion === "lite" && "duration-0!")} />
    </div>
  );
};
