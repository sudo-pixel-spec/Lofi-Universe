"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Ripple = {
  id: string;
  x: number;
  y: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export default function CustomCursor() {
  const reduced = useMemo(() => prefersReducedMotion(), []);
  const touch = useMemo(() => isTouchDevice(), []);

  const [enabled, setEnabled] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  const target = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (touch) return;
    setEnabled(true);
  }, [touch]);

  useEffect(() => {
    if (!enabled) return;

    target.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    smooth.current = { ...target.current };

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const onDown = (e: MouseEvent) => {
      setIsDown(true);

      const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
      setRipples((prev) => [...prev.slice(-8), { id, x: e.clientX, y: e.clientY }]);

      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 650);
    };

    const onUp = () => setIsDown(false);

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;
      const interactive = el.closest("a,button,[role='button'],input,select,textarea,label");
      setIsHovering(!!interactive);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver, { passive: true });

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const lerp = reduced ? 1 : 0.22;
      smooth.current.x += (target.current.x - smooth.current.x) * lerp;
      smooth.current.y += (target.current.y - smooth.current.y) * lerp;

      const dot = dotRef.current;
      const ring = ringRef.current;

      if (dot) dot.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0)`;
      if (ring) ring.style.transform = `translate3d(${smooth.current.x}px, ${smooth.current.y}px, 0)`;

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove as any);
      window.removeEventListener("mousedown", onDown as any);
      window.removeEventListener("mouseup", onUp as any);
      window.removeEventListener("mouseover", onOver as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [enabled, reduced]);

  if (!enabled) return null;

  const ringScale = isHovering ? 1.55 : isDown ? 0.9 : 1.15;
  const ringOpacity = isHovering ? 0.65 : 0.45;

  return (
    <>
      <style>{`html, body { cursor: none !important; }`}</style>

      {!reduced &&
        ripples.map((r) => (
          <div
            key={r.id}
            className="pointer-events-none fixed left-0 top-0 z-[9999]"
            style={{ transform: `translate3d(${r.x}px, ${r.y}px, 0)` }}
          >
            <div className="cursor-ripple-ring" />
            <div className="cursor-sparks">
              {Array.from({ length: 10 }).map((_, i) => (
                <span
                  key={i}
                  className="cursor-spark"
                  style={{ ["--a" as any]: `${i * 36}deg` }}
                />
              ))}
            </div>
          </div>
        ))}

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[10000]"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div className="cursor-star" />
      </div>

      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div
          className="cursor-orbit"
          style={{
            transform: `translate(-50%, -50%) scale(${ringScale})`,
            opacity: ringOpacity
          }}
        />
      </div>

      <style>{`
        .cursor-star{
          width: 6px; height: 6px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.65) 45%, rgba(180,210,255,0.35) 70%, rgba(0,0,0,0) 100%);
          box-shadow:
            0 0 18px rgba(180,210,255,0.22),
            0 0 40px rgba(120,160,255,0.10);
        }

        .cursor-orbit{
          width: 34px; height: 34px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(6px);
          box-shadow: 0 0 30px rgba(120,160,255,0.12);
          will-change: transform, opacity;
        }

        .cursor-ripple-ring{
          position: absolute;
          left: 0; top: 0;
          width: 10px; height: 10px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.45);
          box-shadow: 0 0 22px rgba(120,160,255,0.18);
          animation: cursorRipple 620ms ease-out forwards;
          mix-blend-mode: screen;
        }

        .cursor-sparks{
          position: absolute;
          left: 0; top: 0;
          transform: translate(-50%, -50%);
          mix-blend-mode: screen;
        }

        .cursor-spark{
          position: absolute;
          left: 0; top: 0;
          width: 4px; height: 4px;
          border-radius: 999px;
          background: rgba(255,255,255,0.65);
          box-shadow: 0 0 14px rgba(180,210,255,0.22);
          transform: rotate(var(--a)) translateX(0px);
          animation: cursorSpark 520ms ease-out forwards;
        }

        @keyframes cursorRipple {
          0%   { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(18); }
        }

        @keyframes cursorSpark {
          0%   { opacity: 0.75; transform: rotate(var(--a)) translateX(0px) scale(1); }
          100% { opacity: 0;    transform: rotate(var(--a)) translateX(26px) scale(0.6); }
        }
      `}</style>
    </>
  );
}