import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { getDayContent } from "../../data/content";
import { chime } from "../../utils/audio";
import Confetti from "../Confetti";
import ModuleFrame from "./ModuleFrame";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

export default function WritingModule() {
  const day = useGameStore((s) => s.day);
  const content = useMemo(() => getDayContent(day), [day]);
  const isSentence = content.writingMode === "sentence";
  const items = content.writing;

  const addMana = useGameStore((s) => s.addMana);
  const addRune = useGameStore((s) => s.addRune);
  const completeModule = useGameStore((s) => s.completeModule);

  const [round, setRound] = useState(0);
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [confetti, setConfetti] = useState(0);

  const current = items[round];

  const next = () => {
    setText("");
    setFeedback(null);
    if (round + 1 >= items.length) completeModule("writing");
    else setRound((r) => r + 1);
  };

  const win = (mana, rune = 0) => {
    chime(true);
    addMana(mana);
    if (rune) addRune(rune);
    setFeedback({ ok: true, msg: "✨ Magic words accepted!" });
    setConfetti((c) => c + 1);
    setTimeout(next, 1400);
  };

  const check = () => {
    if (isSentence) {
      const t = text.trim();
      const startsUpper = /^[A-Z]/.test(t);
      const endsPunct = /[.!?]$/.test(t);
      const hasWord = new RegExp(`\\b${current.required}\\b`, "i").test(t);
      const longEnough = t.split(/\s+/).filter(Boolean).length >= 5;
      if (startsUpper && endsPunct && hasWord && longEnough) {
        win(10, 1); // a full correct sentence earns a Light Rune
      } else {
        chime(false);
        const tips = [];
        if (!startsUpper) tips.push("start with a capital letter");
        if (!endsPunct) tips.push("end with . ! or ?");
        if (!hasWord) tips.push(`use the word “${current.required}”`);
        if (!longEnough) tips.push("write at least 5 words");
        setFeedback({ ok: false, msg: `Try again: ${tips.join(", ")}.` });
      }
    } else {
      if (text.trim().toLowerCase() === current.answer.toLowerCase()) {
        win(6);
      } else {
        chime(false);
        setFeedback({ ok: false, msg: "Not quite — check the spelling! 🔤" });
      }
    }
  };

  const tapKey = (k) => setText((t) => t + k);
  const backspace = () => setText((t) => t.slice(0, -1));

  return (
    <ModuleFrame
      module="writing"
      title={isSentence ? "Write a Magic Sentence" : "Spell the Magic Word"}
      subtitle={
        isSentence
          ? "Capital letter, punctuation, and the magic word!"
          : "Read the clue and spell the adjective."
      }
      progress={(round / items.length) * 100}
    >
      <Confetti fire={confetti} />
      <div className="max-w-xl mx-auto">
        <div className="rounded-2xl bg-white/70 border border-white/70 px-5 py-4 mb-4 text-center">
          <p className="font-display text-lg font-bold text-fairy-ink">
            {isSentence ? current.prompt : current.hint}
          </p>
          {isSentence && (
            <span className="pill bg-fairy-mint/60 mt-2">
              ⭐ must include: {current.required}
            </span>
          )}
        </div>

        {isSentence ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Type your magical sentence here…"
            className="w-full rounded-2xl border-2 border-white/80 bg-white/80 p-4 font-body text-fairy-ink outline-none focus:border-fairy-rose resize-none"
          />
        ) : (
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type the word…"
            className="w-full text-center rounded-2xl border-2 border-white/80 bg-white/80 p-4 font-display text-2xl tracking-wide text-fairy-ink outline-none focus:border-fairy-rose"
          />
        )}

        <div className="flex justify-between items-center mt-2 text-xs text-fairy-ink/60">
          <span>✍️ {text.length} letters</span>
          <span>
            Item {Math.min(round + 1, items.length)} of {items.length}
          </span>
        </div>

        {/* On-screen keyboard for tablets */}
        <div className="mt-4 space-y-1 select-none">
          {ROWS.map((row) => (
            <div key={row} className="flex justify-center gap-1">
              {row.split("").map((k) => (
                <button
                  key={k}
                  onClick={() => tapKey(isSentence ? k : k.toLowerCase())}
                  className="w-8 h-10 sm:w-9 rounded-lg bg-white/80 border border-white text-fairy-ink font-bold shadow-sm active:scale-90"
                >
                  {k}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <button
              onClick={() => tapKey(" ")}
              className="px-10 h-10 rounded-lg bg-white/80 border border-white text-fairy-ink font-bold shadow-sm active:scale-90"
            >
              space
            </button>
            <button
              onClick={backspace}
              className="px-4 h-10 rounded-lg bg-white/80 border border-white text-fairy-ink font-bold shadow-sm active:scale-90"
            >
              ⌫
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="fairy-btn fairy-btn-primary !px-8"
            onClick={check}
            disabled={!text.trim()}
          >
            Cast Spell ✨
          </button>
        </div>

        {feedback && (
          <p
            className={`mt-3 text-center font-display font-bold ${
              feedback.ok ? "text-green-600" : "text-fairy-rose"
            }`}
          >
            {feedback.msg}
          </p>
        )}
      </div>
    </ModuleFrame>
  );
}
