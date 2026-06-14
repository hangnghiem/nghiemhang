"use client";

import { useState } from "react";
import { useGame } from "@/store/GameProvider";
import { hasSave } from "@/lib/storage";
import { Button, Card } from "./ui";

export function StartScreen() {
  const { newGame, loadSaved } = useGame();
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"menu" | "guest" | "register">("menu");
  const saveExists = hasSave();

  return (
    <main className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 animate-pop">
        <div className="text-center">
          <div className="text-7xl mb-2 animate-float">🏔️🎻</div>
          <h1 className="text-3xl font-bold tracking-tight">楽器の山</h1>
          <p className="text-sm text-white/60 mt-1">Instrument Mountain</p>
          <p className="text-sm text-white/70 mt-4 leading-relaxed">
            楽器クイズに正解して資源と仲間を集め、山を登りながら村を建設。
            <br />
            山頂の「オーケストラ都市」完成を目指す開拓ゲーム。
          </p>
        </div>

        {saveExists && mode === "menu" && (
          <div className="mt-6">
            <Button
              className="w-full"
              variant="primary"
              onClick={() => loadSaved()}
            >
              ▶ つづきから（セーブデータを読み込む）
            </Button>
          </div>
        )}

        {mode === "menu" && (
          <div className="mt-4 grid gap-3">
            <Button variant="secondary" onClick={() => setMode("guest")}>
              👤 ゲストプレイ（このブラウザに保存）
            </Button>
            <Button variant="ghost" onClick={() => setMode("register")}>
              ☁️ 会員登録（クラウド保存）
            </Button>
          </div>
        )}

        {mode === "guest" && (
          <div className="mt-6 grid gap-3 animate-pop">
            <label className="text-sm text-white/70">開拓団リーダーの名前</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例）ハンナ"
              className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-sky-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") newGame(name, true);
              }}
            />
            <p className="text-xs text-white/50">
              ゲストデータは LocalStorage に保存されます。
            </p>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => newGame(name, true)}>
                冒険を始める
              </Button>
              <Button variant="ghost" onClick={() => setMode("menu")}>
                戻る
              </Button>
            </div>
          </div>
        )}

        {mode === "register" && (
          <div className="mt-6 grid gap-3 animate-pop">
            <Card className="p-4 bg-amber-400/5 border-amber-400/20">
              <p className="text-sm text-amber-200/90">
                ☁️ クラウド保存（Supabase Auth）は今後のアップデートで提供予定です。
                現在はゲストプレイでお楽しみください。
              </p>
            </Card>
            <Button variant="secondary" onClick={() => setMode("guest")}>
              ゲストで始める
            </Button>
            <Button variant="ghost" onClick={() => setMode("menu")}>
              戻る
            </Button>
          </div>
        )}

        <p className="text-center text-[11px] text-white/40 mt-8">
          基本プレイ無料 / Pay to Win なし
        </p>
      </Card>
    </main>
  );
}
