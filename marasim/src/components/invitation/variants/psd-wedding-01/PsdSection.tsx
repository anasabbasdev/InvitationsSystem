"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PSD_WIDTH } from "./coords";

type PsdSectionProps = {
  plateSrc: string;
  heightPsd: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PsdSection({ plateSrc, heightPsd, children, className = "", style }: PsdSectionProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`psd-section relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: `${PSD_WIDTH} / ${heightPsd}`,
        containerType: "inline-size",
        ...style,
      }}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plateSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
        draggable={false}
      />
      <div className="absolute inset-0">{children}</div>
    </motion.div>
  );
}

type PsdBoxProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  sectionY: number;
  sectionH: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function PsdBox({
  x,
  y,
  width,
  height,
  sectionY,
  sectionH,
  children,
  className = "",
  style,
}: PsdBoxProps) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${(x / PSD_WIDTH) * 100}%`,
        top: `${((y - sectionY) / sectionH) * 100}%`,
        width: `${(width / PSD_WIDTH) * 100}%`,
        height: `${(height / sectionH) * 100}%`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
