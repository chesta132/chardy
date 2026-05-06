"use client";

import { useTextReveal } from "@/hooks/useTextReveal";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/libs/utils";
import { Button } from "../ui/Button";
import { FaGithub, FaLinkedin, FaRegEnvelope } from "react-icons/fa";
import { RollingLabel, rollingLabelGroupClass } from "../ui/Label";
import { ContactMeForm } from "../contact-me/Form";
import { Footer } from "../layouts/Footer";

const SOCIAL_ITEMS = [
  { label: "GitHub", href: "https://github.com/chesta132", icon: FaGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/chesta-ardiona-895601405", icon: FaLinkedin },
  { label: "Email", href: "mailto:chestaardi4@gmail.com", icon: FaRegEnvelope },
];

export const ContactMe = () => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useTextReveal(headerRef, { on: "enter-view", direction: "up" });
  useTextReveal(leftRef, { on: "enter-view", direction: "left" });
  useTextReveal(rightRef, { on: "enter-view", direction: "right" });

  return (
    <section id="contact-me" className="flex flex-col gap-8 py-16 px-2 md:px-4 w-full min-h-dvh">
      <div ref={headerRef} className="flex justify-between w-full items-center">
        <h2 className="text-[clamp(2rem,5vw,3.75rem)] leading-[1.1] font-neue-montreal reveal-text">Contact Me</h2>
        {/* TODO: use payload cms */}
        <Link href="mailto:chestaardi4@gmail.com" className={cn("text-foreground hover:text-secondary reveal-text")}>
          <Button>Email Me Directly</Button>
        </Link>
      </div>
      <div className="flex flex-col lg:flex-row justify-between gap-10 px-2 lg:px-5">
        <div ref={leftRef} className="flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            {SOCIAL_ITEMS.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex group gap-2 uppercase leading-4 cursor-pointer hover:text-secondary text-[clamp(0.2rem,3vw,0.8rem)] reveal-text",
                  rollingLabelGroupClass,
                )}
              >
                <item.icon className="text-text-dark!" />
                <RollingLabel>{item.label}</RollingLabel>
              </a>
            ))}
          </div>
          <Footer className="hidden xl:flex mt-10 px-0 border-none" asChild />
        </div>
        <div ref={rightRef}>
          <ContactMeForm />
        </div>
      </div>
    </section>
  );
};
