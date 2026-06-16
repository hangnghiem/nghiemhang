import { useState } from "react";
import { CopyIcon, CheckIcon } from "./icons.jsx";

// Renders a fenced code block with a language label and a copy button.
// `inline` code is delegated back to a plain <code> (styled via index.css).
export default function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "text";
  const code = String(children).replace(/\n$/, "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-white/10 bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-400">
        <span className="font-mono lowercase">{lang}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 transition hover:text-gray-100"
        >
          {copied ? (
            <>
              <CheckIcon width={14} height={14} /> Copied
            </>
          ) : (
            <>
              <CopyIcon width={14} height={14} /> Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={`${className || ""} font-mono`} {...props}>
          {children}
        </code>
      </pre>
    </div>
  );
}
