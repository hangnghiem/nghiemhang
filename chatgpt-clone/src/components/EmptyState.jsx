import { SparkIcon } from "./icons.jsx";

const SUGGESTIONS = [
  {
    title: "Explain a concept",
    prompt: "Explain how HTTPS keeps data secure, in simple terms.",
  },
  {
    title: "Write some code",
    prompt: "Write a Python function that returns the nth Fibonacci number.",
  },
  {
    title: "Brainstorm ideas",
    prompt: "Give me 5 creative weekend project ideas for a web developer.",
  },
  {
    title: "Summarize text",
    prompt: "Summarize the key benefits of running an LLM locally.",
  },
];

export default function EmptyState({ onPick, modelName }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-500 text-white">
        <SparkIcon width={28} height={28} />
      </div>
      <h1 className="mb-1 text-2xl font-semibold text-gray-100">
        How can I help you today?
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Chatting with <span className="text-gray-300">{modelName}</span> on your
        machine.
      </p>

      <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPick(s.prompt)}
            className="rounded-xl border border-white/10 bg-surfaceAlt p-4 text-left transition hover:border-white/25 hover:bg-white/5"
          >
            <div className="text-sm font-medium text-gray-200">{s.title}</div>
            <div className="mt-1 text-sm text-gray-500">{s.prompt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
