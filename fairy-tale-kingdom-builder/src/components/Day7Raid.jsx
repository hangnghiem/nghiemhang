import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { RAID } from "../data/content";
import { speak, chime, stopSpeaking } from "../utils/audio";
import {
  getSpeechRecognition,
  isSpeechSupported,
  similarity,
} from "../utils/speech";
import Confetti from "./Confetti";

const STAGES = ["listening", "reading", "writing", "speaking"];
const MAX_HP = 100;

export default function Day7Raid({ onExit }) {
  const winRaid = useGameStore((s) => s.winRaid);
  const runes = useGameStore((s) => s.runes);
  const [stage, setStage] = useState(0);
  const [hp, setHp] = useState(MAX_HP);
  const [victory, setVictory] = useState(false);
  const [hit, setHit] = useState(false);

  const damage = (amount) => {
    setHit(true);
    setTimeout(() => setHit(false), 250);
    setHp((h) => Math.max(0, h - amount));
  };

  const nextStage = () => {
    if (stage + 1 >= STAGES.length) {
      setHp(0);
      setVictory(true);
      setTimeout(() => winRaid(), 4200);
    } else {
      setStage((s) => s + 1);
    }
  };

  const StageComp = [Stage1, Stage2, Stage3, Stage4][stage];

  return (
    <div className="bg-raid min-h-screen text-white">
      <Confetti fire={victory ? 1 : 0} count={140} />
      <div className="mx-auto max-w-4xl px-4 py-5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-xl sm:text-2xl font-extrabold text-fairy-blush">
            🪞 Day 7 Raid · Shattering the Talking Mirror
          </h1>
          <span className="pill bg-white/10 text-fairy-blush">🔮 {runes} runes</span>
        </div>

        {/* Mirror + HP */}
        <div className="text-center mb-4">
          <motion.div
            animate={hit ? { x: [0, -12, 12, -6, 0], rotate: [0, -2, 2, 0] } : {}}
            className="mx-auto w-28 h-36 rounded-[45%] grid place-items-center text-6xl"
            style={{
              background:
                "linear-gradient(160deg,#cdbff7,#6f4fb0 60%,#2a1747)",
              boxShadow: "0 0 50px rgba(201,182,255,0.6)",
              filter: victory ? "grayscale(1) blur(1px)" : "none",
              opacity: victory ? 0.3 : 1,
            }}
          >
            {victory ? "💥" : "🪞"}
          </motion.div>
          <div className="mx-auto max-w-md mt-3">
            <div className="flex justify-between text-xs text-fairy-blush/80 mb-1">
              <span>Mirror HP</span>
              <span>{hp}%</span>
            </div>
            <div className="h-4 rounded-full bg-white/10 overflow-hidden border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-fairy-rose to-fairy-gold"
                animate={{ width: `${hp}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
        </div>

        {/* Stage tracker */}
        <div className="flex justify-center gap-2 mb-4">
          {STAGES.map((s, i) => (
            <span
              key={s}
              className={`pill text-xs ${
                i === stage
                  ? "bg-fairy-rose text-white"
                  : i < stage
                  ? "bg-fairy-mint/40 text-white"
                  : "bg-white/10 text-fairy-blush/70"
              }`}
            >
              {i < stage ? "✓" : i + 1} {s}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {victory ? (
            <VictoryCard key="victory" onExit={onExit} />
          ) : (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <StageComp damage={damage} onDone={nextStage} />
            </motion.div>
          )}
        </AnimatePresence>

        {!victory && (
          <div className="text-center mt-4">
            <button
              onClick={onExit}
              className="text-xs text-fairy-blush/50 underline"
            >
              Flee the raid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RaidPanel({ title, children }) {
  return (
    <div className="rounded-3xl bg-white/10 border border-white/15 backdrop-blur p-5">
      <h3 className="font-display text-lg font-bold text-fairy-blush mb-3 text-center">
        {title}
      </h3>
      {children}
    </div>
  );
}

// STAGE 1 — Rapid-fire audio riddles with a draining timer bar.
function Stage1({ damage, onDone }) {
  const [i, setI] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);
  const riddle = RAID.listening[i];

  useEffect(() => {
    setTimeLeft(100);
    speak(riddle.audio, { rate: 1.05 });
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 2)), 120);
    return () => {
      clearInterval(id);
      stopSpeaking();
    };
  }, [i]); // eslint-disable-line

  useEffect(() => {
    if (timeLeft === 0) advance(false);
  }, [timeLeft]); // eslint-disable-line

  const advance = (won) => {
    if (won) {
      chime(true);
      damage(9);
    } else {
      chime(false);
    }
    if (i + 1 >= RAID.listening.length) onDone();
    else setI((n) => n + 1);
  };

  return (
    <RaidPanel title="Stage 1 · Audio Riddles — click before time runs out!">
      <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-4">
        <div
          className="h-full bg-fairy-gold transition-all duration-100"
          style={{ width: `${timeLeft}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {riddle.options.map((o) => (
          <motion.button
            key={o.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => advance(!!o.correct)}
            className="rounded-2xl py-6 bg-white/10 border border-white/20 text-4xl"
          >
            {o.emoji}
          </motion.button>
        ))}
      </div>
      <p className="text-center text-xs text-fairy-blush/60 mt-3">
        Riddle {i + 1} / {RAID.listening.length}
      </p>
    </RaidPanel>
  );
}

// STAGE 2 — Text maze: pick the rune block naming the weakness.
function Stage2({ damage, onDone }) {
  const [shake, setShake] = useState(null);
  const choose = (block, idx) => {
    if (block.vulnerable) {
      chime(true);
      damage(25);
      onDone();
    } else {
      chime(false);
      setShake(idx);
      setTimeout(() => setShake(null), 400);
    }
  };
  return (
    <RaidPanel title="Stage 2 · Rune Maze — find the mirror's weakness">
      <div className="space-y-3">
        {RAID.reading.map((b, idx) => (
          <motion.button
            key={idx}
            animate={shake === idx ? { x: [0, -8, 8, 0] } : {}}
            onClick={() => choose(b, idx)}
            className="w-full text-left rounded-2xl px-4 py-3 bg-gradient-to-r from-fairy-lilac/30 to-white/5 border border-fairy-lilac/40 text-fairy-blush font-semibold shadow-rune"
          >
            🔹 {b.text}
          </motion.button>
        ))}
      </div>
    </RaidPanel>
  );
}

// STAGE 3 — Rune Blast: type the learned sentences to fire runes at the mirror.
function Stage3({ damage, onDone }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [firing, setFiring] = useState(false);
  const target = RAID.writing[i];

  const fire = () => {
    const sim = similarity(text, target);
    if (sim >= 0.6) {
      setFiring(true);
      chime(true);
      damage(9);
      setTimeout(() => {
        setFiring(false);
        setText("");
        if (i + 1 >= RAID.writing.length) onDone();
        else setI((n) => n + 1);
      }, 700);
    } else {
      chime(false);
    }
  };

  return (
    <RaidPanel title="Stage 3 · Rune Blast — type the spell sentence">
      <p className="text-center text-fairy-gold font-display text-lg mb-3">
        “{target}”
      </p>
      <div className="relative">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fire()}
          placeholder="Type the sentence to charge your rune…"
          className="w-full rounded-2xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/40 outline-none focus:border-fairy-rose"
        />
        <AnimatePresence>
          {firing && (
            <motion.span
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: 0, y: -160, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.7 }}
              className="absolute left-1/2 -top-2 text-3xl"
            >
              🔮
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-3">
        <button className="fairy-btn fairy-btn-primary" onClick={fire}>
          ⚡ Fire Light Rune
        </button>
      </div>
      <p className="text-center text-xs text-fairy-blush/60 mt-2">
        Spell {i + 1} / {RAID.writing.length}
      </p>
    </RaidPanel>
  );
}

// STAGE 4 — Final negotiation: answer the mirror's questions in full sentences.
function Stage4({ damage, onDone }) {
  const [i, setI] = useState(0);
  const [listening, setListening] = useState(false);
  const [typed, setTyped] = useState("");
  const [useType, setUseType] = useState(!isSpeechSupported());
  const recRef = useRef(null);
  const question = RAID.speaking[i];

  useEffect(() => {
    speak(question, { rate: 0.95, pitch: 0.8 });
    return () => stopSpeaking();
  }, [i]); // eslint-disable-line

  const resolve = (answerText) => {
    const words = answerText.trim().split(/\s+/).filter(Boolean).length;
    if (words >= 4) {
      chime(true);
      damage(9);
      setTyped("");
      if (i + 1 >= RAID.speaking.length) onDone();
      else setI((n) => n + 1);
    } else {
      chime(false);
    }
  };

  const listen = () => {
    const rec = getSpeechRecognition();
    if (!rec) {
      setUseType(true);
      return;
    }
    recRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e) => resolve(e.results[0][0].transcript);
    rec.onerror = () => {
      setListening(false);
      setUseType(true);
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
    } catch {
      setUseType(true);
    }
  };

  return (
    <RaidPanel title="Stage 4 · Final Negotiation — answer in a full sentence">
      <p className="text-center text-fairy-blush font-display text-lg mb-4">
        🪞 “{question}”
      </p>
      {!useType ? (
        <div className="text-center">
          <button
            onClick={listen}
            disabled={listening}
            className={`fairy-btn fairy-btn-primary !px-6 !py-4 ${
              listening ? "animate-pulse" : ""
            }`}
          >
            {listening ? "🎙️ Speak now…" : "🎤 Answer the Mirror"}
          </button>
          <button
            onClick={() => setUseType(true)}
            className="block mx-auto mt-2 text-xs text-fairy-blush/50 underline"
          >
            Type instead
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && resolve(typed)}
            placeholder="Type a full-sentence answer…"
            className="flex-1 rounded-2xl bg-white/10 border border-white/20 p-3 text-white placeholder:text-white/40 outline-none focus:border-fairy-rose"
          />
          <button className="fairy-btn fairy-btn-primary" onClick={() => resolve(typed)}>
            Send
          </button>
        </div>
      )}
      <p className="text-center text-xs text-fairy-blush/60 mt-3">
        Question {i + 1} / {RAID.speaking.length}
      </p>
    </RaidPanel>
  );
}

function VictoryCard({ onExit }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="rounded-3xl bg-white/15 border border-white/25 p-8 text-center"
    >
      <div className="text-7xl mb-3 animate-floaty">👑</div>
      <h2 className="font-display text-3xl font-extrabold text-fairy-gold">
        The Mirror is Shattered!
      </h2>
      <p className="text-fairy-blush/90 mt-2">
        You earned <b>+500 Mana</b> and unlocked <b>Tier 2 · Sky Castle Academy</b>!
      </p>
      <button className="fairy-btn fairy-btn-primary mt-5" onClick={onExit}>
        ✨ Enter the Sky Castle
      </button>
    </motion.div>
  );
}
