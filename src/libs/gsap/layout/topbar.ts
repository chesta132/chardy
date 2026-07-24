import { useGSAP } from "@gsap/react";
import { gsap } from "../register";
import { usePreference } from "@/contexts/Preference";
import { useState } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";

type useTopbarGSAPProps = {
  navRef: React.RefObject<HTMLElement | null>;
  menuRef: React.RefObject<HTMLElement | null>;
  itemsRef: React.RefObject<HTMLElement[]>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useTopbarGSAP = ({ navRef, menuRef, itemsRef, open, setOpen }: useTopbarGSAPProps) => {
  const { motion } = usePreference();
  const [initialed, setInitialed] = useState(false);
  const direction = useScrollDirection({ threshold: 10 });

  // gsap for initial load animation
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      // quite impossible
      // if (motion === "lite") return;

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

      // lite motion
      if (motion === "lite") {
        if (open) {
          gsap.set(menu, { display: "block", height: "auto", opacity: 1 });
        } else {
          gsap.set(menu, { height: 0, opacity: 0, onComplete: () => gsap.set(menu, { display: "none" }) });
        }
      } else {
        // full/reduce animation
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
      }
    },
    { dependencies: [open], scope: menuRef },
  );

  // gsap for hide/show on scroll except on lite
  useGSAP(
    () => {
      const nav = navRef.current;
      if (!nav) return;
      if (!initialed) return;
      if (motion === "lite") return;

      if (direction === "down") {
        gsap.to(nav, { y: "-150%", duration: 0.6, ease: "power3.inOut" });
        setOpen(false);
      } else {
        gsap.to(nav, { y: "0%", duration: 0.6, ease: "power3.inOut" });
      }
    },
    { dependencies: [direction, initialed], scope: navRef },
  );
};
