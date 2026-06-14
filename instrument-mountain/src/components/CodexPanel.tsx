"use client";

import { useState } from "react";
import { useGame } from "@/store/GameProvider";
import { INSTRUMENTS, CATEGORY_LABEL } from "@/lib/instruments";
import { RESIDENTS } from "@/lib/villages";
import type { InstrumentCategory } from "@/lib/types";
import { Card, ProgressBar, SectionTitle, Pill } from "./ui";

type Tab = "codex" | "residents" | "achievements";

export function CodexPanel() {
  const [tab, setTab] = useState<Tab>("codex");

  return (
    <Card className="p-4">
      <div className="flex gap-1 mb-4 rounded-xl bg-white/5 p-1 text-xs">
        <TabBtn active={tab === "codex"} onClick={() => setTab("codex")}>
          📖 図鑑
        </TabBtn>
        <TabBtn active={tab === "residents"} onClick={() => setTab("residents")}>
          🧑‍🎤 住民
        </TabBtn>
        <TabBtn active={tab === "achievements"} onClick={() => setTab("achievements")}>
          🏆 実績
        </TabBtn>
      </div>

      {tab === "codex" && <Encyclopedia />}
      {tab === "residents" && <ResidentsList />}
      {tab === "achievements" && <Achievements />}
    </Card>
  );
}

function TabBtn({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg px-2 py-1.5 transition-colors ${
        active ? "bg-white/15 text-white" : "text-white/60 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

const CATEGORIES: InstrumentCategory[] = [
  "strings",
  "winds",
  "percussion",
  "keyboard",
  "ethnic",
];

function Encyclopedia() {
  const { state } = useGame();
  if (!state) return null;
  const discovered = new Set(state.discoveredInstruments);
  const total = INSTRUMENTS.length;
  const found = discovered.size;
  const pct = Math.round((found / total) * 100);

  return (
    <div>
      <SectionTitle icon="📖" right={<span className="text-xs text-white/60">{found}/{total}</span>}>
        楽器図鑑
      </SectionTitle>
      <div className="flex items-center gap-2 mb-4">
        <ProgressBar value={found} max={total} tone="violet" />
        <span className="text-xs font-semibold text-violet-200 tabular-nums">{pct}%</span>
      </div>

      <div className="max-h-[42vh] lg:max-h-[55vh] overflow-y-auto thin-scroll pr-1 space-y-4">
        {CATEGORIES.map((cat) => {
          const items = INSTRUMENTS.filter((i) => i.category === cat);
          return (
            <div key={cat}>
              <div className="text-[11px] uppercase tracking-wider text-white/40 mb-1.5">
                {CATEGORY_LABEL[cat]}
              </div>
              <div className="grid gap-1.5">
                {items.map((inst) => {
                  const got = discovered.has(inst.id);
                  return (
                    <div
                      key={inst.id}
                      className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                        got ? "bg-white/5" : "bg-white/[0.02] text-white/40"
                      }`}
                      title={got ? inst.fact : "未発見"}
                    >
                      <span className={got ? "" : "grayscale opacity-50"}>{inst.glyph}</span>
                      <span className="flex-1 truncate">{got ? inst.name : "？？？"}</span>
                      <span>{got ? "✓" : "□"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResidentsList() {
  const { state, population } = useGame();
  if (!state) return null;
  return (
    <div>
      <SectionTitle icon="🧑‍🎤" right={<span className="text-xs text-white/60">計 {population}人</span>}>
        住民一覧
      </SectionTitle>
      <div className="max-h-[46vh] lg:max-h-[58vh] overflow-y-auto thin-scroll pr-1 space-y-1.5">
        {RESIDENTS.map((r) => {
          const count = state.residents[r.key];
          return (
            <div
              key={r.key}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
                count > 0 ? "bg-white/5" : "bg-white/[0.02] text-white/40"
              }`}
            >
              <span className="text-lg">{r.glyph}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-[11px] text-white/50">{r.effect}</div>
              </div>
              <span className="tabular-nums text-sm font-semibold">×{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Achievements() {
  const { state, population } = useGame();
  if (!state) return null;
  const discovered = state.discoveredInstruments.length;

  const list = [
    {
      icon: "🎓",
      name: "クイズ初級者",
      desc: "クイズに10問正解する",
      done: state.stats.correct >= 10,
      progress: `${Math.min(state.stats.correct, 10)}/10`,
    },
    {
      icon: "🧠",
      name: "クイズ達人",
      desc: "クイズに50問正解する",
      done: state.stats.correct >= 50,
      progress: `${Math.min(state.stats.correct, 50)}/50`,
    },
    {
      icon: "⛰️",
      name: "登山家",
      desc: "登山を5回完了する",
      done: state.stats.expeditionsCompleted >= 5,
      progress: `${Math.min(state.stats.expeditionsCompleted, 5)}/5`,
    },
    {
      icon: "🏘️",
      name: "開拓者",
      desc: "村を3つ建設する",
      done: state.builtVillages.length >= 3,
      progress: `${Math.min(state.builtVillages.length, 3)}/3`,
    },
    {
      icon: "📚",
      name: "コレクター",
      desc: "楽器を20種発見する",
      done: discovered >= 20,
      progress: `${Math.min(discovered, 20)}/20`,
    },
    {
      icon: "👑",
      name: "大都市の主",
      desc: "人口100人に到達する",
      done: population >= 100,
      progress: `${Math.min(population, 100)}/100`,
    },
    {
      icon: "🏙️",
      name: "オーケストラ都市",
      desc: "山頂都市を建設する",
      done: state.builtVillages.includes("orchestra_city"),
      progress: state.builtVillages.includes("orchestra_city") ? "達成" : "未達成",
    },
  ];
  const unlocked = list.filter((a) => a.done).length;

  return (
    <div>
      <SectionTitle icon="🏆" right={<span className="text-xs text-white/60">{unlocked}/{list.length}</span>}>
        実績
      </SectionTitle>
      <div className="grid grid-cols-3 gap-2 mb-4 text-center">
        <Stat label="正解数" value={state.stats.correct} />
        <Stat label="登山回数" value={state.stats.expeditionsCompleted} />
        <Stat label="建設数" value={state.builtVillages.length - 1 < 0 ? 0 : state.builtVillages.length} />
      </div>
      <div className="space-y-1.5 max-h-[40vh] lg:max-h-[48vh] overflow-y-auto thin-scroll pr-1">
        {list.map((a) => (
          <div
            key={a.name}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
              a.done ? "bg-emerald-400/10 border border-emerald-400/20" : "bg-white/[0.02]"
            }`}
          >
            <span className={`text-lg ${a.done ? "" : "grayscale opacity-50"}`}>{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{a.name}</div>
              <div className="text-[11px] text-white/50">{a.desc}</div>
            </div>
            <Pill className={a.done ? "bg-emerald-400/20 text-emerald-200" : "bg-white/10 text-white/60"}>
              {a.done ? "達成" : a.progress}
            </Pill>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-white/40 mt-3">
        ※ 図鑑コンプリート率: {Math.round((discovered / INSTRUMENTS.length) * 100)}%
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-white/5 py-2">
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-white/50">{label}</div>
    </div>
  );
}
