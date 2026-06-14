"use client";

import { useGame } from "@/store/GameProvider";
import { RESOURCE_GLYPH, RESOURCE_LABEL } from "@/lib/game";
import { VILLAGE_BY_ID } from "@/lib/villages";
import type { ResourceKey } from "@/lib/types";
import { Button } from "./ui";

const BASIC: ResourceKey[] = ["wood", "stone", "food"];
const RARE: ResourceKey[] = ["blueprint", "parts", "score"];

export function Header() {
  const { state, population, reset } = useGame();
  if (!state) return null;
  const village = VILLAGE_BY_ID[state.currentVillageId];

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-3 py-2.5 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 mr-1">
          <span className="text-2xl">🏔️</span>
          <div className="leading-tight">
            <div className="text-sm font-bold">楽器の山</div>
            <div className="text-[11px] text-white/50">{state.playerName}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto flex-wrap">
          {BASIC.map((k) => (
            <ResChip key={k} k={k} value={state.resources[k]} />
          ))}
          <span className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />
          {RARE.map((k) => (
            <ResChip key={k} k={k} value={state.resources[k]} subtle />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm"
            title="人口"
          >
            <span>👥</span>
            <span className="tabular-nums font-semibold">{population}</span>
          </div>
          <div
            className="hidden md:flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-sm"
            title="現在の拠点"
          >
            <span>{village?.glyph}</span>
            <span className="text-white/80">{village?.name}</span>
          </div>
          <Button
            variant="ghost"
            className="!px-2 !py-1.5 text-xs"
            title="最初からやり直す"
            onClick={() => {
              if (confirm("本当に最初からやり直しますか？セーブデータは消去されます。"))
                reset();
            }}
          >
            🗑️
          </Button>
        </div>
      </div>
    </header>
  );
}

function ResChip({
  k,
  value,
  subtle = false,
}: {
  k: ResourceKey;
  value: number;
  subtle?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-sm border ${
        subtle
          ? "bg-amber-400/5 border-amber-400/15 text-amber-100/90"
          : "bg-white/5 border-white/10"
      }`}
      title={`${RESOURCE_LABEL[k]}`}
    >
      <span>{RESOURCE_GLYPH[k]}</span>
      <span className="tabular-nums font-semibold">{value}</span>
    </div>
  );
}
