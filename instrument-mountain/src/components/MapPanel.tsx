"use client";

import { useGame } from "@/store/GameProvider";
import { VILLAGES } from "@/lib/villages";
import { Card, SectionTitle, ProgressBar } from "./ui";

export function MapPanel() {
  const { state } = useGame();
  if (!state) return null;

  const builtCount = state.builtVillages.length;
  const total = VILLAGES.length;

  // 山頂が上に来るよう逆順表示
  const ordered = [...VILLAGES].reverse();

  return (
    <Card className="p-4">
      <SectionTitle icon="🗺️" right={<span className="text-xs text-white/50">{builtCount}/{total}</span>}>
        山マップ
      </SectionTitle>
      <ProgressBar value={builtCount} max={total} tone="emerald" className="mb-4" />

      <div className="relative">
        {ordered.map((v, i) => {
          const built = state.builtVillages.includes(v.id);
          const isCurrent = state.currentVillageId === v.id;
          const idxFromBottom = total - 1 - i;
          const prevBuilt =
            idxFromBottom === 0 || state.builtVillages.includes(VILLAGES[idxFromBottom - 1].id);
          const buildable = !built && prevBuilt;

          return (
            <div key={v.id} className="flex gap-3">
              {/* 縦ライン */}
              <div className="flex flex-col items-center">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-lg shrink-0 border-2 ${
                    isCurrent
                      ? "bg-sky-500 border-sky-300 text-slate-950"
                      : built
                        ? "bg-emerald-500/20 border-emerald-400/50"
                        : buildable
                          ? "bg-amber-400/15 border-amber-400/50"
                          : "bg-white/5 border-white/10 opacity-50"
                  }`}
                >
                  {built || buildable || isCurrent ? v.glyph : "🔒"}
                </div>
                {i < ordered.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 min-h-8 my-1 ${
                      built ? "bg-emerald-400/40" : "bg-white/10"
                    }`}
                  />
                )}
              </div>

              <div className={`pb-4 ${!built && !buildable ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{v.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] rounded-full bg-sky-400/20 text-sky-200 px-1.5 py-0.5">
                      現在地
                    </span>
                  )}
                  {built && !isCurrent && (
                    <span className="text-[10px] rounded-full bg-emerald-400/15 text-emerald-200 px-1.5 py-0.5">
                      建設済
                    </span>
                  )}
                  {buildable && (
                    <span className="text-[10px] rounded-full bg-amber-400/15 text-amber-200 px-1.5 py-0.5">
                      次の目標
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{v.theme}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
