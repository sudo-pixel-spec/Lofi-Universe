"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; r: number; vx: number; vy: number; a: number };

export default function ParticlesCanvas({ intensity = 0.6 }: { intensity?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (canvasEl === null) return;
    const canvas: HTMLCanvasElement = canvasEl;

    const ctxEl = canvas.getContext("2d");
    if (ctxEl === null) return;
    const ctx: CanvasRenderingContext2D = ctxEl;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const pts: P[] = [];

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);

      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const seed = () => {
      pts.length = 0;
      const count = Math.floor(30 + intensity * 80);
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.6 + Math.random() * 1.8,
          vx: -2 + Math.random() * 4,
          vy: -6 + Math.random() * 10,
          a: 0.03 + Math.random() * 0.05
        });
      }
    };

    resize();
    seed();

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx * dt * 18;
        p.y += p.vy * dt * 18;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-20" />;
}