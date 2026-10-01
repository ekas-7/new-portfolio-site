"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { BackIndexItem } from "@/content/sections";
import styles from "./laptop.module.css";

export function ScreenNav({ rooms }: { rooms: BackIndexItem[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On phones the nav is a horizontal strip; keep the current room in view.
  useEffect(() => {
    const nav = navRef.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !active || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollTo({ left: active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2, behavior: "smooth" });
  }, [pathname]);

  return (
    <nav ref={navRef} className={styles.nav} aria-label="Sections">
      <ol>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link
              href={room.href}
              className={styles.navLink}
              aria-current={pathname === room.href ? "page" : undefined}
            >
              <span className={styles.navNumber}>{room.number}</span>
              <span className={styles.navLabel}>
                <span className={styles.navJp}>{room.label.jp}</span>
                <span className={styles.navEn}>{room.label.en}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
