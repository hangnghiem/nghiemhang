import { useEffect, useRef } from "react";
import { SendIcon, StopIcon } from "./icons.jsx";

export default function Composer({ value, onChange, onSend, onStop, busy }) {
  const ref = useRef(null);

  // Auto-grow the textarea up to a max height.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!busy) onSend();
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-4">
      <div className="flex items-end gap-2 rounded-3xl border border-white/10 bg-surfaceAlt px-3 py-2 shadow-lg focus-within:border-white/25">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message LocalGPT…"
          className="max-h-[220px] flex-1 resize-none bg-transparent px-2 py-2 text-[15px] leading-6 text-gray-100 placeholder-gray-500 outline-none"
        />
        {busy ? (
          <button
            onClick={onStop}
            title="Stop generating"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200"
          >
            <StopIcon width={18} height={18} />
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!value.trim()}
            title="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-gray-500"
          >
            <SendIcon width={18} height={18} />
          </button>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-gray-500">
        LocalGPT can make mistakes. Responses come from your configured model.
      </p>
    </div>
  );
}
