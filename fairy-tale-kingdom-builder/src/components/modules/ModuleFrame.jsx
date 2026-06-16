import { MODULE_META, useGameStore } from "../../store/useGameStore";

// Shared chrome for every learning module: header, difficulty badge, progress.
export default function ModuleFrame({ module, title, subtitle, progress = 0, children }) {
  const day = useGameStore((s) => s.day);
  const meta = MODULE_META[module];
  return (
    <section className="card">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center w-12 h-12 rounded-2xl text-2xl"
            style={{ background: meta.color }}
          >
            {meta.icon}
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-fairy-ink">
              {title}
            </h2>
            <p className="text-sm text-fairy-ink/60">{subtitle}</p>
          </div>
        </div>
        <span className="pill bg-white/70 text-fairy-ink/70 hidden sm:inline-flex">
          {day >= 4 ? "✦ Advanced" : "✿ Beginner"}
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/60 overflow-hidden my-3">
        <div
          className="h-full bg-gradient-to-r from-fairy-rose to-fairy-lilac transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {children}
    </section>
  );
}
