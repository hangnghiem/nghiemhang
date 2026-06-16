// localStorage-backed persistence for settings + conversations.

const SETTINGS_KEY = "localgpt.settings.v1";
const CONVOS_KEY = "localgpt.conversations.v1";

export const DEFAULT_SETTINGS = {
  provider: "ollama", // "ollama" | "openai"
  baseUrl: "http://localhost:11434",
  apiKey: "",
  model: "llama3.2",
  temperature: 0.7,
  systemPrompt: "You are a helpful, concise assistant.",
};

// Sensible default base URLs per provider, used when switching providers.
export const DEFAULT_BASE_URLS = {
  ollama: "http://localhost:11434",
  openai: "https://api.openai.com",
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota / private mode errors */
  }
}

export function loadConversations() {
  try {
    const raw = localStorage.getItem(CONVOS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveConversations(convos) {
  try {
    localStorage.setItem(CONVOS_KEY, JSON.stringify(convos));
  } catch {
    /* ignore */
  }
}

export function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function newConversation() {
  return {
    id: uid(),
    title: "New chat",
    messages: [], // {id, role: "user"|"assistant", content, error?}
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// Derive a short title from the first user message.
export function deriveTitle(text) {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return "New chat";
  return clean.length > 40 ? clean.slice(0, 40) + "…" : clean;
}
