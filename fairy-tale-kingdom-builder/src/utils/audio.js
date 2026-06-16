// Browser audio helpers built on the Web Audio API + SpeechSynthesis.

let _ctx = null;
export function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!_ctx) _ctx = new AC();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

// Speak a clip using the browser's TTS voice (acts as our "talking mirror").
export function speak(text, { rate = 0.95, pitch = 1.15, voiceHint } = {}) {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve(false);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    const voices = window.speechSynthesis.getVoices();
    if (voiceHint && voices.length) {
      const v = voices.find((x) =>
        x.name.toLowerCase().includes(voiceHint.toLowerCase())
      );
      if (v) u.voice = v;
    }
    u.onend = () => resolve(true);
    u.onerror = () => resolve(false);
    window.speechSynthesis.speak(u);
  });
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Layered "magic whispers" background noise that scales with difficulty (Web Audio API).
export class WhisperNoise {
  constructor() {
    this.ctx = getAudioContext();
    this.node = null;
    this.gain = null;
    this.filter = null;
  }

  start(level = 1) {
    if (!this.ctx || this.node) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = "bandpass";
    this.filter.frequency.value = 1100;
    this.filter.Q.value = 0.6;

    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0;

    noise.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    noise.start();
    this.node = noise;
    this.setLevel(level);
  }

  setLevel(level = 1) {
    if (!this.gain || !this.ctx) return;
    // level 1..5 -> very subtle to noticeable
    const target = Math.min(0.06, 0.008 * level);
    this.gain.gain.linearRampToValueAtTime(
      target,
      this.ctx.currentTime + 0.4
    );
  }

  stop() {
    if (this.node) {
      try {
        this.node.stop();
      } catch (e) {
        /* already stopped */
      }
      this.node.disconnect();
      this.node = null;
    }
  }
}

// Short reward chime via oscillator.
export function chime(success = true) {
  const ctx = getAudioContext();
  if (!ctx) return;
  const notes = success ? [523.25, 659.25, 783.99] : [220, 174.61];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.09;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.32);
  });
}
