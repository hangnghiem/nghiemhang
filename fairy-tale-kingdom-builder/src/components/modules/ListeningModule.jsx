import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { getDayContent } from "../../data/content";
import { speak, WhisperNoise, chime, stopSpeaking } from "../../utils/audio";
import ModuleFrame from "./ModuleFrame";

export default function ListeningModule() {
  const day = useGameStore((s) => s.day);
  const addMana = useGameStore((s) => s.addMana);
  const completeModule = useGameStore((s) => s.completeModule);
  const content = useMemo(() => getDayContent(day), [day]);
  const rounds = content.listening;

  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [solved, setSolved] = useState(false);
  const whisper = useRef(null);

  useEffect(() => {
    whisper.current = new WhisperNoise();
    return () => {
      whisper.current?.stop();
      stopSpeaking();
    };
  }, []);

  const current = rounds[round];

  const play = async () => {
    whisper.current?.start(content.whisperLevel);
    whisper.current?.setLevel(content.whisperLevel);
    await speak(current.audio, { voiceHint: "female" });
  };

  const choose = (opt) => {
    if (solved) return;
    setPicked(opt.id);
    if (opt.id === current.answer) {
      setSolved(true);
      chime(true);
      addMana(5);
      setTimeout(() => {
        if (round + 1 >= rounds.length) {
          completeModule("listening");
        } else {
          setRound((r) => r + 1);
          setPicked(null);
          setSolved(false);
        }
      }, 900);
    } else {
      chime(false);
    }
  };

  return (
    <ModuleFrame
      module="listening"
      title={content.listeningMode === "match" ? "The Talking Mirror Speaks" : "Whispers of Place"}
      subtitle={
        content.listeningMode === "match"
          ? "Listen, then click the matching item."
          : "Listen for prepositions: under, behind, on top of…"
      }
      progress={(round / rounds.length) * 100}
    >
      <div className="text-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={play}
          className="mx-auto mb-2 grid place-items-center w-28 h-28 rounded-full bg-gradient-to-b from-fairy-lilac to-fairy-sky shadow-glow text-5xl animate-floaty"
          title="Tap the magic mirror to listen"
        >
          🪞
        </motion.button>
        <p className="text-sm text-fairy-ink/60 mb-1">
          Tap the mirror to hear the clue {content.whisperLevel > 1 && "🔊 (whispers rising…)"}
        </p>
        {current.scene && <div className="text-3xl mb-2">{current.scene}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {current.options.map((opt) => {
            const isRight = solved && opt.id === current.answer;
            const isWrong = picked === opt.id && opt.id !== current.answer;
            return (
              <motion.button
                key={opt.id}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => choose(opt)}
                className={`rounded-2xl py-5 border-2 bg-white/70 ${
                  isRight
                    ? "border-fairy-mint shadow-glow"
                    : isWrong
                    ? "border-red-300 opacity-60"
                    : "border-white/70"
                }`}
              >
                <div className="text-4xl">{opt.emoji}</div>
                <div className="text-xs font-bold text-fairy-ink/70 mt-1">
                  {opt.label}
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="mt-4 text-sm font-bold text-fairy-ink/70">
          Round {Math.min(round + 1, rounds.length)} of {rounds.length}
        </p>
      </div>
    </ModuleFrame>
  );
}
