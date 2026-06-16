import { Link, NavLink } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 font-display text-lg font-extrabold text-white shadow-card">
        A
      </span>
      <span className="font-display text-lg font-extrabold tracking-tight text-ink">
        AI Daily<span className="text-brand-500">News</span>
      </span>
    </Link>
  );
}

export default function Navbar({ completedCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-1 text-sm font-semibold text-slate-600 sm:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700 ${
                isActive ? "text-brand-700" : ""
              }`
            }
          >
            Daily News
          </NavLink>
          <a
            href="#categories"
            className="rounded-full px-4 py-2 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Topics
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 sm:inline-flex">
            ✓ {completedCount} completed
          </span>
          <button className="btn-primary text-sm">Sign up free</button>
        </div>
      </div>
    </header>
  );
}
