"use client";

import { useEffect, useRef } from "react";
import { clamp } from "@/lib/clamp";

type Drop = { x: number; y: number; vx: number; vy: number; len: number; w: number; a: number };

export default function RainCanvas({
  intensity,
  tint = "rgba(255,255,255,1)"
}: {
  intensity: number;
  tint?: string;
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

    const drops: Drop[] = [];

    const resize = () => {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);

      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);

      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };

    const spawn = (count: number) => {
      for (let i = 0; i < count; i++) {
        const speed = 900 + Math.random() * 900;
        drops.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: -120 - Math.random() * 120,
          vy: speed,
          len: 10 + Math.random() * 20,
          w: 1 + Math.random() * 1.2,
          a: 0.05 + Math.random() * 0.12
        });
      }
    };

    const tick = (dt: number) => {
      const target = Math.floor(60 + intensity * 520);
      if (drops.length < target) spawn(Math.min(30, target - drops.length));
      if (drops.length > target) drops.splice(0, drops.length - target);

      ctx.clearRect(0, 0, w, h);

      for (const d of drops) {
        d.x += d.vx * dt;
        d.y += d.vy * dt;

        if (d.y > h + 50 || d.x < -50) {
          d.x = Math.random() * (w + 200) - 100;
          d.y = -Math.random() * 200;
        }

        const alpha = clamp(d.a * (0.35 + intensity), 0, 0.35);
        ctx.globalAlpha = alpha;

        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.vx * 0.03, d.y - d.len);
        ctx.strokeStyle = tint;
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      tick(dt);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, [intensity, tint]);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none z-30" />;
}