import { useEffect, useState } from "react";
import { speak, stopSpeaking, speechSupported } from "../lib/speech.js";

export default function AudioButton({ text, label = "Listen", small = false }) {
  const [playing, setPlaying] = useState(false);
  const supported = speechSupported();

  useEffect(() => () => stopSpeaking(), []);

  function toggle() {
    if (playing) {
      stopSpeaking();
      setPlaying(false);
      return;
    }
    const ok = speak(text, { onEnd: () => setPlaying(false) });
    if (ok) setPlaying(true);
  }

  if (!supported) return null;

  if (small) {
    return (
      <button
        onClick={toggle}
        aria-label={playing ? "Stop audio" : "Play audio"}
        className={`grid h-8 w-8 place-items-center rounded-full transition ${
          playing
            ? "bg-coral-500 text-white"
            : "bg-brand-50 text-brand-600 hover:bg-brand-100"
        }`}
      >
        {playing ? <StopIcon /> : <PlayIcon />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`btn px-5 py-2.5 ${
        playing
          ? "bg-coral-500 text-white hover:bg-coral-600"
          : "bg-brand-500 text-white hover:bg-brand-600"
      }`}
    >
      <span className="relative grid place-items-center">
        {playing ? <StopIcon /> : <PlayIcon />}
        {playing && (
          <span className="absolute inset-0 animate-pulseRing rounded-full bg-white/40" />
        )}
      </span>
      {playing ? "Stop" : label}
    </button>
  );
}

function PlayIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}
