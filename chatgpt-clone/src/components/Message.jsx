import { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import CodeBlock from "./CodeBlock.jsx";
import { CopyIcon, CheckIcon, RefreshIcon } from "./icons.jsx";

const markdownComponents = {
  code: CodeBlock,
};

function Avatar({ role }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
        You
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-accent-500 text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 9a5 5 0 0 1 10 0v1a5 5 0 0 1-10 0V9z" opacity="0" />
        <circle cx="9" cy="10" r="2.4" />
        <circle cx="15" cy="10" r="2.4" />
        <path
          d="M6 16c0-2 2.7-3.2 6-3.2S18 14 18 16s-2.7 3.2-6 3.2S6 18 6 16z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function Message({ message, isStreaming, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="group w-full animate-fadeIn">
      <div className="mx-auto flex w-full max-w-3xl gap-4 px-4 py-5">
        <Avatar role={message.role} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-sm font-semibold text-gray-200">
            {isUser ? "You" : "Assistant"}
          </div>

          {message.error ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {message.content}
            </div>
          ) : isUser ? (
            <div className="whitespace-pre-wrap break-words text-[15px] leading-7 text-gray-100">
              {message.content}
            </div>
          ) : (
            <div className="prose-chat text-gray-100">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {message.content || ""}
              </ReactMarkdown>
              {isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-gray-300 align-middle" />
              )}
            </div>
          )}

          {!isUser && !message.error && !isStreaming && message.content && (
            <div className="mt-2 flex items-center gap-1 text-gray-500 opacity-0 transition group-hover:opacity-100">
              <button
                onClick={copy}
                title="Copy"
                className="rounded p-1.5 transition hover:bg-white/10 hover:text-gray-200"
              >
                {copied ? (
                  <CheckIcon width={16} height={16} />
                ) : (
                  <CopyIcon width={16} height={16} />
                )}
              </button>
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  title="Regenerate"
                  className="rounded p-1.5 transition hover:bg-white/10 hover:text-gray-200"
                >
                  <RefreshIcon width={16} height={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Message);
