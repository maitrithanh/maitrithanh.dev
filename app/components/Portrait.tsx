"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FRAMES, SECTORS, gazeFor, type Frame } from "@/lib/gaze";


// The portrait looks toward the pointer. All nine frames stay mounted and
// only opacity changes, so swaps never flash while an image decodes.
export function Portrait({ bubble, className }: { bubble?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<Frame>("center");
  const reduce = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    let idle: ReturnType<typeof setTimeout>;
    let point: { x: number; y: number } | null = null;

    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el || !point) return;
      const r = el.getBoundingClientRect();
      // Aim at the eyes, roughly a third of the way down the image.
      setFrame(gazeFor(point.x - (r.left + r.width / 2), point.y - (r.top + r.height * 0.36), r.width * 0.28));
    };
    let glance: ReturnType<typeof setInterval> | undefined;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") clearInterval(glance); // a real mouse takes over from idle glances
      point = { x: e.clientX, y: e.clientY };
      if (!raf) raf = requestAnimationFrame(update);
      clearTimeout(idle);
      idle = setTimeout(() => setFrame("center"), 4000);
    };
    const onLeave = () => setFrame("center");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    // Touch screens have no hover, so glance around now and then instead.
    if (!reduce && !matchMedia("(pointer: fine)").matches) {
      glance = setInterval(() => {
        setFrame(SECTORS[Math.floor(Math.random() * SECTORS.length)]);
        setTimeout(() => setFrame("center"), 1100);
      }, 3200);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      clearInterval(glance);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce]);

  return (
    <div className={className}>
      <div className="relative">
        <motion.div
          aria-hidden
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-[6%] bottom-0 top-[18%] rounded-t-full bg-marigold"
        />
        <motion.div
          ref={ref}
          initial={reduce ? false : { y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[433/540] overflow-hidden"
        >
          {FRAMES.map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f}
              src={`/portrait/${f}.webp`}
              alt={f === "center" ? "Mai Trí Thành" : ""}
              aria-hidden={f !== "center"}
              width={433}
              height={576}
              fetchPriority={f === "center" ? "high" : "low"}
              draggable={false}
              className={`absolute inset-x-0 top-0 h-auto w-full select-none transition-opacity duration-75 ${frame === f ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </motion.div>

        {bubble && (
          <motion.p
            initial={reduce ? false : { scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 22, delay: 0.9 }}
            style={{ transformOrigin: "100% 100%" }}
            className="absolute -left-6 top-[3%] max-w-[11rem] sm:top-[12%] sm:max-w-[13rem] rounded-2xl rounded-br-sm bg-card px-4 py-2.5 text-sm font-medium leading-snug text-card-foreground shadow-[0_12px_32px_-12px_hsl(231_52%_18%/0.35)] sm:-left-10"
          >
            {bubble}
          </motion.p>
        )}
      </div>
    </div>
  );
}
