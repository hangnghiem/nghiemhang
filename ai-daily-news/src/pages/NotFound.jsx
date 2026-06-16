import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="container-page grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="font-display text-7xl font-extrabold text-brand-200">404</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-ink">
          Lesson not found
        </h1>
        <p className="mt-2 text-slate-500">
          That AI story may have moved or never existed.
        </p>
        <Link to="/" className="btn-primary mt-6">
          Back to Daily News
        </Link>
      </div>
    </main>
  );
}
