"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

type Project = { name: string; date: string; image: string; preview: string; tag: { tagName: string }[] };

// Projects as rows. With a mouse, the hovered project's screenshot trails the
// cursor and the other rows dim; on touch, each row shows its thumbnail.
export function WorkList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  return (
    <div
      className="group/list relative"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t">
        {projects.map((p, i) => (
          <li key={p.name} className="border-b last:border-b-0">
            <a
              href={p.preview}
              target="_blank"
              rel="noopener noreferrer"
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
              onFocus={() => setActive(null)}
              className="group grid grid-cols-[3.5rem_1fr_auto] items-center gap-x-4 py-5 transition-opacity duration-300 group-hover/list:opacity-40 hover:!opacity-100 focus-visible:!opacity-100 sm:grid-cols-[5rem_1fr_auto_auto] sm:py-6"
            >
              <span className="text-sm tabular-nums text-muted-foreground">{p.date}</span>
              <span className="font-display text-2xl font-semibold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 sm:text-4xl">
                {p.name}
              </span>
              <span className="hidden gap-1.5 sm:flex">
                {p.tag.slice(0, 3).map((t) => (
                  <span key={t.tagName} className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{t.tagName}</span>
                ))}
              </span>
              <span className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" loading="lazy" className="h-12 w-16 rounded-md object-cover [@media(pointer:fine)]:hidden" />
                <span aria-label="opens in a new tab" className="text-xl text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground">↗</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active !== null && !reduce && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ left: sx, top: sy, x: "-50%", y: "-115%" }}
            className="pointer-events-none fixed z-30 hidden w-72 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/5 [@media(pointer:fine)]:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={projects[active].image} alt="" className="aspect-[16/10] w-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
