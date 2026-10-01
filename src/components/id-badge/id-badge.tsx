"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import type { BadgeContent, Bilingual, DetailCell, LabeledValue } from "@/content/profile";
import styles from "./id-badge.module.css";

const TILT_X = 12;
const TILT_Y = 16;
const DRIFT = 10;
const MAX_ZOOM = 2;
// Must match --render-scale in the stylesheet; the badge is authored this much larger so zooming stays crisp.
const RENDER_SCALE = 2;
const MIN_ZOOM = 1.35;
const FOCUSED_TILT = 0.4;
const EDGE_LAYERS = 8;

const pointerSpring = { stiffness: 90, damping: 16, mass: 1.2 };
const zoomSpring = { stiffness: 120, damping: 20, mass: 1.3 };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function IdBadge({ content }: { content: BadgeContent }) {
  const reduceMotion = useReducedMotion();
  const badgeRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, pointerSpring);
  const y = useSpring(pointerY, pointerSpring);

  const zoomTarget = useMotionValue(1.8);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const zoom = useSpring(1, zoomSpring);

  const focus = useTransform(() => clamp((zoom.get() - 1) / (zoomTarget.get() - 1), 0, 1));
  const tilt = useTransform(() => 1 - (1 - FOCUSED_TILT) * focus.get());

  const rotateY = useTransform(() => x.get() * TILT_Y * tilt.get());
  const rotateX = useTransform(() => -y.get() * TILT_X * tilt.get());
  const translateX = useTransform(() => {
    const f = focus.get();
    return x.get() * (DRIFT * (1 - f) - panX.get() * f);
  });
  const translateY = useTransform(() => {
    const f = focus.get();
    return y.get() * (DRIFT * (1 - f) - panY.get() * f);
  });

  const renderScale = useTransform(zoom, (z) => z / RENDER_SCALE);
  const transform = useMotionTemplate`translate3d(${translateX}px, ${translateY}px, 0) scale3d(${renderScale}, ${renderScale}, ${renderScale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const distance = useTransform(() => Math.min(1, Math.hypot(x.get(), y.get())));
  const glareX = useTransform(x, (v) => 50 + v * 45);
  const glareY = useTransform(y, (v) => 50 + v * 45);
  const glareOpacity = useTransform(() => (0.15 + 0.6 * distance.get()) * (1 - 0.5 * focus.get()));
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 28%, rgba(255,255,255,0) 60%)`;

  const sheenAngle = useTransform(() => 115 + x.get() * 18 + y.get() * 8);
  const sheenPos = useTransform(() => 50 - x.get() * 40 - y.get() * 25);
  const sheenOpacity = useTransform(() => (0.4 + 0.6 * distance.get()) * (1 - 0.5 * focus.get()));
  const sheen = useMotionTemplate`linear-gradient(${sheenAngle}deg, rgba(255,255,255,0) 35%, rgba(255,255,255,0.24) 46%, rgba(255,255,255,0.05) 52%, rgba(255,255,255,0) 60%)`;
  const sheenPosition = useMotionTemplate`${sheenPos}% ${sheenPos}%`;

  const shadeAngle = useTransform(() => (Math.atan2(y.get(), x.get()) * 180) / Math.PI + 270);
  const shade = useMotionTemplate`linear-gradient(${shadeAngle}deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.14) 100%)`;

  const spotX = useTransform(x, (v) => 50 + v * 50);
  const spotY = useTransform(y, (v) => 45 + v * 50);
  const spotlight = useMotionTemplate`radial-gradient(circle at ${spotX}% ${spotY}%, var(--spot), transparent 45%)`;

  const shadowX = useTransform(() => -x.get() * 22);
  const shadowY = useTransform(() => 30 - y.get() * 10);
  const shadowScale = useTransform(() => 1 + (zoom.get() - 1) * 0.5);
  const shadowOpacity = useTransform(() => 0.55 - 0.35 * focus.get());

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set(clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1));
      pointerY.set(clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1));
    };
    const reset = () => {
      pointerX.set(0);
      pointerY.set(0);
    };
    const root = document.documentElement;
    window.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, [reduceMotion, pointerX, pointerY]);

  useEffect(() => {
    const measure = () => {
      const el = badgeRef.current;
      if (!el) return;
      const w = el.offsetWidth / RENDER_SCALE;
      const h = el.offsetHeight / RENDER_SCALE;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const z = clamp((vw * 0.96) / w, MIN_ZOOM, MAX_ZOOM);
      zoomTarget.set(z);
      panX.set(Math.max(0, (w * z - vw) / 2 + 32));
      panY.set(Math.max(0, (h * z - vh) / 2 + 32));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [zoomTarget, panX, panY]);

  useEffect(() => {
    const apply = () => zoom.set(focused ? zoomTarget.get() : 1);
    apply();
    return zoomTarget.on("change", apply);
  }, [focused, zoom, zoomTarget]);

  useEffect(() => {
    if (!focused) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setFocused(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused]);

  const handleStageClick = (e: MouseEvent) => {
    const onBadge = badgeRef.current?.contains(e.target as Node) ?? false;
    setFocused((f) => (f ? false : onBadge));
  };

  const handleBadgeKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFocused((f) => !f);
    }
  };

  return (
    <div className={styles.stage} data-focused={focused} onClick={handleStageClick}>
      <motion.div aria-hidden className={styles.spotlight} style={{ backgroundImage: spotlight }} />
      <div className={styles.rig}>
        <motion.div
          aria-hidden
          className={styles.shadow}
          style={{ x: shadowX, y: shadowY, scale: shadowScale, opacity: shadowOpacity }}
        />

        <motion.div
          ref={badgeRef}
          role="button"
          tabIndex={0}
          aria-pressed={focused}
          aria-label={`ID badge for ${content.name.value.en}. ${focused ? "Click to return" : "Click to inspect"}`}
          onKeyDown={handleBadgeKey}
          className={styles.badge}
          style={{ transform }}
        >
          {Array.from({ length: EDGE_LAYERS }, (_, i) => (
            <div
              key={i}
              aria-hidden
              className={styles.edge}
              style={{ transform: `translateZ(calc(${-(i + 1) * 1.25} * var(--u)))` }}
            />
          ))}

          <div className={styles.face}>
            <div className={styles.slot} />
            <div className={styles.rim} />
            <BadgeCard content={content} />
            <motion.div aria-hidden className={styles.glare} style={{ backgroundImage: glare, opacity: glareOpacity }} />
            <motion.div
              aria-hidden
              className={styles.sheen}
              style={{ backgroundImage: sheen, backgroundPosition: sheenPosition, opacity: sheenOpacity }}
            />
            <motion.div aria-hidden className={styles.shade} style={{ backgroundImage: shade, opacity: distance }} />
          </div>
        </motion.div>
      </div>

      <p className={styles.hint} data-focused={focused} aria-hidden>
        {focused ? "click anywhere to return" : "click badge to inspect"}
      </p>
    </div>
  );
}
function BadgeCard({ content }: { content: BadgeContent }) {
  return (
    <div className={styles.card}>
      <div className={styles.portrait}>
        <div className={styles.portraitImage}>
          <Image src={content.portrait.src} alt={content.portrait.alt} fill sizes="400px" loading="eager" />
        </div>
        <span className={`${styles.corner} ${styles.cornerTl}`} />
        <span className={`${styles.corner} ${styles.cornerTr}`} />
        <span className={`${styles.corner} ${styles.cornerBl}`} />
        <span className={`${styles.corner} ${styles.cornerBr}`} />
      </div>

      <div className={styles.stamp}>
        <div className={styles.stampBox}>
          <span className={styles.stampJp}>{content.status.jp}</span>
          <span className={styles.stampEn}>{content.status.en}</span>
        </div>
        <div className={styles.stampStripes} />
      </div>

      {content.fields.map((field, i) => (
        <Field key={field.label.en} field={field} index={i} />
      ))}

      <div className={styles.nameplate}>
        <div className={styles.nameMain}>
          <Label label={content.name.label} className={styles.nameLabel} />
          <span className={styles.nameJp}>{content.name.value.jp}</span>
          <span className={styles.nameEn}>{content.name.value.en}</span>
        </div>
        <div className={styles.signature}>
          <svg className={styles.signatureMark} viewBox="0 0 40 30" fill="none" aria-hidden>
            <path
              d="M9 23c2-7 4-16 7-17 3-1-1 12-4 18-1 2 2-5 5-8 2-2 3 2 3 5 1-4 4-7 6-5 1 2 1 4 3 4s4-2 5-3"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M18 26.5h14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>
          <span className={styles.signatureRule} />
          <span className={styles.signatureJp}>{content.signature.jp}</span>
          <span className={styles.signatureEn}>{content.signature.en}</span>
        </div>
      </div>

      <div className={styles.grid}>
        <DetailColumn cells={content.details.start} />
        <div className={styles.logoCell}>
          <Image className={styles.logo} src={content.logo.src} alt={content.logo.alt} width={62} height={62} unoptimized />
        </div>
        <DetailColumn cells={content.details.end} align="end" />
      </div>

      <div className={styles.bar}>
        <Stripes className={styles.barStripesStart} />
        <span className={styles.barText}>/ {content.division} /</span>
        <Stripes className={styles.barStripesEnd} />
      </div>
    </div>
  );
}

function Label({ label, className }: { label: Bilingual; className?: string }) {
  return (
    <span className={`${styles.label} ${className ?? ""}`}>
      <span className={styles.labelJp}>{label.jp}</span>
      <span className={styles.labelEn}>{label.en}</span>
    </span>
  );
}

function Field({ field, index }: { field: LabeledValue; index: number }) {
  return (
    <div className={styles.field} style={{ "--index": index } as CSSProperties}>
      <Label label={field.label} />
      <span className={styles.fieldValue}>
        <span className={styles.fieldJp}>{field.value.jp}</span>
        <span className={styles.fieldEn}>{field.value.en}</span>
      </span>
    </div>
  );
}

function DetailColumn({ cells, align = "start" }: { cells: DetailCell[]; align?: "start" | "end" }) {
  return (
    <div className={styles.column} data-align={align}>
      {cells.map((cell) => (
        <div key={cell.label} className={styles.cell}>
          <span className={styles.cellLabel}>{cell.label}</span>
          <span className={styles.cellValue}>{cell.value}</span>
        </div>
      ))}
    </div>
  );
}

function Stripes({ className }: { className: string }) {
  return (
    <span className={`${styles.barStripes} ${className}`} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} />
      ))}
    </span>
  );
}
