import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { getDayContent } from "../../data/content";
import { chime } from "../../utils/audio";
import ModuleFrame from "./ModuleFrame";

export default function ReadingModule() {
  const day = useGameStore((s) => s.day);
  const content = useMemo(() => getDayContent(day), [day]);
  return content.readingMode === "story" ? (
    <StoryMode data={content.reading} />
  ) : (
    <MapMode data={content.reading} />
  );
}

function StoryMode({ data }) {
  const addMana = useGameStore((s) => s.addMana);
  const completeModule = useGameStore((s) => s.completeModule);
  const [page, setPage] = useState(0);
  const [phase, setPhase] = useState("read"); // read | quiz
  const [q, setQ] = useState(0);
  const [picked, setPicked] = useState(null);

  const lastPage = page >= data.pages.length - 1;
  const question = data.questions[q];

  const answer = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === question.answer) {
      chime(true);
      addMana(5);
      setTimeout(() => {
        if (q + 1 >= data.questions.length) completeModule("reading");
        else {
          setQ((n) => n + 1);
          setPicked(null);
        }
      }, 900);
    } else {
      chime(false);
      setTimeout(() => setPicked(null), 700);
    }
  };

  return (
    <ModuleFrame
      module="reading"
      title="The Enchanted Storybook"
      subtitle="Read every page, then answer the magic questions."
      progress={
        phase === "read"
          ? (page / data.pages.length) * 50
          : 50 + (q / data.questions.length) * 50
      }
    >
      {phase === "read" ? (
        <div className="book-scene">
          <motion.div
            key={page}
            initial={{ rotateY: -40, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-xl rounded-2xl bg-[linear-gradient(135deg,#fffaf3,#fff)] border border-fairy-gold/40 shadow-xl p-6 min-h-[180px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="text-3xl mb-2">📖</div>
            <p className="font-body text-lg leading-relaxed text-fairy-ink">
              {data.pages[page]}
            </p>
            <p className="text-right text-xs text-fairy-ink/40 mt-3">
              Page {page + 1} / {data.pages.length}
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 mt-4">
            <button
              className="fairy-btn"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              ← Back
            </button>
            {!lastPage ? (
              <button
                className="fairy-btn fairy-btn-primary"
                onClick={() => setPage((p) => p + 1)}
              >
                Turn Page →
              </button>
            ) : (
              <button
                className="fairy-btn fairy-btn-primary"
                onClick={() => setPhase("quiz")}
              >
                Answer Questions ✨
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-display text-lg font-bold text-fairy-ink mb-3">
            {question.q}
          </p>
          <div className="grid gap-3 max-w-md mx-auto">
            {question.options.map((opt, i) => {
              const right = picked !== null && i === question.answer;
              const wrong = picked === i && i !== question.answer;
              return (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  onClick={() => answer(i)}
                  className={`rounded-2xl px-4 py-3 border-2 bg-white/70 text-left font-semibold text-fairy-ink ${
                    right
                      ? "border-fairy-mint shadow-glow"
                      : wrong
                      ? "border-red-300 opacity-60"
                      : "border-white/70"
                  }`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </motion.button>
              );
            })}
          </div>
          <p className="mt-4 text-sm font-bold text-fairy-ink/70">
            Question {q + 1} of {data.questions.length}
          </p>
        </div>
      )}
    </ModuleFrame>
  );
}

function MapMode({ data }) {
  const addMana = useGameStore((s) => s.addMana);
  const addRune = useGameStore((s) => s.addRune);
  const completeModule = useGameStore((s) => s.completeModule);
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);

  const current = data.steps[step];

  const choose = (opt) => {
    if (opt.safe) {
      chime(true);
      addMana(5);
      if (step + 1 >= data.steps.length) {
        addRune(1);
        setTimeout(() => completeModule("reading"), 600);
      } else {
        setStep((s) => s + 1);
      }
    } else {
      chime(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <ModuleFrame
      module="reading"
      title="The Secret Safe Path"
      subtitle={data.intro}
      progress={(step / data.steps.length) * 100}
    >
      <motion.div
        animate={shake ? { x: [0, -10, 10, -6, 0] } : {}}
        className="mx-auto max-w-xl rounded-2xl bg-white/70 border border-white/70 p-5 text-center"
      >
        <div className="text-4xl mb-2">🗺️</div>
        <p className="font-display text-lg font-bold text-fairy-ink mb-4">
          {current.clue}
        </p>
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt) => (
            <motion.button
              key={opt.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => choose(opt)}
              className="rounded-2xl py-5 border-2 border-white/70 bg-white/80"
            >
              <div className="text-4xl">{opt.emoji}</div>
              <div className="text-xs font-bold text-fairy-ink/70 mt-1">
                {opt.label}
              </div>
            </motion.button>
          ))}
        </div>
        {shake && (
          <p className="mt-3 text-fairy-rose font-bold">
            👤 A shadow guard! Read the clue again.
          </p>
        )}
        <p className="mt-4 text-sm font-bold text-fairy-ink/70">
          Step {step + 1} of {data.steps.length}
        </p>
      </motion.div>
    </ModuleFrame>
  );
}
