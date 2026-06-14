"use client";

import { useState } from "react";
import { useGame } from "@/store/GameProvider";
import { Header } from "./Header";
import { MapPanel } from "./MapPanel";
import { CodexPanel } from "./CodexPanel";
import { VillageHub } from "./center/VillageHub";
import { ExpeditionView } from "./center/ExpeditionView";

type MobileTab = "map" | "main" | "codex";

export function GameShell() {
  const { state } = useGame();
  const [tab, setTab] = useState<MobileTab>("main");
  if (!state) return null;

  const center = state.expedition ? <ExpeditionView /> : <VillageHub />;

  return (
    <div className="flex-1 flex flex-col">
      <Header />

      <div className="mx-auto w-full max-w-7xl flex-1 px-3 py-4">
        {/* デスクトップ: 3カラム */}
        <div className="hidden lg:grid grid-cols-[300px_minmax(0,1fr)_330px] gap-4 items-start">
          <div className="space-y-4 sticky top-20">
            <MapPanel />
          </div>
          <div>{center}</div>
          <div className="space-y-4 sticky top-20">
            <CodexPanel />
          </div>
        </div>

        {/* モバイル/タブレット: タブ切替 */}
        <div className="lg:hidden">
          {tab === "map" && <MapPanel />}
          {tab === "main" && center}
          {tab === "codex" && <CodexPanel />}
        </div>
      </div>

      {/* モバイル下部ナビ */}
      <nav className="lg:hidden sticky bottom-0 z-30 glass border-t border-white/10">
        <div className="grid grid-cols-3">
          <TabButton active={tab === "map"} onClick={() => setTab("map")} icon="🗺️" label="マップ" />
          <TabButton active={tab === "main"} onClick={() => setTab("main")} icon="⛰️" label="冒険" />
          <TabButton active={tab === "codex"} onClick={() => setTab("codex")} icon="📖" label="図鑑" />
        </div>
      </nav>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
        active ? "text-sky-300" : "text-white/55"
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );
}
