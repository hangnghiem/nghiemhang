import { useMemo, useState } from "react";

const LETTERS = ["A", "B", "C", "D", "E"];

export default function Quiz({ items, onComplete }) {
  // selected[i] = chosen option index (or undefined)
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(selected).length;
  const allAnswered = answeredCount === items.length;

  const score = useMemo(
    () =>
      items.reduce(
        (acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0),
        0
      ),
    [items, selected]
  );

  function choose(qi, oi) {
    if (submitted) return;
    setSelected((s) => ({ ...s, [qi]: oi }));
  }

  function submit() {
    if (!allAnswered) return;
    setSubmitted(true);
    const finalScore = items.reduce(
      (acc, q, i) => acc + (selected[i] === q.answer ? 1 : 0),
      0
    );
    if (finalScore === items.length) onComplete?.();
  }

  function reset() {
    setSelected({});
    setSubmitted(false);
  }

  const pct = Math.round((score / items.length) * 100);

  return (
    <div className="space-y-5">
      {items.map((q, qi) => {
        const picked = selected[qi];
        return (
          <div
            key={qi}
            className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5 sm:p-6"
          >
            <p className="font-display font-semibold text-ink">
              <span className="mr-2 text-brand-500">Q{qi + 1}.</span>
              {q.question}
            </p>
            <div className="mt-4 grid gap-2.5">
              {q.options.map((opt, oi) => {
                const isPicked = picked === oi;
                const isCorrect = oi === q.answer;
                let state =
                  "border-black/10 bg-white hover:border-brand-300 hover:bg-brand-50";
                if (submitted) {
                  if (isCorrect)
                    state = "border-emerald-400 bg-emerald-50 text-emerald-800";
                  else if (isPicked)
                    state = "border-rose-300 bg-rose-50 text-rose-700";
                  else state = "border-black/10 bg-white text-slate-500";
                } else if (isPicked) {
                  state = "border-brand-400 bg-brand-50 text-brand-800";
                }
                return (
                  <button
                    key={oi}
                    onClick={() => choose(qi, oi)}
                    disabled={submitted}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${state} ${
                      submitted ? "cursor-default" : ""
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                        isPicked && !submitted
                          ? "bg-brand-500 text-white"
                          : submitted && isCorrect
                          ? "bg-emerald-500 text-white"
                          : submitted && isPicked
                          ? "bg-rose-400 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {submitted && isCorrect
                        ? "✓"
                        : submitted && isPicked
                        ? "✕"
                        : LETTERS[oi]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            {answeredCount}/{items.length} answered
          </p>
          <button
            onClick={submit}
            disabled={!allAnswered}
            className="btn-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check answers
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center gap-2 rounded-2xl p-6 text-center text-white ${
            pct === 100
              ? "bg-emerald-500"
              : pct >= 50
              ? "bg-brand-500"
              : "bg-coral-500"
          }`}
        >
          <p className="font-display text-3xl font-extrabold">
            {score} / {items.length}
          </p>
          <p className="text-white/90">
            {pct === 100
              ? "Perfect score! You really understood the article. 🎉"
              : pct >= 50
              ? "Nice work! Review the highlighted answers and try again."
              : "Keep going — reread the article and give it another try."}
          </p>
          <button
            onClick={reset}
            className="btn mt-2 bg-white/20 px-5 py-2 text-white hover:bg-white/30"
          >
            ↻ Try again
          </button>
        </div>
      )}
    </div>
  );
}
