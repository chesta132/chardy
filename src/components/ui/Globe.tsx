"use client";

import { cn } from "@/libs/utils";
import createGlobe, { COBEOptions } from "cobe";
import { useEffect, useRef, useCallback, useState } from "react";

export const WEST_JAVA: [number, number] = [-6.3194, 107.005];

export const Globe = (options: Partial<COBEOptions>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phi = useRef(-1.8);
  const theta = useRef(0.3);
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const size = useRef(600);
  const [webglSupported, setWebglSupported] = useState(true);

  const createGlobeInstance = useCallback(() => {
    if (!canvasRef.current) return;

    // Check WebGL availability before attempting to create the globe
    const testCtx = canvasRef.current.getContext("webgl");
    if (!testCtx) {
      console.warn("WebGL is not available — skipping globe rendering.");
      setWebglSupported(false);
      return;
    }

    globeRef.current?.destroy();

    const s = size.current;
    canvasRef.current.style.width = `${s}px`;
    canvasRef.current.style.height = `${s}px`;

    try {
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: s * 2,
        height: s * 2,
        phi: phi.current,
        theta: theta.current,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.3, 0.3, 0.3],
        markerColor: [1, 0.302, 0.114],
        glowColor: [1, 1, 1],
        markers: [],
        onRender: (state) => {
          state.phi = phi.current;
          state.theta = theta.current;
          if (!isDragging.current) {
            velocityX.current *= 0.95;
            velocityY.current *= 0.95;
            phi.current += velocityX.current + 0.002;
            theta.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, theta.current + velocityY.current));
          }
        },
        ...options,
      });
    } catch (err) {
      console.warn("Failed to create globe instance:", err);
      setWebglSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    size.current = containerRef.current.offsetWidth || 600;
    createGlobeInstance();
    return () => globeRef.current?.destroy();
  }, [createGlobeInstance]);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const newSize = entries[0].contentRect.width;
      if (Math.abs(newSize - size.current) < 1) return;
      size.current = newSize;
      createGlobeInstance();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [createGlobeInstance]);

  const onPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    lastX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    lastY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
    velocityX.current = 0;
    velocityY.current = 0;
  }, []);

  const onPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging.current) return;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    const dx = clientX - lastX.current;
    const dy = clientY - lastY.current;
    phi.current += dx * 0.005;
    theta.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, theta.current + dy * 0.005));
    velocityX.current = dx * 0.005;
    velocityY.current = dy * 0.005;
    lastX.current = clientX;
    lastY.current = clientY;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  return (
    <div
      ref={containerRef}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      className="w-full max-w-2xl aspect-square cursor-grab active:cursor-grabbing"
    >
      {webglSupported && <canvas ref={canvasRef} className="size-full" />}
    </div>
  );
};
