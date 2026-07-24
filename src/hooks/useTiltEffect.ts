import { gsap } from "@/libs/gsap/register";
import { useEffect, useRef, RefObject } from "react";

type TiltProp = "x" | "y" | "rotationX" | "rotationY" | "scaleX" | "scaleY";

const TILT_CONFIG = { duration: 0.5, ease: "power2.out" };

export function useTiltEffect(targetRef: RefObject<HTMLElement | null>) {
  const tweens = useRef<Partial<Record<TiltProp, gsap.QuickToFunc>>>({});

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const props: TiltProp[] = ["x", "y", "rotationX", "rotationY", "scaleX", "scaleY"];
    props.forEach((prop) => {
      tweens.current[prop] = gsap.quickTo(el, prop, TILT_CONFIG);
    });
  }, [targetRef]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>, cardRef: RefObject<HTMLElement | null>) => {
    const card = cardRef.current;
    if (!card) return;

    const { left, top, width, height } = card.getBoundingClientRect();

    // normalized -0.5 to 0.5
    const xNorm = (e.clientX - left) / width - 0.5;
    const yNorm = (e.clientY - top) / height - 0.5;

    tweens.current.x?.(xNorm * 18);
    tweens.current.y?.(yNorm * 14);
    tweens.current.rotationX?.(-yNorm * 6);
    tweens.current.rotationY?.(xNorm * 6);
    tweens.current.scaleX?.(1.06);
    tweens.current.scaleY?.(1.06);
  };

  const onMouseLeave = () => {
    tweens.current.x?.(0);
    tweens.current.y?.(0);
    tweens.current.rotationX?.(0);
    tweens.current.rotationY?.(0);
    tweens.current.scaleX?.(1);
    tweens.current.scaleY?.(1);
  };

  return { onMouseMove, onMouseLeave };
}
