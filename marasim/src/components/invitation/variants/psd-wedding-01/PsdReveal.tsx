"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

type PsdRevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  x?: number;
  y?: number;
};

/**
 * Live text fades in as it enters the usable viewport, and fades out as it
 * nears either edge — including when scrolling down and the line approaches
 * the top of the screen. The lower band stays above the guest-lookup bar.
 */
export function PsdReveal({
  children,
  className = "",
  style,
  x = 0,
  y = 26,
}: PsdRevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.86", "end 0.14"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const yMove = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [y, 0, 0, -Math.round(y * 0.7)]);
  const xMove = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [x, 0, 0, 0]);

  useLayoutEffect(() => {
    setArmed(true);
  }, []);

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: armed ? opacity : 1,
        x: armed ? xMove : 0,
        y: armed ? yMove : 0,
      }}
    >
      {children}
    </motion.div>
  );
}
