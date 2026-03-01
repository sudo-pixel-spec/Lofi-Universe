"use client";

import { useEffect, useRef } from "react";

type Puff = { x: number; y: number; r: number; vx: number; vy: number; a: number };

export default function FogCanvas({
  intensity = 0.5,
  cool = true
}: {
  intensity?: number;
  cool?: boolean;
}) {
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

    const puffs: Puff[] = [];

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
      puffs.length = 0;
      const count = Math.floor(6 + intensity * 14);
      for (let i = 0; i < count; i++) {
        puffs.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 180 + Math.random() * 320,
          vx: (-6 + Math.random() * 12) * 0.15,
          vy: (-6 + Math.random() * 12) * 0.12,
          a: 0.012 + Math.random() * 0.02
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

      const base = cool ? "180,210,255" : "255,230,190";

      for (const p of puffs) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;

        if (p.x < -p.r) p.x = w + p.r;
        if (p.x > w + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = h + p.r;
        if (p.y > h + p.r) p.y = -p.r;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(${base}, ${p.a})`);
        g.addColorStop(1, `rgba(${base}, 0)`);

        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [intensity, cool]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" />;
}