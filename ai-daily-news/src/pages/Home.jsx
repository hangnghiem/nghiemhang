import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { lessons, CATEGORIES, levelBand } from "../data/lessons.js";
import LessonCard from "../components/LessonCard.jsx";
import Filters from "../components/Filters.jsx";

export default function Home({ isDone }) {
  const [query, setQuery] = useState("");
  const [band, setBand] = useState("All");
  const [category, setCategory] = useState("All");

  const sorted = useMemo(
    () => [...lessons].sort((a, b) => b.date.localeCompare(a.date)),
    []
  );
  const featured = sorted[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((l) => {
      const matchesQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q);
      const matchesBand = band === "All" || levelBand(l.level).label === band;
      const matchesCat = category === "All" || l.category === category;
      return matchesQuery && matchesBand && matchesCat;
    });
  }, [sorted, query, band, category]);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-coral-400/20 blur-2xl" />
        <div className="container-page relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <span className="chip bg-white/15 text-white backdrop-blur">
              🤖 Fresh AI stories every day
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Learn English with the latest{" "}
              <span className="text-coral-400">AI news</span>.
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/85">
              Bite-sized lessons built from real artificial-intelligence
              headlines. Read, listen, master key vocabulary, and discuss — at
              your level.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={`/lesson/${featured.slug}`} className="btn bg-white px-6 py-3 text-brand-700 hover:bg-brand-50">
                Start today's lesson
              </Link>
              <a href="#feed" className="btn border border-white/40 px-6 py-3 text-white hover:bg-white/10">
                Browse all lessons
              </a>
            </div>
            <div className="mt-8 flex gap-8 text-sm">
              <div>
                <p className="font-display text-2xl font-bold">{lessons.length}</p>
                <p className="text-white/70">AI lessons</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">10</p>
                <p className="text-white/70">Difficulty levels</p>
              </div>
              <div>
                <p className="font-display text-2xl font-bold">{CATEGORIES.length}</p>
                <p className="text-white/70">Topics</p>
              </div>
            </div>
          </div>

          {/* Featured card */}
          <Link
            to={`/lesson/${featured.slug}`}
            className="group relative block overflow-hidden rounded-3xl bg-white p-2 shadow-cardHover"
          >
            <div
              className="flex h-44 items-center justify-center rounded-2xl"
              style={{
                backgroundImage: `linear-gradient(135deg, ${featured.hero.from}, ${featured.hero.to})`,
              }}
            >
              <span className="text-7xl drop-shadow-lg transition group-hover:scale-110">
                {featured.hero.emoji}
              </span>
            </div>
            <div className="p-5 text-ink">
              <span className="chip bg-coral-500/10 text-coral-600">
                ★ Featured · {featured.category}
              </span>
              <h3 className="mt-3 font-display text-xl font-bold">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">{featured.summary}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Feed */}
      <section id="feed" className="container-page py-12">
        <div className="mb-8 flex flex-col gap-1">
          <h2 className="font-display text-2xl font-extrabold text-ink">
            Daily News Lessons
          </h2>
          <p className="text-slate-500">
            The newest AI headlines, turned into English lessons.
          </p>
        </div>

        <div className="mb-8">
          <Filters
            query={query}
            onQuery={setQuery}
            band={band}
            onBand={setBand}
            category={category}
            onCategory={setCategory}
            categories={CATEGORIES}
            resultCount={filtered.length}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-400 shadow-card">
            No lessons match your filters. Try clearing the search.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((l) => (
              <LessonCard key={l.id} lesson={l} done={isDone?.(l.id)} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
