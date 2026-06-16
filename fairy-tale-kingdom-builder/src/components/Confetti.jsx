import { useEffect, useState } from "react";

const COLORS = ["#ff9ec7", "#c9b6ff", "#bfe3ff", "#ffd76a", "#bff0d8", "#ffffff"];

// Lightweight CSS confetti explosion. Render when `fire` flips true.
export default function Confetti({ fire, count = 80 }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!fire) return;
    const next = Array.from({ length: count }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.6 + Math.random() * 1.4,
      color: COLORS[i % COLORS.length],
      size: 8 + Math.random() * 10,
      rotate: Math.random() * 360,
    }));
    setPieces(next);
    const t = setTimeout(() => setPieces([]), 3200);
    return () => clearTimeout(t);
  }, [fire, count]);

  if (!pieces.length) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: "-5vh",
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
            borderRadius: 2,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  );
}
