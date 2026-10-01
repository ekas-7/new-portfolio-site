import Link from "next/link";
import type { ReactNode } from "react";
import type { OfficeContent } from "@/content/profile";
import type { BackIndexItem } from "@/content/sections";
import { ScreenNav } from "./screen-nav";
import styles from "./laptop.module.css";

export function Laptop({
  office,
  rooms,
  children,
}: {
  office: OfficeContent;
  rooms: BackIndexItem[];
  children: ReactNode;
}) {
  return (
    <div className={styles.room}>
      <div className={styles.laptop}>
        <div className={styles.lid}>
          <span className={styles.camera} aria-hidden />
          <div className={styles.screen}>
            <header className={styles.menubar}>
              <span className={styles.host}>
                <span className={styles.dot} aria-hidden />
                {office.laptop.host}
              </span>
              <span>{office.laptop.status}</span>
            </header>
            <div className={styles.window}>
              <div className={styles.titlebar}>
                <span className={styles.lights} aria-hidden>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.windowTitle}>~/portfolio</span>
              </div>
              <div className={styles.body}>
                <ScreenNav rooms={rooms} />
                <div className={styles.pane}>{children}</div>
              </div>
            </div>
            <span className={styles.glass} aria-hidden />
          </div>
        </div>
        <div className={styles.base} aria-hidden>
          <span className={styles.notch} />
        </div>
      </div>

      <div className={styles.controls}>
        <Link href="/" className={styles.exit} aria-label={`${office.exit.jp} · ${office.exit.en}`}>
          <span aria-hidden>←</span>
          {office.exit.jp}
          <span className={styles.exitEn}>· {office.exit.en}</span>
        </Link>
      </div>
    </div>
  );
}
