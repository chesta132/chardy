"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/libs/gsap/register";
import { cn } from "@/libs/utils";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
};

export const Marquee = ({ children, speed = 40, className }: MarqueeProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    isDragging: false,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
    currentSpeed: speed,
    xPos: 0,
    rafId: 0,
  });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const s = stateRef.current;
    s.currentSpeed = speed;
    const totalWidth = track.scrollWidth / 2;

    const tick = () => {
      if (!s.isDragging) {
        // smooth balik ke speed normal
        s.currentSpeed = gsap.utils.interpolate(s.currentSpeed, speed, 0.04);
        s.xPos -= s.currentSpeed * (1 / 60);
        if (s.xPos <= -totalWidth) s.xPos += totalWidth;
        if (s.xPos >= 0) s.xPos -= totalWidth;
        gsap.set(track, { x: s.xPos });
      }

      s.rafId = requestAnimationFrame(tick);
    };

    s.rafId = requestAnimationFrame(tick);

    const onMouseDown = (e: MouseEvent) => {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.lastTime = performance.now();
      s.velocity = 0;
      track.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!s.isDragging) return;
      const now = performance.now();
      const dt = Math.max(now - s.lastTime, 1);
      const dx = e.clientX - s.lastX;

      s.velocity = dx / dt;
      s.lastX = e.clientX;
      s.lastTime = now;

      s.xPos += dx;
      if (s.xPos <= -totalWidth) s.xPos += totalWidth;
      if (s.xPos >= 0) s.xPos -= totalWidth;
      gsap.set(track, { x: s.xPos });
    };

    const onMouseUp = () => {
      if (!s.isDragging) return;
      s.isDragging = false;
      track.style.cursor = "grab";

      const throwSpeed = -s.velocity * 60;
      s.currentSpeed = throwSpeed;
    };

    track.style.cursor = "grab";
    track.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      cancelAnimationFrame(s.rafId);
      track.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [speed]);

  return (
    <div className={cn("overflow-hidden w-full", className)}>
      <div ref={trackRef} className="flex w-max select-none">
        {children}
        {children}
      </div>
    </div>
  );
};
