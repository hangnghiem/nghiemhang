import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Message from "./components/Message.jsx";
import Composer from "./components/Composer.jsx";
import EmptyState from "./components/EmptyState.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import { MenuIcon, PlusIcon } from "./components/icons.jsx";
import { streamChat } from "./lib/api.js";
import {
  loadConversations,
  loadSettings,
  saveConversations,
  saveSettings,
  newConversation,
  deriveTitle,
  uid,
} from "./lib/storage.js";

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [conversations, setConversations] = useState(() => {
    const existing = loadConversations();
    return existing.length ? existing : [newConversation()];
  });
  const [activeId, setActiveId] = useState(() => null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const abortRef = useRef(null);
  const scrollRef = useRef(null);

  // Resolve the active conversation, defaulting to the first one.
  const active = useMemo(() => {
    return (
      conversations.find((c) => c.id === activeId) || conversations[0] || null
    );
  }, [conversations, activeId]);

  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  // Persist on change.
  useEffect(() => saveConversations(conversations), [conversations]);
  useEffect(() => saveSettings(settings), [settings]);

  // Auto-scroll to bottom as messages grow / stream.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.messages, streamingId]);

  const patchConversation = useCallback((id, updater) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...updater(c), updatedAt: Date.now() } : c
      )
    );
  }, []);

  const handleNew = useCallback(() => {
    // Reuse an existing empty "New chat" instead of piling them up.
    const empty = conversations.find((c) => c.messages.length === 0);
    if (empty) {
      setActiveId(empty.id);
    } else {
      const c = newConversation();
      setConversations((prev) => [c, ...prev]);
      setActiveId(c.id);
    }
    setSidebarOpen(false);
  }, [conversations]);

  const handleDelete = useCallback(
    (id) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.id !== id);
        return next.length ? next : [newConversation()];
      });
      setActiveId((cur) => (cur === id ? null : cur));
    },
    []
  );

  const handleRename = useCallback(
    (id, title) => patchConversation(id, (c) => ({ ...c, title })),
    [patchConversation]
  );

  // Core: send the current conversation (up to `upToMessages`) to the model.
  const runCompletion = useCallback(
    async (conversationId, messagesForApi, assistantId) => {
      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);
      setStreamingId(assistantId);

      const apiMessages = [
        ...(settings.systemPrompt
          ? [{ role: "system", content: settings.systemPrompt }]
          : []),
        ...messagesForApi.map(({ role, content }) => ({ role, content })),
      ];

      try {
        await streamChat({
          settings,
          messages: apiMessages,
          signal: controller.signal,
          onToken: (delta) => {
            patchConversation(conversationId, (c) => ({
              ...c,
              messages: c.messages.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + delta }
                  : m
              ),
            }));
          },
        });
      } catch (e) {
        const aborted = e.name === "AbortError";
        patchConversation(conversationId, (c) => ({
          ...c,
          messages: c.messages.map((m) =>
            m.id === assistantId
              ? aborted && m.content
                ? m // keep partial output on manual stop
                : {
                    ...m,
                    content: aborted
                      ? "Generation stopped."
                      : `Error: ${e.message}`,
                    error: !aborted,
                  }
              : m
          ),
        }));
      } finally {
        setBusy(false);
        setStreamingId(null);
        abortRef.current = null;
      }
    },
    [settings, patchConversation]
  );

  const handleSend = useCallback(
    (text) => {
      const content = (text ?? input).trim();
      if (!content || busy || !active) return;

      const userMsg = { id: uid(), role: "user", content };
      const assistantId = uid();
      const assistantMsg = { id: assistantId, role: "assistant", content: "" };
      const convId = active.id;

      const baseMessages = [...active.messages, userMsg];

      patchConversation(convId, (c) => ({
        ...c,
        title: c.messages.length === 0 ? deriveTitle(content) : c.title,
        messages: [...c.messages, userMsg, assistantMsg],
      }));
      setInput("");

      runCompletion(convId, baseMessages, assistantId);
    },
    [input, busy, active, patchConversation, runCompletion]
  );

  const handleRegenerate = useCallback(() => {
    if (!active || busy) return;
    const msgs = active.messages;
    // Find last assistant message and the user turn that preceded it.
    let lastAssistant = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === "assistant") {
        lastAssistant = i;
        break;
      }
    }
    if (lastAssistant === -1) return;
    const priorMessages = msgs.slice(0, lastAssistant);
    const assistantId = uid();

    patchConversation(active.id, (c) => ({
      ...c,
      messages: [
        ...priorMessages,
        { id: assistantId, role: "assistant", content: "" },
      ],
    }));
    runCompletion(active.id, priorMessages, assistantId);
  }, [active, busy, patchConversation, runCompletion]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const providerLabel = settings.provider === "ollama" ? "Ollama" : "API";
  const hasMessages = active && active.messages.length > 0;
  const lastMsg = active?.messages[active.messages.length - 1];
  const canRegenerate = hasMessages && lastMsg?.role === "assistant" && !busy;

  return (
    <div className="flex h-full w-full overflow-hidden bg-surface text-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={active?.id}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNew={handleNew}
        onDelete={handleDelete}
        onRename={handleRename}
        onOpenSettings={() => setShowSettings(true)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        providerLabel={providerLabel}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-2 border-b border-white/5 px-3 py-2.5">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
            aria-label="Open sidebar"
          >
            <MenuIcon width={20} height={20} />
          </button>
          <div className="min-w-0 flex-1 truncate text-sm font-medium text-gray-300">
            {active?.title || "New chat"}
          </div>
          <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs text-gray-400 sm:block">
            {settings.model}
          </span>
          <button
            onClick={handleNew}
            className="rounded-lg p-2 transition hover:bg-white/10 md:hidden"
            aria-label="New chat"
          >
            <PlusIcon width={20} height={20} />
          </button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {hasMessages ? (
            <div className="pb-6">
              {active.messages.map((m) => (
                <Message
                  key={m.id}
                  message={m}
                  isStreaming={m.id === streamingId}
                  onRegenerate={
                    canRegenerate && m.id === lastMsg.id
                      ? handleRegenerate
                      : null
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState onPick={handleSend} modelName={settings.model} />
          )}
        </div>

        {/* Composer */}
        <Composer
          value={input}
          onChange={setInput}
          onSend={() => handleSend()}
          onStop={handleStop}
          busy={busy}
        />
      </main>

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={setSettings}
        />
      )}
    </div>
  );
}
