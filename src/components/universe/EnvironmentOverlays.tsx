"use client";

import { Overlay } from "@/data/environments";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function EnvironmentOverlays({ overlays }: { overlays?: Overlay[] }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.5 });

  useEffect(() => {
    function move(e: MouseEvent) {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mx.set(x);
      my.set(y);
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  if (!overlays?.length) return null;

 function animationProps(type?: string) {
  const easeInOut: number[] = [0.42, 0, 0.58, 1];

  switch (type) {
    case "float":
      return {
        animate: { y: [0, -6, 0] },
        transition: { duration: 6, repeat: Infinity, ease: easeInOut }
      };

    case "pulse":
      return {
        animate: { opacity: [0.65, 1, 0.65] },
        transition: { duration: 4, repeat: Infinity, ease: easeInOut }
      };

    case "flicker":
      return {
        animate: { opacity: [0.7, 1, 0.6, 1] },
        transition: { duration: 0.45, repeat: Infinity, repeatDelay: 2.8 }
      };

    case "sway":
      return {
        animate: { rotate: [-1.3, 1.3, -1.3] },
        transition: { duration: 8, repeat: Infinity, ease: easeInOut }
      };

    default:
      return {};
  }
}
  return (
    <>
      {overlays.map((o, i) => {
        const depth = o.depth ?? 0;

        return (
          <motion.img
            key={i}
            src={o.src}
            className={
              "absolute inset-0 h-full w-full object-cover pointer-events-none " +
              (o.className ?? "")
            }
            style={{
              x: sx.get() * depth * 18,
              y: sy.get() * depth * 18
            }}
            {...animationProps(o.animation)}
          />
        );
      })}
    </>
  );
}