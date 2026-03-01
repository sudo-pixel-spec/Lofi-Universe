"use client";

import { useEffect, useRef, useState } from "react";

export function usePulse({
  enabled,
  speed = 0.9,
  amount = 1.0
}: {
  enabled: boolean;
  speed?: number;
  amount?: number;
}) {
  const [pulse, setPulse] = useState(0);
  const raf = useRef<number | null>(null);

  const phase = useRef(Math.random() * 1000);
  const last = useRef(performance.now());

  useEffect(() => {
    if (!enabled) {
      setPulse(0);
      return;
    }

    function loop(now: number) {
      const dt = Math.min(0.05, (now - last.current) / 1000);
      last.current = now;

      phase.current += dt * (1.2 + speed * 2.2);

      const a =
        0.55 +
        0.25 * Math.sin(phase.current * 1.0) +
        0.18 * Math.sin(phase.current * 1.9 + 1.7) +
        0.10 * Math.sin(phase.current * 3.1 + 0.4);

      const kick = Math.max(0, Math.sin(phase.current * 0.9 + 2.2));
      const v = Math.min(1, Math.max(0, (a + kick * 0.22) * amount));

      setPulse((p) => p + (v - p) * 0.15);

      raf.current = requestAnimationFrame(loop);
    }

    raf.current = requestAnimationFrame(loop);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = null;
    };
  }, [enabled, speed, amount]);

  return pulse;
}