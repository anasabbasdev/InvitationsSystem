"use client";

import type { CSSProperties, ReactNode } from "react";
import { PSD_WIDTH } from "./coords";
import { PsdReveal } from "./PsdReveal";

type PsdSectionProps = {
  plateSrc: string;
  heightPsd: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export function PsdSection({ plateSrc, heightPsd, children, className = "", style, id }: PsdSectionProps) {
  return (
    <div
      id={id}
      className={`psd-section relative w-full overflow-hidden ${className}`}
      style={{
        aspectRatio: `${PSD_WIDTH} / ${heightPsd}`,
        containerType: "inline-size",
        ...style,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plateSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-top"
        draggable={false}
      />
      <div className="absolute inset-0">{children}</div>
    </div>
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
        position: "absolute",
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

export function PsdArt({
  src,
  x,
  y,
  width,
  height,
  sectionY,
  sectionH,
  alt = "",
  delay = 0,
}: {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  sectionY: number;
  sectionH: number;
  alt?: string;
  delay?: number;
}) {
  return (
    <PsdBox x={x} y={y} width={width} height={height} sectionY={sectionY} sectionH={sectionH} className="pointer-events-none">
      <PsdReveal className="h-full w-full" delay={delay}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="h-full w-full object-contain object-center" draggable={false} />
      </PsdReveal>
    </PsdBox>
  );
}
