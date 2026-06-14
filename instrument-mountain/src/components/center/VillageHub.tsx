"use client";

import { useGame } from "@/store/GameProvider";
import {
  nextBuildableVillage,
  RESOURCE_GLYPH,
  RESOURCE_LABEL,
} from "@/lib/game";
import { VILLAGE_BY_ID, AREA_LABEL } from "@/lib/villages";
import { Button, Card, ProgressBar, SectionTitle } from "../ui";

const AREA_GLYPH: Record<string, string> = {
  foothills: "🏕️",
  strings: "🎻",
  winds: "🎺",
  percussion: "🥁",
  ethnic: "🪕",
  orchestra: "🎼",
};

export function VillageHub() {
  const { state, bonuses, population, startExpedition, buildVillage, canBuild } =
    useGame();
  if (!state) return null;

  const current = VILLAGE_BY_ID[state.currentVillageId];
  const next = nextBuildableVillage(state);
  const won = state.builtVillages.includes("orchestra_city");

  // 解放済みエリア（建設前の foothills も含む）
  const areas = state.unlockedAreas.filter((a) => a !== "foothills" || true);

  return (
    <div className="space-y-3">
      {/* 拠点ヘッダー */}
      <Card className="p-6 text-center">
        <div className="text-6xl mb-2 animate-float">{current?.glyph}</div>
        <h2 className="text-2xl font-bold">{current?.name}</h2>
        <p className="text-sm text-white/60 mt-1 max-w-md mx-auto">{current?.theme}</p>
        {won && (
          <div className="mt-4 rounded-xl bg-amber-400/15 border border-amber-400/30 p-3 text-amber-100 text-sm">
            🎉 おめでとうございます！山頂に「オーケストラ都市」が完成し、ゲームクリアです！
            引き続き図鑑コンプリートや実績達成に挑戦できます。
          </div>
        )}
      </Card>

      {/* 登山に出発 */}
      <Card className="p-5">
        <SectionTitle icon="⛰️">登山に出発する</SectionTitle>
        <p className="text-xs text-white/50 mb-3">
          エリアを選んで登山開始。クイズに正解して資源と仲間を集めよう。
        </p>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => startExpedition(area)}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sky-400/50 p-3.5 text-left transition-all"
            >
              <span className="text-2xl">{AREA_GLYPH[area]}</span>
              <div className="flex-1">
                <div className="text-sm font-semibold">{AREA_LABEL[area]}</div>
                <div className="text-[11px] text-white/50">登山ルートへ →</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 村建設 */}
      {next ? (
        <Card className="p-5">
          <SectionTitle icon="🏗️">次の村を建設</SectionTitle>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{next.glyph}</span>
            <div>
              <div className="font-semibold">{next.name}</div>
              <div className="text-[11px] text-emerald-200/80">報酬：{next.reward}</div>
            </div>
          </div>

          <div className="space-y-3">
            <Req
              label={`${RESOURCE_GLYPH.wood} ${RESOURCE_LABEL.wood}`}
              have={state.resources.wood}
              need={next.requirements.wood}
              tone="amber"
            />
            <Req
              label={`${RESOURCE_GLYPH.stone} ${RESOURCE_LABEL.stone}`}
              have={state.resources.stone}
              need={next.requirements.stone}
              tone="sky"
            />
            <Req
              label="👥 住民"
              have={population}
              need={next.requirements.population}
              tone="violet"
            />
          </div>

          <Button
            className="w-full mt-5"
            variant="success"
            disabled={!canBuild(next.id)}
            onClick={() => buildVillage(next.id)}
          >
            {canBuild(next.id)
              ? `🏘️ ${next.name} を建設する`
              : "資源・住民が不足しています"}
          </Button>
        </Card>
      ) : (
        <Card className="p-5 text-center text-sm text-white/60">
          🏆 すべての村を建設しました！
        </Card>
      )}

      {/* 住民ボーナス */}
      <Card className="p-5">
        <SectionTitle icon="✨">住民ボーナス</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
          <Bonus label="資源獲得量" value={bonuses.resource} />
          <Bonus label="クイズ報酬" value={bonuses.quizReward} />
          <Bonus label="人気度" value={bonuses.popularity} />
          <Bonus label="全体ボーナス" value={1 + bonuses.overall} />
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center rounded-xl bg-white/5 py-2 text-xs">
            {bonuses.rareEventsUnlocked ? (
              <span className="text-violet-200">✨ レアイベント解放中</span>
            ) : (
              <span className="text-white/40">レアイベント未解放</span>
            )}
          </div>
        </div>
        <p className="text-[11px] text-white/40 mt-3">
          ※ バイオリニストや三味線奏者がいると登山で特殊イベント（音楽祭）が発生します。
        </p>
      </Card>
    </div>
  );
}

function Req({
  label,
  have,
  need,
  tone,
}: {
  label: string;
  have: number;
  need: number;
  tone: "amber" | "sky" | "violet";
}) {
  const ok = have >= need;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-white/70">{label}</span>
        <span className={`tabular-nums ${ok ? "text-emerald-300" : "text-white/60"}`}>
          {Math.min(have, need)}/{need} {ok && "✓"}
        </span>
      </div>
      <ProgressBar value={have} max={need} tone={tone} />
    </div>
  );
}

function Bonus({ label, value }: { label: string; value: number }) {
  const pct = Math.round((value - 1) * 100);
  return (
    <div className="rounded-xl bg-white/5 py-2 px-3 text-center">
      <div className="text-base font-bold tabular-nums text-sky-200">
        +{pct}%
      </div>
      <div className="text-[10px] text-white/50">{label}</div>
    </div>
  );
}
