import { levelBand } from "../data/lessons.js";

const TONES = {
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  rose: "bg-rose-100 text-rose-700",
  violet: "bg-violet-100 text-violet-700",
};

export default function LevelBadge({ level, showDots = false }) {
  const band = levelBand(level);
  return (
    <span className={`chip ${TONES[band.tone]}`}>
      {showDots && (
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i < level ? "bg-current" : "bg-current/25"
              }`}
            />
          ))}
        </span>
      )}
      Level {level} · {band.label}
    </span>
  );
}
