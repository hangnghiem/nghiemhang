import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";

function Counter({ value }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (display === value) return;
    const step = value > display ? 1 : -1;
    const id = setInterval(() => {
      setDisplay((d) => {
        if (d === value) {
          clearInterval(id);
          return d;
        }
        return d + step;
      });
    }, 24);
    return () => clearInterval(id);
  }, [value]); // eslint-disable-line
  return <span>{display}</span>;
}

export default function RuneDock() {
  const mana = useGameStore((s) => s.mana);
  const runes = useGameStore((s) => s.runes);
  const lastReward = useGameStore((s) => s.lastReward);
  const [bursts, setBursts] = useState([]);
  const manaRef = useRef(null);
  const runeRef = useRef(null);

  // Fire a particle burst toward the matching counter whenever a reward lands.
  useEffect(() => {
    if (!lastReward) return;
    const isMana = lastReward.type === "mana";
    const count = Math.min(10, Math.max(4, lastReward.amount));
    const pieces = Array.from({ length: count }).map((_, i) => ({
      id: `${lastReward.at}-${i}`,
      emoji: isMana ? "✨" : "🔮",
      dx: -120 - Math.random() * 220,
      dy: (Math.random() - 0.5) * 160,
      delay: i * 0.03,
    }));
    setBursts((b) => [...b, { key: lastReward.at, isMana, pieces }]);
    const t = setTimeout(
      () => setBursts((b) => b.filter((x) => x.key !== lastReward.at)),
      900
    );
    return () => clearTimeout(t);
  }, [lastReward]);

  return (
    <aside className="relative w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-4 space-y-4">
        <div className="card overflow-visible">
          <h3 className="font-display text-lg font-extrabold text-fairy-ink/90 flex items-center gap-2">
            <span className="animate-sparkle">🌟</span> Light Rune Inventory
          </h3>
          <p className="text-xs text-fairy-ink/60 mb-3">
            Answer correctly to earn rewards!
          </p>

          <div className="relative">
            <div
              ref={manaRef}
              className="relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-fairy-sky/70 to-white/40 px-4 py-3 mb-3 border border-white/70"
            >
              <span className="font-bold text-fairy-ink/80">Mana Points</span>
              <span className="font-display text-2xl font-extrabold text-fairy-ink flex items-center gap-1">
                ✨ <Counter value={mana} />
              </span>
              <ParticleBurst bursts={bursts.filter((b) => b.isMana)} />
            </div>

            <div
              ref={runeRef}
              className="relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-fairy-lilac/60 to-white/40 px-4 py-3 border border-white/70 shadow-rune"
            >
              <span className="font-bold text-fairy-ink/80">Light Runes</span>
              <span className="font-display text-2xl font-extrabold text-fairy-ink flex items-center gap-1">
                🔮 <Counter value={runes} />
              </span>
              <ParticleBurst bursts={bursts.filter((b) => !b.isMana)} />
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="font-display font-bold text-fairy-ink/90 mb-1">
            ⚔️ Rune Power
          </h4>
          <div className="h-3 rounded-full bg-white/60 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-fairy-rose to-fairy-lilac"
              animate={{ width: `${Math.min(100, runes * 8)}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
          <p className="text-xs text-fairy-ink/60 mt-2">
            Collect Light Runes to power up for the Day 7 Mirror Raid!
          </p>
        </div>
      </div>
    </aside>
  );
}

function ParticleBurst({ bursts }) {
  return (
    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
      <AnimatePresence>
        {bursts.map((b) =>
          b.pieces.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                "--dx": `${p.dx}px`,
                "--dy": `${p.dy}px`,
                animation: `rune-fly 0.85s ${p.delay}s ease-out forwards`,
              }}
            >
              {p.emoji}
            </span>
          ))
        )}
      </AnimatePresence>
    </div>
  );
}
