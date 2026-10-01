import type { AnimationEventHandler } from "react";
import type { OfficeContent } from "@/content/profile";
import styles from "./door.module.css";

/** Sliding office doors. "closing" covers the screen; "opening" starts shut and parts on first paint. */
export function Door({
  door,
  mode,
  onClosed,
}: {
  door: OfficeContent["door"];
  mode: "closing" | "opening";
  onClosed?: () => void;
}) {
  const handleEnd: AnimationEventHandler = (e) => {
    if (e.target === e.currentTarget) onClosed?.();
  };

  return (
    <div className={styles.door} data-mode={mode} aria-hidden>
      <div className={`${styles.panel} ${styles.left}`} onAnimationEnd={onClosed ? handleEnd : undefined}>
        <span className={styles.handle} />
      </div>
      <div className={`${styles.panel} ${styles.right}`}>
        <span className={styles.handle} />
        <div className={styles.sign}>
          <span className={styles.signJp}>{door.room.jp}</span>
          <span className={styles.signEn}>{door.room.en}</span>
          <span className={styles.signRule} />
          <span className={styles.noticeJp}>{door.notice.jp}</span>
          <span className={styles.noticeEn}>{door.notice.en}</span>
          <span className={styles.signStripes} />
        </div>
      </div>
    </div>
  );
}
