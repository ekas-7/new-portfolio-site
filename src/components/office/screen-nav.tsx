"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BackIndexItem } from "@/content/sections";
import styles from "./laptop.module.css";

export function ScreenNav({ rooms }: { rooms: BackIndexItem[] }) {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Sections">
      <ol>
        {rooms.map((room) => {
          const active = pathname === room.href;
          return (
            <li key={room.id} data-active={active || undefined}>
              <Link
                href={room.href}
                className={styles.navLink}
                aria-current={active ? "page" : undefined}
                title={room.label.en}
              >
                <span className={styles.navNumber}>{room.number}</span>
                <span className={styles.navLabel}>
                  <span className={styles.navJp}>{room.label.jp}</span>
                  <span className={styles.navEn}>{room.label.en}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
