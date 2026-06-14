"use client";

import { useState } from "react";
import { useGame, type QuizResult } from "@/store/GameProvider";
import type { QuizQuestion } from "@/lib/types";
import { INSTRUMENT_BY_ID } from "@/lib/instruments";
import { RESOURCE_GLYPH, RESOURCE_LABEL } from "@/lib/game";
import type { ResourceKey } from "@/lib/types";
import { InstrumentVisual } from "../InstrumentVisual";
import { Button } from "../ui";

const TYPE_LABEL: Record<QuizQuestion["type"], string> = {
  image: "🖼️ 画像クイズ",
  silhouette: "🌑 シルエットクイズ",
  knowledge: "💡 知識クイズ",
};

export function Quiz({
  question,
  onContinue,
}: {
  question: QuizQuestion;
  onContinue: () => void;
}) {
  const { answerQuiz } = useGame();
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);

  const inst = question.instrumentId ? INSTRUMENT_BY_ID[question.instrumentId] : null;
  const showVisual = question.type === "image" || question.type === "silhouette";

  const handleSelect = (idx: number) => {
    if (result) return;
    setSelected(idx);
    setResult(answerQuiz(question, idx));
  };

  return (
    <div className="animate-pop">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs rounded-full bg-white/10 px-3 py-1 text-white/80">
          {TYPE_LABEL[question.type]}
        </span>
      </div>

      {showVisual && inst && (
        <div className="mb-4">
          <InstrumentVisual
            glyph={inst.glyph}
            silhouette={question.type === "silhouette"}
            size="lg"
          />
        </div>
      )}

      <h2 className="text-lg font-semibold text-center mb-5">{question.prompt}</h2>

      <div className="grid sm:grid-cols-2 gap-2.5">
        {question.choices.map((choice, idx) => {
          const isAnswer = idx === question.answerIndex;
          const isPicked = idx === selected;
          let cls =
            "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/25";
          if (result) {
            if (isAnswer) cls = "bg-emerald-500/20 border-emerald-400/60";
            else if (isPicked) cls = "bg-rose-500/20 border-rose-400/60";
            else cls = "bg-white/[0.02] border-white/5 opacity-60";
          }
          return (
            <button
              key={idx}
              disabled={!!result}
              onClick={() => handleSelect(idx)}
              className={`text-left rounded-xl border px-4 py-3 text-sm transition-all ${cls} disabled:cursor-default`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/10 text-xs mr-2">
                {"ABCD"[idx]}
              </span>
              {choice}
              {result && isAnswer && <span className="float-right">✓</span>}
              {result && isPicked && !isAnswer && <span className="float-right">✗</span>}
            </button>
          );
        })}
      </div>

      {result && (
        <div className="mt-5 animate-pop">
          <div
            className={`rounded-xl p-4 ${
              result.correct
                ? "bg-emerald-500/15 border border-emerald-400/30"
                : "bg-rose-500/15 border border-rose-400/30"
            }`}
          >
            <div className="font-semibold mb-1">
              {result.correct ? "🎉 正解！" : "😖 不正解…"}
            </div>
            {result.explanation && (
              <p className="text-sm text-white/80 leading-relaxed">{result.explanation}</p>
            )}
            {result.correct && result.reward && (
              <p className="text-sm text-emerald-200 mt-2">
                報酬：
                {(Object.keys(result.reward) as ResourceKey[])
                  .filter((k) => (result.reward?.[k] ?? 0) > 0)
                  .map((k) => `${RESOURCE_GLYPH[k]}${RESOURCE_LABEL[k]}+${result.reward?.[k]}`)
                  .join("  ")}
              </p>
            )}
            {result.discoveredName && (
              <p className="text-sm text-violet-200 mt-1">
                📖 図鑑に「{result.discoveredName}」を登録しました！
              </p>
            )}
          </div>
          <Button className="w-full mt-4" onClick={onContinue}>
            次へ進む →
          </Button>
        </div>
      )}
    </div>
  );
}
