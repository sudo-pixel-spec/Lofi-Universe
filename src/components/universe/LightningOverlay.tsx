"use client";

import { useEffect, useState } from "react";
import { EnvironmentId } from "@/data/environments";

export default function LightningOverlay({
  envId,
  night,
  rain
}: {
  envId: EnvironmentId;
  night: boolean;
  rain: number;
}) {
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const enabled = envId === "tokyo" && night && rain > 0.35;
    if (!enabled) {
      setFlash(0);
      return;
    }

    let t1: any = null;
    let t2: any = null;

    function schedule() {
      const base = 14000;
      const variance = 18000;
      const freqBoost = Math.max(0, (rain - 0.35) / 0.65);
      const delay = base + Math.random() * variance - freqBoost * 5000;

      t1 = setTimeout(() => {
        setFlash(1);

        t2 = setTimeout(() => setFlash(0), 90 + Math.random() * 120);

        if (Math.random() < 0.35 + freqBoost * 0.25) {
          setTimeout(() => {
            setFlash(1);
            setTimeout(() => setFlash(0), 70 + Math.random() * 110);
          }, 180 + Math.random() * 220);
        }

        schedule();
      }, Math.max(3500, delay));
    }

    schedule();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [envId, night, rain]);

  if (!flash) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-white/40 mix-blend-screen" />
      <div className="absolute inset-0 bg-blue-200/20 mix-blend-screen" />
    </div>
  );
}