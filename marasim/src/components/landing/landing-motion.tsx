"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { type ReactNode } from "react";

export const landingEase = [0.22, 1, 0.36, 1] as const;

export function useLandingMotion() {
  const reduced = useReducedMotion();
  return {
    reduced: Boolean(reduced),
    fadeUp: reduced
      ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
      : { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    } satisfies Variants,
    transition: (delay = 0) => ({
      duration: reduced ? 0.25 : 0.75,
      delay,
      ease: landingEase,
    }),
    viewport: { once: true, margin: "-10% 0px -10% 0px" as const },
  };
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const { reduced, fadeUp, transition, viewport } = useLandingMotion();
  const Comp = motion[as];

  return (
    <Comp
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeUp}
      transition={transition(delay)}
      className={className}
      style={reduced ? undefined : { willChange: "transform, opacity" }}
    >
      {children}
    </Comp>
  );
}

type StaggerProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  stagger?: number;
};

export function StaggerChildren({ children, stagger = 0.08, className, ...rest }: StaggerProps) {
  const { reduced, transition, viewport } = useLandingMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: reduced ? 0 : 0.05,
          },
        },
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { fadeUp, transition } = useLandingMotion();

  return (
    <motion.div variants={fadeUp} transition={transition()} className={className}>
      {children}
    </motion.div>
  );
}

export function LineReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { reduced, transition } = useLandingMotion();

  return (
    <span className={`block overflow-hidden ${className ?? ""}`}>
      <motion.span
        className="block"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: "110%" }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={transition(delay)}
      >
        {children}
      </motion.span>
    </span>
  );
}
