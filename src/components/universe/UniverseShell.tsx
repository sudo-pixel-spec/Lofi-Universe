"use client";

import { useEffect, useMemo, useState } from "react";
import { ENVIRONMENTS, EnvironmentId } from "@/data/environments";
import { clamp } from "@/lib/clamp";
import { readJSON, writeJSON } from "@/lib/storage";
import SceneStage from "./SceneStage";
import SoftGlowUI from "./SoftGlowUI";
import AudioPlayer from "./AudioPlayer";
import QuoteFloat from "./QuoteFloat";
import StartOverlay from "./StartOverlay";
import { usePulse } from "@/lib/usePulse";
import LightningOverlay from "./LightningOverlay";

type Settings = {
  envId: EnvironmentId;
  night: boolean;
  rain: number;
  musicOn: boolean;
  musicVol: number;
  ambientOn: boolean;
  ambientVol: number;
  quotesOn: boolean;
  focus: boolean;
};

const KEY = "lofi_universe_settings_v1";

const DEFAULTS: Settings = {
  envId: "tokyo",
  night: true,
  rain: 0.75,
  musicOn: true,
  musicVol: 0.6,
  ambientOn: true,
  ambientVol: 0.7,
  quotesOn: true,
  focus: false
};

export default function UniverseShell() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [started, setStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readJSON<Settings>(KEY, DEFAULTS);
    setSettings(saved);
    setHydrated(true);
  }, []);

  const env = useMemo(
    () => ENVIRONMENTS.find((e) => e.id === settings.envId) ?? ENVIRONMENTS[0],
    [settings.envId]
  );

  const pulse = usePulse({
    enabled: started && settings.musicOn,
    speed: 0.9,
    amount: 1.0
  });

  useEffect(() => {
    if (!hydrated) return;
    setSettings((s) => ({
      ...s,
      night: env.defaultNight,
      rain: env.defaultRain
    }));
  }, [env.id, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    writeJSON(KEY, settings);
  }, [settings, hydrated]);

  function patch(p: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...p }));
  }

  useEffect(() => {
    if (!hydrated) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        patch({ musicOn: !settings.musicOn });
        setStarted(true);
      }
      if (e.key.toLowerCase() === "n") patch({ night: !settings.night });
      if (e.key.toLowerCase() === "q") patch({ quotesOn: !settings.quotesOn });
      if (e.key.toLowerCase() === "f") patch({ focus: !settings.focus });
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hydrated, settings.musicOn, settings.night, settings.quotesOn, settings.focus]);

  const rainUrl = env.rainSfxUrl ?? "/audio/rain-loop.mp3";

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white">
      <div className="absolute inset-0 z-0">
        <SceneStage env={env} night={settings.night} rain={settings.rain} />
        <LightningOverlay envId={settings.envId} night={settings.night} rain={settings.rain} />
      </div>

      {started && (
        <AudioPlayer
          fadeMs={1200}
          lofiUrl={env.lofiStreamUrl}
          ambientUrl={settings.night ? env.ambientNight : env.ambientDay}
          rainUrl={rainUrl}
          rainIntensity={settings.rain}
          rainMaxVol={1.2}
          musicOn={settings.musicOn}
          ambientOn={settings.ambientOn}
          musicVol={Math.pow(settings.musicVol, 1.6) * 0.65}
          ambientVol={settings.ambientVol}
        />
      )}

      {settings.quotesOn && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          <QuoteFloat />
        </div>
      )}

      {!settings.focus && (
        <div className="absolute inset-0 z-50">
          <SoftGlowUI
            pulse={pulse}
            envId={settings.envId}
            night={settings.night}
            rain={settings.rain}
            musicOn={settings.musicOn}
            ambientOn={settings.ambientOn}
            musicVol={settings.musicVol}
            ambientVol={settings.ambientVol}
            quotesOn={settings.quotesOn}
            onChangeEnv={(envId) => {
              patch({ envId });
              setStarted(true);
            }}
            onToggleNight={() => patch({ night: !settings.night })}
            onRain={(v) => patch({ rain: clamp(v, 0, 1) })}
            onToggleMusic={() => {
              patch({ musicOn: !settings.musicOn });
              setStarted(true);
            }}
            onToggleAmbient={() => {
              patch({ ambientOn: !settings.ambientOn });
              setStarted(true);
            }}
            onMusicVol={(v) => patch({ musicVol: clamp(v, 0, 1) })}
            onAmbientVol={(v) => patch({ ambientVol: clamp(v, 0, 1) })}
            onToggleQuotes={() => patch({ quotesOn: !settings.quotesOn })}
          />
        </div>
      )}

      {!started && (
        <div className="absolute inset-0 z-[60]">
          <StartOverlay onStart={() => setStarted(true)} />
        </div>
      )}

      {settings.focus && (
        <div className="absolute bottom-4 left-1/2 z-[60] -translate-x-1/2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/60 backdrop-blur">
          Focus mode • press <span className="text-white/80">F</span> to show UI
        </div>
      )}
    </div>
  );
}