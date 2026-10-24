"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { menu } from "@/data/menu";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

// Floating pill nav. Hides while scrolling down, returns on scroll up; the
// active-page highlight slides between links.
const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY.current) < 6) return;
      setHidden(y > lastY.current && y > 120);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-3 z-40 px-4 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:top-4 ${hidden && !open ? "-translate-y-[150%]" : ""}`}>
      <nav aria-label="Main" className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full px-3 pl-5 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${scrolled || open ? "bg-background/75 shadow-[0_8px_30px_-12px_hsl(231_52%_18%/0.25)] ring-1 ring-border backdrop-blur-xl" : ""}`}>
        <Link href="/" className="font-display text-lg font-bold tracking-tight [font-stretch:85%]">
          Thành<span className="text-marigold">.</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {menu.map((item) => {
            const active = isActive(pathname, item.pathName);
            return (
              <li key={item.pathName} className="relative">
                {active && (
                  <motion.span layoutId="nav-active" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-full bg-foreground" />
                )}
                <Link
                  href={item.pathName}
                  aria-current={active ? "page" : undefined}
                  className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${active ? "text-background" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 max-w-6xl rounded-3xl bg-background/95 p-3 ring-1 ring-border backdrop-blur-xl md:hidden"
          >
            <ul>
              {menu.map((item, i) => (
                <motion.li key={item.pathName} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                  <Link
                    href={item.pathName}
                    aria-current={isActive(pathname, item.pathName) ? "page" : undefined}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 font-display text-3xl font-semibold tracking-tight aria-[current=page]:bg-muted"
                  >
                    {item.name}
                    {isActive(pathname, item.pathName) && <span className="size-2 rounded-full bg-marigold" />}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
