import { Link } from "react-router-dom";
import LevelBadge from "./LevelBadge.jsx";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function LessonCard({ lesson, done }) {
  const { hero } = lesson;
  return (
    <Link
      to={`/lesson/${lesson.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-cardHover"
    >
      <div
        className="relative flex h-40 items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, ${hero.from}, ${hero.to})`,
        }}
      >
        <span className="text-6xl drop-shadow-lg transition group-hover:scale-110">
          {hero.emoji}
        </span>
        <span className="chip absolute left-3 top-3 bg-white/90 text-brand-700 backdrop-blur">
          {lesson.category}
        </span>
        {done && (
          <span className="chip absolute right-3 top-3 bg-brand-500 text-white">
            ✓ Done
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-brand-700">
          {lesson.title}
        </h3>
        <p className="line-clamp-2 text-sm text-slate-500">{lesson.summary}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <LevelBadge level={lesson.level} />
          <span className="text-xs font-medium text-slate-400">
            {formatDate(lesson.date)} · {lesson.minutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
