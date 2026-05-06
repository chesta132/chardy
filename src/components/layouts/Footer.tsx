"use client";

import Link from "next/link";
import { ChardyLogo } from "../ui/Logo";
import { FaGithub, FaLinkedin, FaRegEnvelope } from "react-icons/fa";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { cn } from "@/libs/utils";
import { APP_DOMAIN } from "@/config";
import { useSmoothScroll } from "@/contexts/SmoothScroll";
import { usePathname } from "next/navigation";

const SOCIAL_ITEMS = [
  { label: "GitHub", href: "https://github.com/chesta132", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chesta-ardiona-895601405", icon: FaLinkedin },
  { label: "Email", href: "mailto:chestaardi4@gmail.com", icon: FaRegEnvelope },
];

const NAV_ITEMS = [
  { label: "Home", href: "/#" },
  { label: "Projects", href: "/projects" },
  { label: "About Me", href: "/#about-me" },
  { label: "Contact Me", href: "/#contact-me" },
];

export const Footer = ({ className, asChild }: { className?: string; asChild?: boolean }) => {
  const lenis = useSmoothScroll();
  const pathname = usePathname();

  const handleNavClick = (item: (typeof NAV_ITEMS)[number], e: React.MouseEvent<HTMLAnchorElement>) => {
    if (item.href.startsWith("/#") && pathname === "/") {
      e.preventDefault();
      lenis.scrollTo(item.href.substring(1), { duration: 1.2 });
    } else if (item.href === pathname) {
      e.preventDefault();
      lenis.scrollTo(0, { duration: 1.2 });
    }
  };

  const Wrapper = asChild ? "div" : "footer";

  return (
    <Wrapper className={cn("w-full border-t border-foreground/10 px-6 py-8 flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-6  sm:items-start sm:justify-between">
        {/* Logo + tagline */}
        <div className="flex flex-col text-center sm:text-start gap-2">
          <div className="invert-40 flex justify-center sm:justify-start">
            <ChardyLogo animateOnHover className="h-8 w-fit" />
          </div>
          <p className="text-xs font-supply-mono text-foreground/40 uppercase tracking-widest mt-1">Chesta Ardiona — Portfolio</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30 mb-1">Pages</span>
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
                <RollingLabel>{item.label}</RollingLabel>
              </Link>
            ))}
          </div>

          {/* Social links */}
          <div className="flex flex-col gap-2">
            <span className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30 mb-1">Socials</span>
            {SOCIAL_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex group gap-2 uppercase text-[0.7rem] leading-4 cursor-pointer text-foreground/60 hover:text-secondary",
                  rollingLabelGroupClass,
                )}
              >
                <item.icon className="text-foreground/40!" />
                <RollingLabel>{item.label}</RollingLabel>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-foreground/10 pt-4 flex flex-col justify-between gap-2">
        <p className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/30">
          © {new Date().getFullYear()} Chesta Ardiona. All rights reserved.
        </p>
        <p className="text-[0.65rem] font-supply-mono uppercase tracking-widest text-foreground/20">{APP_DOMAIN}</p>
      </div>
    </Wrapper>
  );
};
