"use client";

import { useGame } from "@/store/GameProvider";
import { StartScreen } from "@/components/StartScreen";
import { GameShell } from "@/components/GameShell";

export default function Home() {
  const { state, ready } = useGame();

  if (!ready) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-white/60 animate-pop">
          <div className="text-5xl mb-3 animate-float">🏔️</div>
          読み込み中…
        </div>
      </main>
    );
  }

  return state ? <GameShell /> : <StartScreen />;
}
