import { useState } from "react";
import { useGameStore, MODULE_ORDER } from "./store/useGameStore";
import { useCountdown } from "./hooks/useCountdown";
import TopBar from "./components/TopBar";
import RuneDock from "./components/RuneDock";
import ModuleShell from "./components/ModuleShell";
import KingdomBuilder from "./components/KingdomBuilder";
import Day7Raid from "./components/Day7Raid";

export default function App() {
  const [view, setView] = useState("learn");
  const raidActive = useGameStore((s) => s.raidActive);
  const startRaid = useGameStore((s) => s.startRaid);
  const endRaid = useGameStore((s) => s.endRaid);
  const completed = useGameStore((s) => s.completed);
  const hardReset = useGameStore((s) => s.hardReset);

  const allDone = MODULE_ORDER.every((m) => completed[m]);
  // Timer only ticks during active lessons (not in kingdom, not when day done).
  const secondsLeft = useCountdown(view === "learn" && !allDone && !raidActive);

  if (raidActive) {
    return <Day7Raid onExit={endRaid} />;
  }

  return (
    <div className="bg-fairy min-h-screen">
      <TopBar view={view} setView={setView} secondsLeft={secondsLeft} />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-5">
        {view === "learn" ? (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <ModuleShell
                onOpenKingdom={() => setView("kingdom")}
                onStartRaid={startRaid}
              />
            </div>
            <RuneDock />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1 min-w-0">
              <KingdomBuilder />
            </div>
            <RuneDock />
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-fairy-ink/50 py-6">
        Fairy Tale Kingdom Builder · A magical English adventure ·{" "}
        <button onClick={hardReset} className="underline">
          Reset progress
        </button>
      </footer>
    </div>
  );
}
