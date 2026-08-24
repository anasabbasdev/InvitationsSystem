"use client";

import { useEffect, useRef } from "react";

type Kind = "petal" | "foil" | "spark";

type Speck = {
  kind: Kind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  sway: number;
  swayAmp: number;
  size: number;
  fill: string;
  alpha: number;
};

const FILLS = ["#C4A35A", "#D4CEA9", "#E4D2A4", "#B89A74", "#F0E6C8", "#A67C2E"];

function seed(width: number, height: number, fromTop: boolean): Speck {
  const kindRoll = Math.random();
  const kind: Kind = kindRoll < 0.55 ? "petal" : kindRoll < 0.82 ? "foil" : "spark";
  return {
    kind,
    x: Math.random() * width,
    y: fromTop ? -20 - Math.random() * 80 : Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: 0.22 + Math.random() * 0.42,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.035,
    flip: Math.random() * Math.PI * 2,
    flipSpeed: 0.02 + Math.random() * 0.04,
    sway: Math.random() * Math.PI * 2,
    swayAmp: 0.35 + Math.random() * 0.7,
    size: kind === "spark" ? 3 + Math.random() * 3.5 : 5 + Math.random() * 8,
    fill: FILLS[Math.floor(Math.random() * FILLS.length)] ?? FILLS[0],
    alpha: 0.28 + Math.random() * 0.42,
  };
}

function drawSpeck(ctx: CanvasRenderingContext2D, p: Speck) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.fill;

  if (p.kind === "petal") {
    ctx.scale(1, 0.38 + 0.42 * Math.abs(Math.sin(p.flip)));
    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.35, p.size * 0.75, p.size * 0.45, 0, p.size);
    ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.45, -p.size * 0.85, -p.size * 0.35, 0, -p.size);
    ctx.fill();
  } else if (p.kind === "foil") {
    ctx.rotate(0.4);
    ctx.globalAlpha = p.alpha * (0.55 + 0.45 * Math.abs(Math.sin(p.flip)));
    ctx.fillRect(-p.size * 0.35, -p.size * 0.55, p.size * 0.7, p.size * 1.1);
  } else {
    const arm = p.size;
    ctx.beginPath();
    ctx.moveTo(0, -arm);
    ctx.lineTo(arm * 0.18, -arm * 0.18);
    ctx.lineTo(arm, 0);
    ctx.lineTo(arm * 0.18, arm * 0.18);
    ctx.lineTo(0, arm);
    ctx.lineTo(-arm * 0.18, arm * 0.18);
    ctx.lineTo(-arm, 0);
    ctx.lineTo(-arm * 0.18, -arm * 0.18);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/** Soft gold fall pinned to the viewport so it covers every scene while scrolling. */
export function PsdGoldFall() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas || reduce) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let specks: Speck[] = [];
    let running = true;
    let last = performance.now();
    const root = wrap.closest(".inv-root");

    const pinToInvitation = () => {
      const box = (root ?? wrap.parentElement)?.getBoundingClientRect();
      if (!box) return;
      wrap.style.left = `${Math.round(box.left)}px`;
      wrap.style.width = `${Math.round(box.width)}px`;
    };

    const resize = () => {
      pinToInvitation();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = w < 380 ? 18 : 24;
      if (specks.length !== count) {
        specks = Array.from({ length: count }, () => seed(w, h, false));
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", pinToInvitation, { passive: true });

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(32, now - last) / 16.67;
      last = now;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of specks) {
        p.sway += (0.012 + p.flipSpeed * 0.2) * dt;
        p.x += (p.vx + Math.sin(p.sway) * p.swayAmp) * dt;
        p.y += p.vy * dt;
        p.rot += p.spin * dt;
        p.flip += p.flipSpeed * dt;

        if (p.y > h + 24 || p.x < -28 || p.x > w + 28) {
          Object.assign(p, seed(w, h, true));
        }
        drawSpeck(ctx, p);
      }

      requestAnimationFrame(tick);
    };

    const id = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(id);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", pinToInvitation);
    };
  }, []);

  return (
    <div ref={wrapRef} className="psd-gold-fall" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
