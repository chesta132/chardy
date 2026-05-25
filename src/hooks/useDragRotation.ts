import { RefObject } from "react";
import { useRef, useEffect, useCallback } from "react";
import { DRAG_SENSITIVITY } from "@/libs/globe";

export function useDragRotation(phi: RefObject<number>, theta: RefObject<number>, velocityX: RefObject<number>, velocityY: RefObject<number>) {
  const isDragging = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  const clampTheta = (val: number) => Math.max(-Math.PI / 2, Math.min(Math.PI / 2, val));

  const onPointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      lastX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
      lastY.current = "touches" in e ? e.touches[0].clientY : e.clientY;
      velocityX.current = 0;
      velocityY.current = 0;
    },
    [velocityX, velocityY],
  );

  const onPointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - lastX.current;
      const dy = clientY - lastY.current;
      phi.current += dx * DRAG_SENSITIVITY;
      theta.current = clampTheta(theta.current + dy * DRAG_SENSITIVITY);
      velocityX.current = dx * DRAG_SENSITIVITY;
      velocityY.current = dy * DRAG_SENSITIVITY;
      lastX.current = clientX;
      lastY.current = clientY;
    },
    [phi, theta, velocityX, velocityY],
  );

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

  return { onPointerDown, isDragging };
}
