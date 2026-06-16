import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getLessonBySlug, lessons } from "../data/lessons.js";
import LevelBadge from "../components/LevelBadge.jsx";
import AudioButton from "../components/AudioButton.jsx";
import Vocabulary from "../components/Vocabulary.jsx";
import DiscussionList from "../components/DiscussionList.jsx";
import Quiz from "../components/Quiz.jsx";
import LessonCard from "../components/LessonCard.jsx";
import NotFound from "./NotFound.jsx";

function SectionNav() {
  const links = [
    ["article", "Article"],
    ["quiz", "Quiz"],
    ["vocabulary", "Vocabulary"],
    ["discussion", "Discussion"],
  ];
  return (
    <nav className="sticky top-16 z-30 -mx-4 mb-8 border-b border-black/5 bg-[#f6faf8]/90 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-full sm:border sm:px-2 sm:shadow-card">
      <ul className="flex justify-center gap-1 text-sm font-semibold text-slate-500">
        {links.map(([id, label]) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="block rounded-full px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Lesson({ isDone, toggle }) {
  const { slug } = useParams();
  const lesson = getLessonBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!lesson) return <NotFound />;

  const done = isDone?.(lesson.id);
  const markComplete = () => {
    if (!isDone?.(lesson.id)) toggle?.(lesson.id);
  };
  const articleText = `${lesson.title}. ${lesson.paragraphs.join(" ")}`;
  const related = lessons
    .filter((l) => l.id !== lesson.id && l.category === lesson.category)
    .slice(0, 3);
  const fallback = lessons.filter((l) => l.id !== lesson.id).slice(0, 3);
  const suggestions = related.length ? related : fallback;

  return (
    <main className="pb-10">
      {/* Hero */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: `linear-gradient(135deg, ${lesson.hero.from}, ${lesson.hero.to})`,
        }}
      >
        <div className="container-page py-12 sm:py-16">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white"
          >
            ← All lessons
          </Link>
          <div className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-white/15 text-5xl backdrop-blur">
              {lesson.hero.emoji}
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip bg-white/20 text-white">
                  {lesson.category}
                </span>
                <LevelBadge level={lesson.level} />
              </div>
              <h1 className="mt-3 max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                {lesson.title}
              </h1>
              <p className="mt-2 text-white/80">
                {new Date(lesson.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {lesson.minutes} min read
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page mt-8 max-w-3xl">
        <SectionNav />

        {/* Article */}
        <section id="article" className="scroll-mt-32">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-extrabold text-ink">
              Article
            </h2>
            <AudioButton text={articleText} label="Listen to article" />
          </div>
          <article className="prose-article rounded-2xl bg-white p-6 shadow-card ring-1 ring-black/5 sm:p-8">
            {lesson.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </article>
        </section>

        {/* Quiz */}
        {lesson.quiz?.length > 0 && (
          <section id="quiz" className="mt-12 scroll-mt-32">
            <h2 className="mb-2 font-display text-2xl font-extrabold text-ink">
              Comprehension Quiz
            </h2>
            <p className="mb-5 text-slate-500">
              Check how well you understood the article. Score 100% to complete
              the lesson automatically.
            </p>
            <Quiz items={lesson.quiz} onComplete={markComplete} />
          </section>
        )}

        {/* Vocabulary */}
        <section id="vocabulary" className="mt-12 scroll-mt-32">
          <h2 className="mb-2 font-display text-2xl font-extrabold text-ink">
            Vocabulary
          </h2>
          <p className="mb-5 text-slate-500">
            Tap the speaker on any word to hear it used in a sentence.
          </p>
          <Vocabulary items={lesson.vocabulary} />
        </section>

        {/* Discussion */}
        <section id="discussion" className="mt-12 scroll-mt-32">
          <h2 className="mb-2 font-display text-2xl font-extrabold text-ink">
            Discussion
          </h2>
          <p className="mb-5 text-slate-500">
            Practice speaking by answering these questions with your tutor or a
            partner.
          </p>
          <DiscussionList items={lesson.discussion} />

          <h3 className="mb-3 mt-8 font-display text-lg font-bold text-ink">
            Further discussion
          </h3>
          <DiscussionList items={lesson.further} />
        </section>

        {/* Complete */}
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-card ring-1 ring-black/5">
          <p className="font-display text-lg font-bold text-ink">
            {done ? "Lesson completed! 🎉" : "Finished the lesson?"}
          </p>
          <p className="max-w-md text-sm text-slate-500">
            {done
              ? "Great job. Keep your streak going with another AI story."
              : "Mark it as complete to track your progress."}
          </p>
          <button
            onClick={() => toggle?.(lesson.id)}
            className={done ? "btn-ghost" : "btn-primary"}
          >
            {done ? "↩ Mark as not done" : "✓ Mark as complete"}
          </button>
        </div>

        {/* Related */}
        <section className="mt-14">
          <h2 className="mb-5 font-display text-xl font-extrabold text-ink">
            Keep reading
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {suggestions.map((l) => (
              <LessonCard key={l.id} lesson={l} done={isDone?.(l.id)} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
