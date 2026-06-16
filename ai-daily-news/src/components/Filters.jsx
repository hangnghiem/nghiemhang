const BANDS = ["All", "Beginner", "Intermediate", "Advanced", "Proficient"];

export default function Filters({
  query,
  onQuery,
  band,
  onBand,
  category,
  onCategory,
  categories,
  resultCount,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search AI news lessons…"
          className="w-full rounded-full border border-black/5 bg-white py-3 pl-12 pr-4 text-sm shadow-card outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Level
        </span>
        {BANDS.map((b) => (
          <button
            key={b}
            onClick={() => onBand(b)}
            className={`chip ${
              band === b
                ? "bg-brand-500 text-white"
                : "bg-white text-slate-600 ring-1 ring-black/5 hover:bg-brand-50"
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      <div id="categories" className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Topic
        </span>
        <button
          onClick={() => onCategory("All")}
          className={`chip ${
            category === "All"
              ? "bg-ink text-white"
              : "bg-white text-slate-600 ring-1 ring-black/5 hover:bg-brand-50"
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => onCategory(c)}
            className={`chip ${
              category === c
                ? "bg-ink text-white"
                : "bg-white text-slate-600 ring-1 ring-black/5 hover:bg-brand-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="text-sm text-slate-400">
        {resultCount} {resultCount === 1 ? "lesson" : "lessons"} found
      </p>
    </div>
  );
}
