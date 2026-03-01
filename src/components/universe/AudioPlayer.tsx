"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { clamp } from "@/lib/clamp";

export default function AudioPlayer({
  lofiUrl,
  ambientUrl,
  musicOn,
  ambientOn,
  musicVol,
  ambientVol
}: {
  lofiUrl: string;
  ambientUrl?: string;
  musicOn: boolean;
  ambientOn: boolean;
  musicVol: number;
  ambientVol: number;
}) {
  const musicRef = useRef<Howl | null>(null);
  const ambRef = useRef<Howl | null>(null);

  useEffect(() => {
    musicRef.current?.unload();
    musicRef.current = new Howl({
      src: [lofiUrl],
      html5: true,
      loop: true,
      volume: clamp(musicVol, 0, 1)
    });
    if (musicOn) musicRef.current.play();
    return () => {
      musicRef.current?.unload();
      musicRef.current = null;
    };
  }, [lofiUrl]);

  useEffect(() => {
    ambRef.current?.unload();
    if (!ambientUrl) return;

    ambRef.current = new Howl({
      src: [ambientUrl],
      html5: true,
      loop: true,
      volume: clamp(ambientVol, 0, 1)
    });
    if (ambientOn) ambRef.current.play();

    return () => {
      ambRef.current?.unload();
      ambRef.current = null;
    };
  }, [ambientUrl]);

  useEffect(() => {
    const m = musicRef.current;
    if (!m) return;
    m.volume(clamp(musicVol, 0, 1));
    if (musicOn) {
      if (!m.playing()) m.play();
    } else {
      m.pause();
    }
  }, [musicOn, musicVol]);

  useEffect(() => {
    const a = ambRef.current;
    if (!a) return;
    a.volume(clamp(ambientVol, 0, 1));
    if (ambientOn) {
      if (!a.playing()) a.play();
    } else {
      a.pause();
    }
  }, [ambientOn, ambientVol]);

  return null;
}