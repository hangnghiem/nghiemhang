import AudioButton from "./AudioButton.jsx";

export default function Vocabulary({ items }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((v) => (
        <li
          key={v.word}
          className="rounded-2xl bg-white p-5 shadow-card ring-1 ring-black/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-lg font-semibold text-ink">
                {v.word}
              </p>
              <p className="text-sm text-slate-400">
                {v.phonetic} ·{" "}
                <span className="italic text-brand-600">{v.pos}</span>
              </p>
            </div>
            <AudioButton text={`${v.word}. ${v.example}`} small />
          </div>
          <p className="mt-3 text-slate-700">{v.definition}</p>
          <p className="mt-2 border-l-2 border-brand-200 pl-3 text-sm italic text-slate-500">
            “{v.example}”
          </p>
        </li>
      ))}
    </ul>
  );
}
