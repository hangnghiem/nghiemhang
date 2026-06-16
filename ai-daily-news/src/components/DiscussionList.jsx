export default function DiscussionList({ items }) {
  return (
    <ol className="space-y-3">
      {items.map((q, i) => (
        <li
          key={i}
          className="flex gap-4 rounded-2xl bg-white p-4 shadow-card ring-1 ring-black/5"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 font-display font-bold text-brand-600">
            {i + 1}
          </span>
          <p className="self-center text-slate-700">{q}</p>
        </li>
      ))}
    </ol>
  );
}
