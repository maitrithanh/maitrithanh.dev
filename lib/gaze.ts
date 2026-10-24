// Screen-space sectors, clockwise from "pointing right" (y grows downward).
export const SECTORS = ["right", "down-right", "down", "down-left", "left", "up-left", "up", "up-right"] as const;
export const FRAMES = ["center", ...SECTORS] as const;
export type Frame = (typeof FRAMES)[number];

// Which portrait frame faces a point offset (dx, dy) from the eyes.
export function gazeFor(dx: number, dy: number, deadZone: number): Frame {
  if (Math.hypot(dx, dy) < deadZone) return "center";
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..180, 0 = right, 90 = down
  return SECTORS[(Math.round(angle / 45) + 8) % 8];
}
