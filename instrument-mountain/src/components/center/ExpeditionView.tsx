"use client";

import { useState } from "react";
import { useGame, type EventReward } from "@/store/GameProvider";
import type { QuizQuestion, ExpeditionNode, Expedition } from "@/lib/types";
import { pickQuestion } from "@/lib/questions";
import { RESOURCE_GLYPH, RESOURCE_LABEL } from "@/lib/game";
import { RESIDENT_BY_KEY } from "@/lib/villages";
import { INSTRUMENT_BY_ID } from "@/lib/instruments";
import type { ResourceKey, ResidentKey } from "@/lib/types";
import { Button, Card } from "../ui";
import { Quiz } from "./Quiz";

export function ExpeditionView() {
  const {
    state,
    chooseRoute,
    resolveEvent,
    nextNode,
    finishExpedition,
    abandonExpedition,
  } = useGame();

  const exp = state?.expedition ?? null;
  const route = exp?.routes.find((r) => r.id === exp.chosenRouteId) ?? null;

  if (!exp) return null;

  // ---- ルート選択画面 ----
  if (!route) {
    return (
      <Card className="p-6 animate-pop">
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🧭</div>
          <h2 className="text-xl font-bold">登山ルートを選択</h2>
          <p className="text-sm text-white/60 mt-1">
            {exp.areaName}・分岐が発生した。進む道を選ぼう。
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {exp.routes.map((r) => (
            <button
              key={r.id}
              onClick={() => chooseRoute(r.id)}
              className="text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-sky-400/50 p-5 transition-all"
            >
              <div className="text-3xl mb-2">{r.glyph}</div>
              <div className="font-semibold">{r.name}</div>
              <p className="text-xs text-white/60 mt-1">{r.description}</p>
              <div className="flex gap-1 mt-3">
                {r.nodes.map((n) => (
                  <span key={n.id} className="text-sm opacity-70">
                    {n.glyph}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4" onClick={abandonExpedition}>
          村へ引き返す
        </Button>
      </Card>
    );
  }

  const idx = exp.currentNodeIndex;
  const node = route.nodes[idx];

  return (
    <div>
      {/* 進行トレイル */}
      <Card className="p-3 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/70">
            {route.glyph} {route.name}
          </span>
          <button
            className="text-xs text-white/40 hover:text-white/70"
            onClick={() => {
              if (confirm("登山を中断して村へ戻りますか？（獲得済みの資源は保持されます）"))
                abandonExpedition();
            }}
          >
            中断
          </button>
        </div>
        <div className="flex items-center gap-1">
          {route.nodes.map((n, i) => (
            <div key={n.id} className="flex items-center flex-1 last:flex-none">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm shrink-0 border ${
                  i === idx
                    ? "bg-sky-500 border-sky-300 text-slate-950 scale-110"
                    : n.resolved
                      ? "bg-emerald-500/20 border-emerald-400/40"
                      : "bg-white/5 border-white/10 opacity-60"
                }`}
                title={n.label}
              >
                {n.glyph}
              </div>
              {i < route.nodes.length - 1 && (
                <div
                  className={`h-0.5 flex-1 ${
                    n.resolved ? "bg-emerald-400/40" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 現在のノード（ノードが変わると key により再マウントされローカル状態がリセットされる） */}
      <Card className="p-6">
        <ActiveNode
          key={`${route.id}:${idx}`}
          node={node}
          exp={exp}
          answeredIds={state?.answeredQuestionIds ?? []}
          onResolveEvent={resolveEvent}
          onNext={nextNode}
          onFinish={finishExpedition}
        />
      </Card>
    </div>
  );
}

function ActiveNode({
  node,
  exp,
  answeredIds,
  onResolveEvent,
  onNext,
  onFinish,
}: {
  node: ExpeditionNode;
  exp: Expedition;
  answeredIds: string[];
  onResolveEvent: () => EventReward;
  onNext: () => void;
  onFinish: () => void;
}) {
  // クイズノードの問題はマウント時に一度だけ選ぶ
  const [question] = useState<QuizQuestion | null>(() =>
    node.type === "quiz" ? pickQuestion(answeredIds) : null,
  );
  const [reward, setReward] = useState<EventReward | null>(null);

  if (node.type === "quiz" && question) {
    return <Quiz question={question} onContinue={onNext} />;
  }

  if (["resource", "resident", "treasure", "special"].includes(node.type)) {
    return (
      <EventCard
        node={node}
        reward={reward}
        onResolve={() => setReward(onResolveEvent())}
        onContinue={onNext}
      />
    );
  }

  if (node.type === "summit") {
    return <SummitCard exp={exp} onFinish={onFinish} />;
  }

  return null;
}

function EventCard({
  node,
  reward,
  onResolve,
  onContinue,
}: {
  node: ExpeditionNode;
  reward: EventReward | null;
  onResolve: () => void;
  onContinue: () => void;
}) {
  const intro: Record<string, { title: string; desc: string; cta: string }> = {
    resource: {
      title: "資源ポイント",
      desc: "あたりに使えそうな資源が落ちている。",
      cta: "資源を集める",
    },
    resident: {
      title: "迷子の音楽家",
      desc: "道に迷った音楽家がいるようだ。声をかけてみよう。",
      cta: "声をかける",
    },
    treasure: {
      title: "宝箱を発見",
      desc: "古びた宝箱が置かれている。開けてみよう。",
      cta: "宝箱を開ける",
    },
    special: {
      title: "特殊イベント",
      desc: "なにやら賑やかな気配がする…！",
      cta: "近づいてみる",
    },
  };
  const info = intro[node.type];

  return (
    <div className="text-center animate-pop">
      <div className="text-6xl mb-3 animate-float">{node.glyph}</div>
      {!reward ? (
        <>
          <h2 className="text-xl font-bold">{info.title}</h2>
          <p className="text-sm text-white/60 mt-1 mb-6">{info.desc}</p>
          <Button onClick={onResolve}>{info.cta}</Button>
        </>
      ) : (
        <div className="animate-pop">
          <h2 className="text-xl font-bold text-emerald-200">{reward.title}</h2>
          <p className="text-sm text-white/85 mt-2 mb-6 leading-relaxed">{reward.detail}</p>
          <Button onClick={onContinue}>次へ進む →</Button>
        </div>
      )}
    </div>
  );
}

function SummitCard({
  exp,
  onFinish,
}: {
  exp: Expedition;
  onFinish: () => void;
}) {
  const res = exp.loot.resources;
  const resKeys = (Object.keys(res) as ResourceKey[]).filter(
    (k) => (res[k] ?? 0) > 0,
  );
  const residentKeys = (Object.keys(exp.loot.residents) as ResidentKey[]).filter(
    (k) => (exp.loot.residents[k] ?? 0) > 0,
  );

  return (
    <div className="text-center animate-pop">
      <div className="text-6xl mb-2 animate-float">🏔️</div>
      <h2 className="text-2xl font-bold">山頂に到達！</h2>
      <p className="text-sm text-white/60 mt-1 mb-5">今回の登山で手に入れたもの</p>

      <div className="grid gap-3 text-left max-w-md mx-auto">
        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-white/50 mb-1.5">📦 資源</div>
          {resKeys.length ? (
            <div className="flex flex-wrap gap-2">
              {resKeys.map((k) => (
                <span key={k} className="text-sm rounded-lg bg-white/10 px-2 py-1">
                  {RESOURCE_GLYPH[k]} {RESOURCE_LABEL[k]} +{res[k]}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-white/40">なし</span>
          )}
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <div className="text-xs text-white/50 mb-1.5">🧑‍🎤 仲間になった音楽家</div>
          {residentKeys.length ? (
            <div className="flex flex-wrap gap-2">
              {residentKeys.map((k) => (
                <span key={k} className="text-sm rounded-lg bg-white/10 px-2 py-1">
                  {RESIDENT_BY_KEY[k].glyph} {RESIDENT_BY_KEY[k].name} ×
                  {exp.loot.residents[k]}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-white/40">なし</span>
          )}
        </div>

        {exp.loot.instruments.length > 0 && (
          <div className="rounded-xl bg-white/5 p-3">
            <div className="text-xs text-white/50 mb-1.5">📖 新たに図鑑登録</div>
            <div className="flex flex-wrap gap-2">
              {exp.loot.instruments.map((id) => (
                <span key={id} className="text-sm rounded-lg bg-violet-400/15 px-2 py-1">
                  {INSTRUMENT_BY_ID[id]?.glyph} {INSTRUMENT_BY_ID[id]?.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button variant="success" className="w-full max-w-md mt-5" onClick={onFinish}>
        🎒 村へ持ち帰る
      </Button>
    </div>
  );
}
