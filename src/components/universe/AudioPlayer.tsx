"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { clamp } from "@/lib/clamp";

type Props = {
  lofiUrl: string;
  ambientUrl?: string;

  rainUrl?: string;
  rainIntensity?: number;

  musicOn: boolean;
  ambientOn: boolean;

  musicVol: number;
  ambientVol: number;

  rainMaxVol?: number;

  fadeMs?: number;
};

function safeStopUnload(h: Howl | null | undefined) {
  try {
    h?.stop();
    h?.unload();
  } catch {}
}

function fadeOutThenUnload(h: Howl, fadeMs: number) {
  try {
    const cur = h.volume();
    if (h.playing() && cur > 0.001) {
      h.fade(cur, 0, fadeMs);
      window.setTimeout(() => safeStopUnload(h), fadeMs + 80);
    } else {
      safeStopUnload(h);
    }
  } catch {
    safeStopUnload(h);
  }
}

export default function AudioPlayer({
  lofiUrl,
  ambientUrl,

  rainUrl,
  rainIntensity = 0,

  musicOn,
  ambientOn,

  musicVol,
  ambientVol,

  rainMaxVol = 0.75,
  fadeMs = 1100
}: Props) {
  const musicRef = useRef<Howl | null>(null);
  const ambRef = useRef<Howl | null>(null);
  const rainRef = useRef<Howl | null>(null);

  const lastMusicUrl = useRef<string | null>(null);
  const lastAmbUrl = useRef<string | null>(null);
  const lastRainUrl = useRef<string | null>(null);

  useEffect(() => {
    const nextUrl = lofiUrl;
    const prevUrl = lastMusicUrl.current;

    if (!musicRef.current) {
      const h = new Howl({
        src: [nextUrl],
        html5: true,
        loop: true,
        volume: 0
      });
      musicRef.current = h;
      lastMusicUrl.current = nextUrl;

      if (musicOn) {
        h.play();
        h.fade(0, clamp(musicVol, 0, 1), fadeMs);
      }
      return;
    }

    if (prevUrl === nextUrl) return;

    const old = musicRef.current;

    const next = new Howl({
      src: [nextUrl],
      html5: true,
      loop: true,
      volume: 0
    });

    if (musicOn) {
      next.play();
      next.fade(0, clamp(musicVol, 0, 1), fadeMs);
    }

    fadeOutThenUnload(old, fadeMs);

    musicRef.current = next;
    lastMusicUrl.current = nextUrl;
  }, [lofiUrl]);

  useEffect(() => {
    const nextUrl = ambientUrl ?? "";
    const prevUrl = lastAmbUrl.current ?? "";

    if (!ambientUrl) {
      if (ambRef.current) {
        fadeOutThenUnload(ambRef.current, fadeMs);
        ambRef.current = null;
      }
      lastAmbUrl.current = "";
      return;
    }

    if (!ambRef.current) {
      const h = new Howl({
        src: [nextUrl],
        html5: true,
        loop: true,
        volume: 0
      });
      ambRef.current = h;
      lastAmbUrl.current = nextUrl;

      if (ambientOn) {
        h.play();
        h.fade(0, clamp(ambientVol, 0, 1), fadeMs);
      }
      return;
    }

    if (prevUrl === nextUrl) return;

    const old = ambRef.current;

    const next = new Howl({
      src: [nextUrl],
      html5: true,
      loop: true,
      volume: 0
    });

    if (ambientOn) {
      next.play();
      next.fade(0, clamp(ambientVol, 0, 1), fadeMs);
    }

    fadeOutThenUnload(old, fadeMs);

    ambRef.current = next;
    lastAmbUrl.current = nextUrl;
  }, [ambientUrl]);

  useEffect(() => {
    const nextUrl = rainUrl ?? "";
    const prevUrl = lastRainUrl.current ?? "";

    if (!rainUrl) {
      if (rainRef.current) {
        fadeOutThenUnload(rainRef.current, fadeMs);
        rainRef.current = null;
      }
      lastRainUrl.current = "";
      return;
    }

    if (!rainRef.current) {
      const h = new Howl({
        src: [nextUrl],
        html5: true,
        loop: true,
        volume: 0
      });
      rainRef.current = h;
      lastRainUrl.current = nextUrl;

      if (ambientOn) h.play();
      return;
    }

    if (prevUrl === nextUrl) return;

    const old = rainRef.current;

    const next = new Howl({
      src: [nextUrl],
      html5: true,
      loop: true,
      volume: 0
    });

    if (ambientOn) next.play();

    fadeOutThenUnload(old, fadeMs);

    rainRef.current = next;
    lastRainUrl.current = nextUrl;
  }, [rainUrl]);

  useEffect(() => {
    const h = musicRef.current;
    if (!h) return;

    const target = clamp(musicVol, 0, 1);

    if (musicOn) {
      if (!h.playing()) h.play();
      const cur = h.volume();
      if (Math.abs(cur - target) > 0.01) h.fade(cur, target, 220);
      else h.volume(target);
    } else {
      const cur = h.volume();
      if (cur > 0.001) h.fade(cur, 0, 260);
      window.setTimeout(() => {
        try {
          h.pause();
        } catch {}
      }, 280);
    }
  }, [musicOn, musicVol]);

  useEffect(() => {
    const h = ambRef.current;
    if (!h) return;

    const target = clamp(ambientVol, 0, 1);

    if (ambientOn) {
      if (!h.playing()) h.play();
      const cur = h.volume();
      if (Math.abs(cur - target) > 0.01) h.fade(cur, target, 220);
      else h.volume(target);
    } else {
      const cur = h.volume();
      if (cur > 0.001) h.fade(cur, 0, 260);
      window.setTimeout(() => {
        try {
          h.pause();
        } catch {}
      }, 280);
    }
  }, [ambientOn, ambientVol]);

  useEffect(() => {
    const h = rainRef.current;
    if (!h) return;

    const shouldPlay = ambientOn && rainIntensity > 0.001;

    const target =
      clamp(ambientVol, 0, 1) *
      clamp(rainMaxVol, 0, 1) *
      clamp(rainIntensity, 0, 1);

    if (shouldPlay) {
      if (!h.playing()) h.play();
      const cur = h.volume();
      h.fade(cur, target, 180);
    } else {
      const cur = h.volume();
      if (cur > 0.001) h.fade(cur, 0, 220);
      window.setTimeout(() => {
        try {
          h.pause();
        } catch {}
      }, 240);
    }
  }, [ambientOn, ambientVol, rainIntensity, rainMaxVol]);

  useEffect(() => {
    return () => {
      safeStopUnload(musicRef.current);
      safeStopUnload(ambRef.current);
      safeStopUnload(rainRef.current);
      musicRef.current = null;
      ambRef.current = null;
      rainRef.current = null;
    };
  }, []);

  return null;
}