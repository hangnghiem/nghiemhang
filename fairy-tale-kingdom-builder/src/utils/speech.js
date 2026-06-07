// Web Speech API (SpeechRecognition) wrapper with graceful fallbacks.

export function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  return SR ? new SR() : null;
}

export function isSpeechSupported() {
  return !!(
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

const clean = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s']/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Word-overlap similarity 0..1 between spoken transcript and a target sentence.
export function similarity(transcript, target) {
  const a = clean(transcript).split(" ").filter(Boolean);
  const b = clean(target).split(" ").filter(Boolean);
  if (!a.length || !b.length) return 0;
  const setB = new Set(b);
  let hit = 0;
  a.forEach((w) => {
    if (setB.has(w)) hit++;
  });
  return hit / Math.max(a.length, b.length);
}

// For conversation mode: did the answer contain enough keywords + be a full sentence?
export function scoreConversation(transcript, keywords = []) {
  const t = clean(transcript);
  const words = t.split(" ").filter(Boolean);
  const fullSentence = words.length >= 4;
  const hits = keywords.filter((k) => t.includes(clean(k))).length;
  const keywordOk = keywords.length === 0 ? true : hits >= 1;
  return { ok: fullSentence && keywordOk, words: words.length, hits };
}
