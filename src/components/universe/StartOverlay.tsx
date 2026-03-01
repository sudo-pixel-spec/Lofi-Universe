"use client";

import { motion } from "framer-motion";

export default function StartOverlay({
  onStart
}: {
  onStart: () => void;
}) {
  return (
    <div className="absolute inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_center,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.65)_70%,rgba(0,0,0,0.85)_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        className="relative w-[360px] rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-2xl
                   shadow-[0_0_70px_rgba(120,160,255,0.14)]"
      >
        <div className="text-xs uppercase tracking-widest text-white/60">
          Lofi Universe
        </div>
        <div className="mt-2 text-2xl font-semibold text-white/90">
          Interactive Chill Space
        </div>
        <div className="mt-2 text-sm text-white/70 leading-relaxed">
          Tap to start music + ambience.
          <br />
          Then vibe: switch scenes, toggle day/night, and control rain.
        </div>

        <button
          onClick={onStart}
          className="mt-5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3
                     text-white/90 hover:bg-white/15 transition"
        >
          Enter Universe ✨
        </button>

        <div className="mt-4 text-[11px] text-white/45">
          Tip: Space = play/pause • N = night • Q = quotes • F = focus
        </div>
      </motion.div>
    </div>
  );
}