"use client";

import { useEffect, useRef } from "react";

export default function FilmGrain({ amount = 0.06 }: { amount?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      w = Math.floor(window.innerWidth);
      h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let last = performance.now();
    function loop(now: number) {
      if (now - last > 70) {
        last = now;

        const img = ctx.createImageData(w, h);
        const d = img.data;

        for (let i = 0; i < d.length; i += 16) {
          const v = (Math.random() * 255) | 0;
          d[i + 0] = v;
          d[i + 1] = v;
          d[i + 2] = v;
          d[i + 3] = 28;
        }

        ctx.putImageData(img, 0, 0);
      }

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: amount,
        mixBlendMode: "overlay"
      }}
    />
  );
}