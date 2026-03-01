"use client";

import { Environment } from "@/data/environments";
import RainCanvas from "@/fx/RainCanvas";
import ParticlesCanvas from "@/fx/ParticlesCanvas";
import FogCanvas from "@/fx/FogCanvas";
import EnvironmentOverlays from "./EnvironmentOverlays";
import CameraRig from "./CameraRig";
import FilmGrain from "./FilmGrain";

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

  const rainTint = night ? "rgba(180,210,255,1)" : "rgba(255,240,210,1)";

  const fogIntensity = night ? 0.55 + rain * 0.2 : 0.35 + rain * 0.12;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <CameraRig strength={10} speed={0.0016}>
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${bg})` }}
        />

        <div className="absolute inset-0">
          <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.88)_100%)]" />

          {night ? (
            <div className="absolute inset-0 bg-blue-900/18 mix-blend-screen" />
          ) : (
            <div className="absolute inset-0 bg-amber-200/10 mix-blend-soft-light" />
          )}

          {night ? (
            <div className="absolute inset-0 mix-blend-screen opacity-40 [background:radial-gradient(circle_at_60%_40%,rgba(120,170,255,0.22)_0%,rgba(120,170,255,0)_55%),radial-gradient(circle_at_30%_70%,rgba(255,120,220,0.14)_0%,rgba(255,120,220,0)_55%)]" />
          ) : (
            <div className="absolute inset-0 mix-blend-screen opacity-30 [background:radial-gradient(circle_at_55%_35%,rgba(255,220,140,0.18)_0%,rgba(255,220,140,0)_55%),radial-gradient(circle_at_35%_75%,rgba(180,255,230,0.10)_0%,rgba(180,255,230,0)_55%)]" />
          )}
        </div>

        <EnvironmentOverlays overlays={env.overlays} />
      </CameraRig>

      <FogCanvas intensity={fogIntensity} cool={night} />
      <ParticlesCanvas intensity={night ? 0.8 : 0.55} />

      <RainCanvas intensity={rain} tint={rainTint} />

      <FilmGrain amount={0.06} />
    </div>
  );
}