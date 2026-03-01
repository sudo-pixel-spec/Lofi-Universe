"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

export default function CameraRig({
  children,
  strength = 10,
  speed = 0.0016
}: PropsWithChildren<{ strength?: number; speed?: number }>) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const target = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  const [transform, setTransform] = useState("translate3d(0px,0px,0) scale(1.02)");

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current = { x, y };
    }
    window.addEventListener("mousemove", onMove);

    let start = performance.now();

    function loop(now: number) {
      const t = now - start;

      smooth.current.x += (target.current.x - smooth.current.x) * 0.06;
      smooth.current.y += (target.current.y - smooth.current.y) * 0.06;

      const driftX = Math.sin(t * speed) * 0.6 + Math.sin(t * speed * 0.33) * 0.4;
      const driftY = Math.cos(t * speed * 0.9) * 0.6 + Math.sin(t * speed * 0.22) * 0.4;

      const x = (smooth.current.x * strength) + (driftX * strength);
      const y = (smooth.current.y * strength) + (driftY * strength);

      const s = 1.02;

      setTransform(`translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${s})`);
      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [strength, speed]);

  return (
    <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transform }}>
      {children}
    </div>
  );
}