"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import FallbackGlobe from "@/assets/images/globe.webp";
import { useDragRotation } from "@/hooks/useDragRotation";
import { ROTATION_SPEED, VELOCITY_DAMPING, DEFAULT_GLOBE_SIZE, INITIAL_PHI, INITIAL_THETA, isWebGLSupported, clampTheta } from "@/libs/globe";

export const Globe = (options: Partial<COBEOptions>) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);

  const phi = useRef(INITIAL_PHI);
  const theta = useRef(INITIAL_THETA);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const size = useRef(DEFAULT_GLOBE_SIZE);

  const [webglSupported, setWebglSupported] = useState(true);

  const { onPointerDown, isDragging } = useDragRotation(phi, theta, velocityX, velocityY);

  const createGlobeInstance = useCallback(() => {
    if (!canvasRef.current) return;
    if (!isWebGLSupported(canvasRef.current)) {
      console.warn("WebGL not available — falling back to static image.");
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
            velocityX.current *= VELOCITY_DAMPING;
            velocityY.current *= VELOCITY_DAMPING;
            phi.current += velocityX.current + ROTATION_SPEED;
            theta.current = clampTheta(theta.current + velocityY.current);
          }
        },
        ...options,
      });
    } catch (err) {
      console.warn("Failed to create globe:", err);
      setWebglSupported(false);
    }
  }, [isDragging, options]);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const newSize = entries[0].contentRect.width;
      if (Math.abs(newSize - size.current) < 1) return;
      size.current = newSize;
      createGlobeInstance();
    });

    size.current = containerRef.current.offsetWidth || DEFAULT_GLOBE_SIZE;
    createGlobeInstance();
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      globeRef.current?.destroy();
    };
  }, [createGlobeInstance]);

  return (
    <div
      ref={containerRef}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      className="w-full max-w-2xl aspect-square cursor-grab active:cursor-grabbing"
    >
      {webglSupported ? <canvas ref={canvasRef} className="size-full" /> : <Image src={FallbackGlobe} alt="" role="presentation" />}
    </div>
  );
};
