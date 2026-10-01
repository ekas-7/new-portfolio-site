import type { Ref } from "react";
import type { OfficeContent } from "@/content/profile";
import styles from "./card-reader.module.css";

export function CardReader({
  reader,
  visible,
  granted,
  ref,
}: {
  reader: OfficeContent["reader"];
  visible: boolean;
  granted: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const status = granted ? reader.granted : reader.idle;

  return (
    <div className={styles.reader} data-visible={visible} data-granted={granted} inert={!visible}>
      <div ref={ref} className={styles.plate}>
        <span className={styles.led} />
        <svg className={styles.waves} viewBox="0 0 48 48" fill="none" aria-hidden>
          <path d="M18 14a14 14 0 0 1 0 20" />
          <path d="M24 9a21 21 0 0 1 0 30" />
          <path d="M30 4a28 28 0 0 1 0 40" />
          <circle cx="12" cy="24" r="3" />
        </svg>
        <span className={styles.grille} />
      </div>
      <p className={styles.status} role="status">
        <span className={styles.statusJp}>{status.jp}</span>
        <span className={styles.statusEn}>{status.en}</span>
        {!granted && (
          <>
            <span className={styles.hintJp}>{reader.hint.jp}</span>
            <span className={styles.hintEn}>{reader.hint.en}</span>
          </>
        )}
      </p>
    </div>
  );
}
