// Unified chat client for two backends:
//   - "ollama": a local LLM server (https://ollama.com), default http://localhost:11434
//   - "openai": any OpenAI-compatible Chat Completions API (OpenAI, LM Studio, etc.)
//
// Both paths stream tokens and call onToken(deltaText) as chunks arrive.

function normalizeBase(url) {
  return (url || "").trim().replace(/\/+$/, "");
}

/**
 * List available model names for the configured provider.
 * Returns string[]. Throws on network/HTTP failure so the UI can surface it.
 */
export async function listModels(settings) {
  const base = normalizeBase(settings.baseUrl);
  if (settings.provider === "ollama") {
    const res = await fetch(`${base}/api/tags`);
    if (!res.ok) throw new Error(`Ollama responded ${res.status}`);
    const data = await res.json();
    return (data.models || []).map((m) => m.name);
  }
  // openai-compatible
  const res = await fetch(`${base}/v1/models`, {
    headers: authHeaders(settings),
  });
  if (!res.ok) throw new Error(`API responded ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((m) => m.id);
}

function authHeaders(settings) {
  const h = { "Content-Type": "application/json" };
  if (settings.apiKey) h.Authorization = `Bearer ${settings.apiKey}`;
  return h;
}

/**
 * Stream a chat completion.
 *
 * @param {object}   opts
 * @param {object}   opts.settings  provider config
 * @param {Array}    opts.messages  [{role, content}] including system prompt
 * @param {Function} opts.onToken   (deltaText) => void
 * @param {AbortSignal} opts.signal
 * @returns {Promise<string>} the full assembled text
 */
export async function streamChat({ settings, messages, onToken, signal }) {
  if (settings.provider === "ollama") {
    return streamOllama({ settings, messages, onToken, signal });
  }
  return streamOpenAI({ settings, messages, onToken, signal });
}

async function streamOllama({ settings, messages, onToken, signal }) {
  const base = normalizeBase(settings.baseUrl);
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({
      model: settings.model,
      messages,
      stream: true,
      options: { temperature: settings.temperature },
    }),
  });
  if (!res.ok) {
    throw new Error(`Ollama error ${res.status}: ${await safeText(res)}`);
  }

  let full = "";
  // Ollama streams newline-delimited JSON objects.
  await readLines(res.body, (line) => {
    if (!line.trim()) return;
    let obj;
    try {
      obj = JSON.parse(line);
    } catch {
      return;
    }
    const delta = obj?.message?.content || "";
    if (delta) {
      full += delta;
      onToken(delta);
    }
  });
  return full;
}

async function streamOpenAI({ settings, messages, onToken, signal }) {
  const base = normalizeBase(settings.baseUrl);
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: authHeaders(settings),
    signal,
    body: JSON.stringify({
      model: settings.model,
      messages,
      stream: true,
      temperature: settings.temperature,
    }),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await safeText(res)}`);
  }

  let full = "";
  // OpenAI streams Server-Sent Events: lines prefixed with "data: ".
  await readLines(res.body, (line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) return;
    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") return;
    let obj;
    try {
      obj = JSON.parse(payload);
    } catch {
      return;
    }
    const delta = obj?.choices?.[0]?.delta?.content || "";
    if (delta) {
      full += delta;
      onToken(delta);
    }
  });
  return full;
}

// Read a ReadableStream and invoke onLine for each newline-delimited chunk.
async function readLines(stream, onLine) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        onLine(line);
      }
    }
    if (buffer) onLine(buffer);
  } finally {
    reader.releaseLock();
  }
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
