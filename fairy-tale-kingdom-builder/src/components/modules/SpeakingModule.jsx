import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../../store/useGameStore";
import { getDayContent, SPEAKING_FALLBACK } from "../../data/content";
import {
  getSpeechRecognition,
  isSpeechSupported,
  similarity,
  scoreConversation,
} from "../../utils/speech";
import { speak, chime } from "../../utils/audio";
import ModuleFrame from "./ModuleFrame";

export default function SpeakingModule() {
  const day = useGameStore((s) => s.day);
  const addMana = useGameStore((s) => s.addMana);
  const addRune = useGameStore((s) => s.addRune);
  const completeModule = useGameStore((s) => s.completeModule);
  const content = useMemo(() => getDayContent(day), [day]);
  const isConv = content.speakingMode === "conversation";
  const items = content.speaking;

  const [round, setRound] = useState(0);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null); // 'win' | 'retry'
  const [fallback, setFallback] = useState(!isSpeechSupported());
  const recRef = useRef(null);

  const current = items[round];
  const prompt = isConv ? current.question : current;

  const advance = (reward) => {
    addMana(reward);
    if (isConv) addRune(1);
    setResult("win");
    setTimeout(() => {
      if (round + 1 >= items.length) completeModule("speaking");
      else {
        setRound((r) => r + 1);
        setTranscript("");
        setResult(null);
      }
    }, 1100);
  };

  const startListening = () => {
    const rec = getSpeechRecognition();
    if (!rec) {
      setFallback(true);
      return;
    }
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setTranscript("");
    setResult(null);
    setListening(true);
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      evaluate(text);
    };
    rec.onerror = (e) => {
      setListening(false);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setFallback(true);
      }
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
    } catch {
      setFallback(true);
    }
  };

  const evaluate = (text) => {
    if (isConv) {
      const { ok } = scoreConversation(text, current.keywords);
      if (ok) {
        chime(true);
        advance(8);
      } else {
        chime(false);
        setResult("retry");
      }
    } else {
      const sim = similarity(text, current);
      if (sim >= 0.55) {
        chime(true);
        advance(6);
      } else {
        chime(false);
        setResult("retry");
      }
    }
  };

  const pickFallback = (phrase) => {
    setTranscript(phrase);
    // In fallback we accept any well-formed selected phrase to keep flow alive.
    chime(true);
    advance(isConv ? 6 : 4);
  };

  useEffect(() => () => recRef.current?.abort?.(), []);

  return (
    <ModuleFrame
      module="speaking"
      title={isConv ? "Chat with the Bluebird" : "Say the Magic Words"}
      subtitle={
        isConv
          ? "Answer the question out loud in a full sentence."
          : "Read the sentence aloud clearly."
      }
      progress={(round / items.length) * 100}
    >
      <div className="text-center">
        <div className="text-5xl mb-2 animate-floaty">
          {listening ? "🐦‍🔥" : "🐦"}
        </div>

        <div className="mx-auto max-w-xl rounded-2xl bg-white/70 border border-white/70 px-5 py-4 mb-4">
          {isConv && (
            <button
              onClick={() => speak(prompt, { voiceHint: "female" })}
              className="text-xs pill bg-fairy-sky/70 mb-2"
            >
              🔊 Hear the question
            </button>
          )}
          <p className="font-display text-lg font-bold text-fairy-ink">
            {isConv ? prompt : `“${prompt}”`}
          </p>
        </div>

        {!fallback ? (
          <>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={startListening}
              disabled={listening}
              className={`fairy-btn fairy-btn-primary !px-6 !py-4 text-lg ${
                listening ? "animate-pulse" : ""
              }`}
            >
              {listening ? "🎙️ Listening…" : "🎤 Activate Magic Mic"}
            </motion.button>
            <button
              onClick={() => setFallback(true)}
              className="block mx-auto mt-2 text-xs text-fairy-ink/50 underline"
            >
              Mic not working? Use word bubbles
            </button>
          </>
        ) : (
          <div>
            <p className="text-sm font-bold text-fairy-ink/70 mb-2">
              ✨ Pick the best answer:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SPEAKING_FALLBACK.map((p) => (
                <motion.button
                  key={p}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => pickFallback(p)}
                  className="rounded-full bg-white/80 border-2 border-white px-4 py-2 text-sm font-semibold text-fairy-ink shadow"
                >
                  💬 {p}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {transcript && (
          <p className="mt-3 text-sm text-fairy-ink/70">
            You said: <span className="font-bold">“{transcript}”</span>
          </p>
        )}
        {result === "win" && (
          <p className="mt-2 font-display font-bold text-green-600">
            ✨ Wonderful! +reward
          </p>
        )}
        {result === "retry" && (
          <p className="mt-2 font-display font-bold text-fairy-rose">
            Almost! Try saying it again 🌟
          </p>
        )}

        <p className="mt-4 text-sm font-bold text-fairy-ink/70">
          Prompt {Math.min(round + 1, items.length)} of {items.length}
        </p>
      </div>
    </ModuleFrame>
  );
}
