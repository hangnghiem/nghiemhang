import { useGameStore } from "../store/useGameStore";
import { formatTime } from "../hooks/useCountdown";

export default function TopBar({ view, setView, secondsLeft }) {
  const day = useGameStore((s) => s.day);
  const tierName = useGameStore((s) => s.tierName);
  const tier = useGameStore((s) => s.tier);
  const mana = useGameStore((s) => s.mana);
  const runes = useGameStore((s) => s.runes);

  const tabs = [
    { id: "learn", label: "Lessons", icon: "📚" },
    { id: "kingdom", label: "My Kingdom", icon: "🏰" },
  ];

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 py-3 backdrop-blur-xl bg-white/45 border-b border-white/60">
      <div className="mx-auto max-w-7xl flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-2xl animate-floaty">🪄</span>
          <div className="leading-tight">
            <h1 className="font-display font-extrabold text-fairy-ink text-lg sm:text-xl">
              Fairy Tale Kingdom Builder
            </h1>
            <p className="text-[11px] sm:text-xs text-fairy-ink/60">
              Tier {tier} · {tierName} · Day {day} / 7
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="pill bg-fairy-sky/70 text-fairy-ink">✨ {mana}</span>
          <span className="pill bg-fairy-lilac/60 text-fairy-ink">🔮 {runes}</span>
          {view === "learn" && (
            <span className="pill bg-white/70 text-fairy-ink font-mono">
              ⏳ {formatTime(secondsLeft)}
            </span>
          )}
        </div>

        <nav className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`fairy-btn !px-3 !py-2 text-sm ${
                view === t.id ? "fairy-btn-primary" : ""
              }`}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
