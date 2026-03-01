"use client";

import { Environment } from "@/data/environments";
import RainCanvas from "@/fx/RainCanvas";
import ParticlesCanvas from "@/fx/ParticlesCanvas";

export default function SceneStage({
  env,
  night,
  rain
}: {
  env: Environment;
  night: boolean;
  rain: number;
}) {
  const bg = night ? env.bgNight : env.bgDay;

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${bg})` }}
      />

      <div className="absolute inset-0">
        <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
        {night ? (
          <div className="absolute inset-0 bg-blue-900/15 mix-blend-screen" />
        ) : (
          <div className="absolute inset-0 bg-amber-200/10 mix-blend-soft-light" />
        )}
      </div>

      <ParticlesCanvas intensity={night ? 0.8 : 0.55} />
      <RainCanvas intensity={rain} />
    </div>
  );
}