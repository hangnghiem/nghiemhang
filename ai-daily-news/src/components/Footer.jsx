export default function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-white">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          <span className="font-display font-extrabold text-ink">
            AI Daily<span className="text-brand-500">News</span>
          </span>{" "}
          — Learn English with the latest AI stories.
        </p>
        <p className="text-xs">
          A demo project inspired by Engoo Daily News. Articles are illustrative.
        </p>
      </div>
    </footer>
  );
}
