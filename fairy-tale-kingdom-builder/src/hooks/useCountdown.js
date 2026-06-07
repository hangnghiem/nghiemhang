import { useEffect } from "react";
import { useGameStore } from "../store/useGameStore";

// Drives the per-module 10-minute countdown. When time runs out the current
// module locks and the next animates into focus (handled by the store).
export function useCountdown(running = true) {
  const tick = useGameStore((s) => s.tick);
  const secondsLeft = useGameStore((s) => s.secondsLeft);
  const forceAdvance = useGameStore((s) => s.forceAdvance);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => tick(), 1000);
    return () => clearInterval(id);
  }, [running, tick]);

  useEffect(() => {
    if (running && secondsLeft === 0) forceAdvance();
  }, [running, secondsLeft, forceAdvance]);

  return secondsLeft;
}

export function formatTime(s) {
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}
