"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  "Breathe. You’re exactly where you need to be.",
  "Slow progress is still progress.",
  "Small steps, big universe.",
  "Keep it simple. Keep it soft.",
  "Less rush, more flow.",
  "One task. One beat. One calm.",
  "You don’t have to do it all today."
];

type Q = { id: string; text: string; x: number; y: number; r: number };

export default function QuoteFloat() {
  const [items, setItems] = useState<Q[]>([]);
  const pick = useMemo(() => () => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  useEffect(() => {
    const t = setInterval(() => {
      setItems((prev) => {
        const next = prev.slice(-2);
        const id = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
        next.push({
          id,
          text: pick(),
          x: 8 + Math.random() * 70,
          y: 15 + Math.random() * 65,
          r: -8 + Math.random() * 16
        });
        return next;
      });
    }, 7000);

    return () => clearInterval(t);
  }, [pick]);

  useEffect(() => {
    if (items.length === 0) return;
    const id = items[0].id;
    const t = setTimeout(() => {
      setItems((prev) => prev.filter((q) => q.id !== id));
    }, 16000);
    return () => clearTimeout(t);
  }, [items]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {items.map((q) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
            transition={{ duration: 1.2 }}
            className="absolute select-none"
            style={{
              left: `${q.x}vw`,
              top: `${q.y}vh`,
              transform: `rotate(${q.r}deg)`
            }}
          >
            <div
              className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/80
                         shadow-[0_0_40px_rgba(255,255,255,0.06)] backdrop-blur-md"
              style={{
                fontFamily:
                  'ui-rounded, "Comic Sans MS", "Segoe Print", "Bradley Hand", cursive'
              }}
            >
              {q.text}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}