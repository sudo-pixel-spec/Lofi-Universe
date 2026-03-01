"use client";

import { ENVIRONMENTS, EnvironmentId } from "@/data/environments";
import { motion } from "framer-motion";

function Slider({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-white"
      />
    </div>
  );
}

function Toggle({
  on,
  label,
  onClick
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 hover:bg-white/10 transition"
    >
      <span>{label}</span>
      <span className={`text-xs ${on ? "text-white" : "text-white/50"}`}>
        {on ? "ON" : "OFF"}
      </span>
    </button>
  );
}

export default function SoftGlowUI(props: {
  envId: EnvironmentId;
  night: boolean;
  rain: number;
  musicOn: boolean;
  ambientOn: boolean;
  musicVol: number;
  ambientVol: number;
  quotesOn: boolean;

  onChangeEnv: (id: EnvironmentId) => void;
  onToggleNight: () => void;
  onRain: (v: number) => void;

  onToggleMusic: () => void;
  onToggleAmbient: () => void;
  onMusicVol: (v: number) => void;
  onAmbientVol: (v: number) => void;

  onToggleQuotes: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-4 top-4 w-[320px] rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-4
                 shadow-[0_0_60px_rgba(120,160,255,0.12)]"
    >
      <div className="mb-3">
        <div className="text-sm text-white/70">Lofi Universe</div>
        <div className="text-lg font-semibold text-white/90">Interactive Chill Space</div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <div className="text-xs text-white/60">Environment</div>
          <div className="grid grid-cols-1 gap-2">
            {ENVIRONMENTS.map((e) => {
              const active = e.id === props.envId;
              return (
                <button
                  key={e.id}
                  onClick={() => props.onChangeEnv(e.id)}
                  className={
                    "rounded-xl border px-3 py-2 text-left transition " +
                    (active
                      ? "border-white/25 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10")
                  }
                >
                  <div className="text-sm text-white/85">{e.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Toggle on={props.night} label="Night Mode" onClick={props.onToggleNight} />
          <Toggle on={props.quotesOn} label="Quotes" onClick={props.onToggleQuotes} />
        </div>

        <Slider label="Rain Intensity" value={props.rain} onChange={props.onRain} />

        <div className="grid grid-cols-2 gap-2">
          <Toggle on={props.musicOn} label="Music" onClick={props.onToggleMusic} />
          <Toggle on={props.ambientOn} label="Ambient" onClick={props.onToggleAmbient} />
        </div>

        <Slider label="Music Volume" value={props.musicVol} onChange={props.onMusicVol} />
        <Slider label="Ambient Volume" value={props.ambientVol} onChange={props.onAmbientVol} />

        <div className="pt-1 text-[11px] text-white/50">
          Tip: click Music ON once if autoplay is blocked.
        </div>
      </div>
    </motion.div>
  );
}