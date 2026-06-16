import { AnimatePresence, motion } from "framer-motion";
import {
  useGameStore,
  MODULE_ORDER,
  MODULE_META,
} from "../store/useGameStore";
import ListeningModule from "./modules/ListeningModule";
import SpeakingModule from "./modules/SpeakingModule";
import ReadingModule from "./modules/ReadingModule";
import WritingModule from "./modules/WritingModule";

const MAP = {
  listening: ListeningModule,
  speaking: SpeakingModule,
  reading: ReadingModule,
  writing: WritingModule,
};

export default function ModuleShell({ onOpenKingdom, onStartRaid }) {
  const activeModule = useGameStore((s) => s.activeModule);
  const completed = useGameStore((s) => s.completed);
  const day = useGameStore((s) => s.day);
  const setActiveModule = useGameStore((s) => s.setActiveModule);
  const allDone = MODULE_ORDER.every((m) => completed[m]);

  const ActiveComp = MAP[activeModule];

  const moduleStatus = (mod) => {
    if (completed[mod]) return "done";
    if (mod === activeModule) return "active";
    const idx = MODULE_ORDER.indexOf(mod);
    const activeIdx = MODULE_ORDER.indexOf(activeModule);
    return idx < activeIdx ? "done" : "locked";
  };

  return (
    <div className="space-y-4">
      {/* Module progress rail */}
      <div className="card !p-3">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
          {MODULE_ORDER.map((mod, i) => {
            const st = moduleStatus(mod);
            const meta = MODULE_META[mod];
            return (
              <div key={mod} className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  disabled={st === "locked"}
                  onClick={() => st !== "locked" && setActiveModule(mod)}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-2 border-2 transition-all ${
                    st === "active"
                      ? "border-fairy-rose bg-white shadow-glow scale-105"
                      : st === "done"
                      ? "border-fairy-mint bg-fairy-mint/40"
                      : "border-white/50 bg-white/30 opacity-60"
                  }`}
                >
                  <span className="text-xl">
                    {st === "locked" ? "🔒" : st === "done" ? "✅" : meta.icon}
                  </span>
                  <span className="font-display font-bold text-sm text-fairy-ink">
                    {meta.label}
                  </span>
                </button>
                {i < MODULE_ORDER.length - 1 && (
                  <span className="text-fairy-ink/30">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Active module / day-complete state */}
      <AnimatePresence mode="wait">
        {!allDone ? (
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.35 }}
          >
            <ActiveComp />
          </motion.div>
        ) : (
          <motion.div
            key="day-done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-10"
          >
            <div className="text-6xl mb-3 animate-floaty">🎉</div>
            <h2 className="font-display text-2xl font-extrabold text-fairy-ink">
              Day {day} Complete!
            </h2>
            <p className="text-fairy-ink/70 mt-1">
              You finished all four magic lessons. Spend your Mana in the kingdom!
            </p>
            <div className="flex flex-wrap gap-3 justify-center mt-5">
              <button className="fairy-btn" onClick={onOpenKingdom}>
                🏰 Build my Kingdom
              </button>
              {day >= 7 ? (
                <button className="fairy-btn fairy-btn-primary" onClick={onStartRaid}>
                  🪞 Enter the Mirror Raid
                </button>
              ) : (
                <NextDayButton />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NextDayButton() {
  const goToNextDay = useGameStore((s) => s.goToNextDay);
  return (
    <button className="fairy-btn fairy-btn-primary" onClick={goToNextDay}>
      🌅 Start Next Day
    </button>
  );
}
