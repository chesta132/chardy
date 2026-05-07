"use client";

import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { ChardyLogo } from "../ui/Logo";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { useState, useRef, useMemo } from "react";
import { gsap } from "@/libs/gsap/register";
import { FaGithub, FaGlobe, FaLinkedin, FaRegEnvelope } from "react-icons/fa";
import { useGSAP } from "@gsap/react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { RollingLabel } from "../ui/Label";
import { Button } from "../ui/Button";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";

const NAV_ITEMS = [
  { t: "home", href: "/#" },
  { t: "projects", href: "/projects" },
  { t: "about", href: "/#about-me" },
] as const;

const SOCIAL_ITEMS = [
  { label: "GitHub", href: "https://github.com/chesta132", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chesta-ardiona-895601405", icon: FaLinkedin },
  { label: "Email", href: "mailto:chestaardi4@gmail.com", icon: FaRegEnvelope },
];

export const Topbar = () => {
  // translations
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleNextLocale = () => {
    const current = routing.locales.indexOf(locale as any);
    const next = routing.locales[(current + 1) % routing.locales.length];
    router.replace(pathname, { locale: next });
  };

  const lenis = useSmoothScroll();
  const direction = useScrollDirection({ threshold: 10 });
  const [open, setOpen] = useState(false);
  const [initialed, setInitialed] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  // gsap for initial load animation
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;

      gsap.set(nav, { y: "-150%" });
      gsap.to(nav, { y: "0%", duration: 1.3, ease: "power3.inOut", onComplete: () => setInitialed(true) });
    },
    { scope: navRef, dependencies: [] },
  );

  // gsap for menu animation
  useGSAP(
    () => {
      const menu = menuRef.current;
      if (!menu) return;

      if (open) {
        gsap.set(menu, { display: "block" });
        gsap.fromTo(menu, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.5, ease: "power3.out" });
        gsap.fromTo(itemsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power3.out" });
      } else {
        gsap.to(menu, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power3.inOut",
          onComplete: () => gsap.set(menu, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: menuRef },
  );

  // gsap for hide/show on scroll
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      if (!initialed) return;

      if (direction === "down") {
        gsap.to(nav, { y: "-150%", duration: 0.6, ease: "power3.inOut" });
        setOpen(false);
      } else {
        gsap.to(nav, { y: "0%", duration: 0.6, ease: "power3.inOut" });
      }
    },
    { dependencies: [direction, initialed], scope: navRef },
  );

  const handleNavClick = (item: (typeof NAV_ITEMS)[number], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href.startsWith("/#") && pathname === "/") {
      lenis.scrollTo(item.href.substring(1), { duration: 1.2 });
    } else if (item.href === pathname) {
      lenis.scrollTo(0, { duration: 1.2 });
    }
  };

  return (
    <nav
      ref={navRef}
      className="m-4 md:m-6 lg:m-8 p-4 lg:py-5 lg:px-7 lg:justify-between lg:flex lg:items-center fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-foreground/35 rounded-xl border border-background/20"
    >
      <div className="flex items-center justify-between">
        <Link
          href={pathname === "/" ? "#" : "/"}
          onClick={() => {
            if (pathname === "/") {
              lenis.scrollTo(0, { duration: 1.2 });
            }
          }}
        >
          <ChardyLogo className="h-10" animateOnHover />
        </Link>
        <button className="mr-2 lg:hidden" onClick={() => setOpen((prev) => !prev)}>
          <Hamburger open={open} />
        </button>
      </div>

      {/* desktop menu */}
      <div className="space-x-10 hidden lg:flex">
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
        <Button withoutArrow onClick={handleNextLocale}>
          <div className="flex gap-2 items-center">
            <FaGlobe />
            {locale.toUpperCase()}
          </div>
        </Button>
        <Link href={"/#contact-me"} onClick={() => lenis.scrollTo("#contact-me", { duration: 1.2 })}>
          <Button>{t("contact")}</Button>
        </Link>
      </div>

      {/* mobile menu */}
      <div ref={menuRef} className="overflow-hidden lg:hidden!">
        <div className="mt-10 space-y-10">
          <div className="flex flex-col space-y-2">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el as any;
                }}
                className="group gap-2 uppercase leading-4 text-xs cursor-pointer text-primary hover:text-secondary transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
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
            {SOCIAL_ITEMS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                ref={(el) => {
                  if (el) itemsRef.current[NAV_ITEMS.length + i] = el as any;
                }}
                className="flex group gap-2 uppercase leading-4 text-xs cursor-pointer text-primary hover:text-secondary transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
              >
                <item.icon className="text-primary!" />
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

const Hamburger = ({ open }: { open: boolean }) => (
  <div className="space-y-2 w-5 cursor-pointer">
    <Line className={open ? "rotate-45 translate-y-1.25" : ""} />
    <Line className={open ? "-rotate-45 -translate-y-1.25" : ""} />
  </div>
);
