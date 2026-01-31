function stripBrackets(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*\([^)]*\)/g, '').trim();
}

export function ReportSummary({ summary }) {
  if (!summary) return null;

  const right = summary.what_went_right ?? [];
  const wrong = summary.what_went_wrong ?? [];

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5">
      <h2 className="text-base font-bold uppercase tracking-wider text-slate-400 mb-5">
        Report summary
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-xl" aria-hidden>✓</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-emerald-400">
              What went right
            </h3>
          </div>
          <ul className="space-y-3">
            {right.map((item, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                {item.phase != null && (
                  <span className="shrink-0 w-7 h-7 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                    {item.phase}
                  </span>
                )}
                <span className="text-base text-slate-200 leading-snug">{stripBrackets(item.statement ?? item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <span className="text-amber-400 text-xl" aria-hidden>!</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-amber-400">
              What went wrong
            </h3>
          </div>
          <ul className="space-y-3">
            {wrong.map((item, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                {item.phase != null && (
                  <span className="shrink-0 w-7 h-7 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold">
                    {item.phase}
                  </span>
                )}
                <span className="text-base text-slate-200 leading-snug">{stripBrackets(item.statement ?? item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
