// Persist which lessons the learner has completed using localStorage.
import { useCallback, useEffect, useState } from "react";

const KEY = "ai-daily-news:completed";

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function useProgress() {
  const [completed, setCompleted] = useState(() => read());

  useEffect(() => {
    function sync() {
      setCompleted(read());
    }
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const persist = useCallback((next) => {
    setCompleted(new Set(next));
    try {
      localStorage.setItem(KEY, JSON.stringify([...next]));
    } catch {
      // ignore write errors (e.g. private mode)
    }
  }, []);

  const toggle = useCallback(
    (id) => {
      const next = new Set(read());
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next);
    },
    [persist]
  );

  const isDone = useCallback((id) => completed.has(id), [completed]);

  return { completed, toggle, isDone };
}
