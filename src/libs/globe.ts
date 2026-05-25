export const ROTATION_SPEED = 0.002;
export const DRAG_SENSITIVITY = 0.005;
export const VELOCITY_DAMPING = 0.95;
export const DEFAULT_GLOBE_SIZE = 600;

export const WEST_JAVA_GLOBE_COOR: [number, number] = [-6.3194, 107.005];

export const INITIAL_PHI = -1.8;
export const INITIAL_THETA = 0.3;

export function isWebGLSupported(canvas: HTMLCanvasElement): boolean {
  return !!canvas.getContext("webgl") || !!canvas.getContext("experimental-webgl");
}

export function clampTheta(val: number): number {
  return Math.max(-Math.PI / 2, Math.min(Math.PI / 2, val));
}
