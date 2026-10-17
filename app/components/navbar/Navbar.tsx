"use client";
import React, { useEffect, useRef, useState } from "react";
import { menu } from "@/data/menu";
import MenuItem from "./MenuItem";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MobileNav from "./MobileNav";
import Backdrop from "../Backdrop";
import { Button } from "@/components/ui/button";
const Navbar = () => {
  const pathName = usePathname();
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isShowBorder, setIsShowBorder] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) < 6) {
        return;
      }
      setIsShowBorder(true);

      if (currentY <= 40) {
        setIsShowBorder(false);
        setIsHeaderVisible(true);
        lastScrollY.current = currentY;
        return;
      }

      if (!isOpenMenu) {
        if (delta > 0 && currentY > 90) {
          setIsHeaderVisible(false);
        } else {
          setIsHeaderVisible(true);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpenMenu]);

  useEffect(() => {
    if (isOpenMenu) {
      setIsHeaderVisible(true);
    }
  }, [isOpenMenu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className={`${isShowBorder ? "border-b" : ""} bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300`}>
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-5 md:h-16 md:px-6">
          <Link
            href="/"
            prefetch
            className="inline-flex cursor-pointer items-center transition-opacity hover:opacity-80"
          >
            <span className="inline-flex items-center text-sm font-semibold tracking-tight text-foreground">
              Mai Tri Thanh
            </span>
          </Link>

          <ul className="hidden items-center gap-5 md:flex">
            {menu.map((item: any) => (
              <MenuItem
                key={item.name}
                name={item.name}
                pathname={item.pathName}
                active={pathName === item.pathName}
              />
            ))}
          </ul>

          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpenMenu(true)}
              aria-label="Open navigation menu"
              className="w-auto px-0 text-sm font-medium"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>

      {isOpenMenu && (
        <Backdrop setIsOpenMenu={setIsOpenMenu}>
          <MobileNav setIsOpenMenu={setIsOpenMenu} />
        </Backdrop>
      )}
    </header>
  );
};

export default Navbar;
