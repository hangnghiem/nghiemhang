import { useEffect, useState } from "react";
import { CloseIcon } from "./icons.jsx";
import { listModels } from "../lib/api.js";
import { DEFAULT_BASE_URLS } from "../lib/storage.js";

export default function SettingsModal({ settings, onClose, onSave }) {
  const [draft, setDraft] = useState(settings);
  const [models, setModels] = useState([]);
  const [status, setStatus] = useState(null); // {type, msg}
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Try to populate model list on open (best effort).
    refreshModels(settings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const switchProvider = (provider) => {
    const next = {
      ...draft,
      provider,
      baseUrl: DEFAULT_BASE_URLS[provider],
    };
    setDraft(next);
    setModels([]);
    setStatus(null);
    refreshModels(next);
  };

  async function refreshModels(cfg) {
    setTesting(true);
    setStatus(null);
    try {
      const list = await listModels(cfg);
      setModels(list);
      setStatus({
        type: "ok",
        msg: list.length
          ? `Connected — ${list.length} model(s) available.`
          : "Connected, but no models found.",
      });
    } catch (e) {
      setModels([]);
      setStatus({
        type: "error",
        msg: `Couldn't reach server: ${e.message}`,
      });
    } finally {
      setTesting(false);
    }
  }

  const save = () => {
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-gray-100"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Provider */}
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Provider
        </label>
        <div className="mb-5 grid grid-cols-2 gap-2">
          <ProviderButton
            active={draft.provider === "ollama"}
            onClick={() => switchProvider("ollama")}
            title="Ollama (local)"
            sub="Runs fully on your machine"
          />
          <ProviderButton
            active={draft.provider === "openai"}
            onClick={() => switchProvider("openai")}
            title="OpenAI-compatible"
            sub="OpenAI, LM Studio, etc."
          />
        </div>

        {/* Base URL */}
        <Field label="Base URL">
          <input
            value={draft.baseUrl}
            onChange={(e) => set({ baseUrl: e.target.value })}
            placeholder="http://localhost:11434"
            className={inputCls}
          />
        </Field>

        {/* API key (openai only) */}
        {draft.provider === "openai" && (
          <Field label="API key">
            <input
              type="password"
              value={draft.apiKey}
              onChange={(e) => set({ apiKey: e.target.value })}
              placeholder="sk-..."
              className={inputCls}
            />
          </Field>
        )}

        {/* Model */}
        <Field label="Model">
          <div className="flex gap-2">
            {models.length > 0 ? (
              <select
                value={draft.model}
                onChange={(e) => set({ model: e.target.value })}
                className={inputCls}
              >
                {!models.includes(draft.model) && draft.model && (
                  <option value={draft.model}>{draft.model} (custom)</option>
                )}
                {models.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={draft.model}
                onChange={(e) => set({ model: e.target.value })}
                placeholder="llama3.2"
                className={inputCls}
              />
            )}
            <button
              onClick={() => refreshModels(draft)}
              disabled={testing}
              className="shrink-0 rounded-lg border border-white/15 px-3 text-sm text-gray-200 transition hover:bg-white/10 disabled:opacity-50"
            >
              {testing ? "…" : "Test"}
            </button>
          </div>
        </Field>

        {status && (
          <p
            className={`-mt-2 mb-4 text-xs ${
              status.type === "ok" ? "text-accent-400" : "text-red-400"
            }`}
          >
            {status.msg}
          </p>
        )}

        {/* Temperature */}
        <Field label={`Temperature: ${draft.temperature.toFixed(1)}`}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={draft.temperature}
            onChange={(e) => set({ temperature: Number(e.target.value) })}
            className="w-full accent-accent-500"
          />
        </Field>

        {/* System prompt */}
        <Field label="System prompt">
          <textarea
            rows={3}
            value={draft.systemPrompt}
            onChange={(e) => set({ systemPrompt: e.target.value })}
            className={`${inputCls} resize-none`}
          />
        </Field>

        {draft.provider === "ollama" && (
          <p className="mb-4 rounded-lg bg-white/5 p-3 text-xs text-gray-400">
            Tip: install{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noreferrer"
              className="text-accent-400 underline"
            >
              Ollama
            </a>
            , then run{" "}
            <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">
              ollama pull llama3.2
            </code>{" "}
            and{" "}
            <code className="rounded bg-black/40 px-1.5 py-0.5 font-mono">
              ollama serve
            </code>
            .
          </p>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-white/15 bg-surfaceAlt px-3 py-2 text-sm text-gray-100 outline-none transition focus:border-accent-500";

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function ProviderButton({ active, onClick, title, sub }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border p-3 text-left transition ${
        active
          ? "border-accent-500 bg-accent-500/10"
          : "border-white/15 hover:bg-white/5"
      }`}
    >
      <div className="text-sm font-medium text-gray-100">{title}</div>
      <div className="mt-0.5 text-xs text-gray-500">{sub}</div>
    </button>
  );
}
