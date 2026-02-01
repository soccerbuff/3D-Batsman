function stripBrackets(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*\([^)]*\)/g, '').trim();
}

export function ReportSummary({ summary }) {
  if (!summary) return null;

  const right = summary.what_went_right ?? [];
  const wrong = summary.what_went_wrong ?? [];
  const insights = summary.insights;

  return (
    <section className="bg-white border border-border-dim rounded-xl p-5 shadow-lg">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-600 mb-5">
        Report summary
      </h2>
      {insights && (
        <p className="text-gray-800 leading-relaxed mb-6 pb-6 border-b border-border-dim">
          {insights}
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <span className="text-emerald-600 text-xl" aria-hidden>✓</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-emerald-600">
              What went right
            </h3>
          </div>
          <ul className="space-y-3">
            {right.map((item, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-md">
                {item.phase != null && (
                  <span className="shrink-0 w-7 h-7 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold">
                    {item.phase}
                  </span>
                )}
                <span className="text-base text-gray-800 leading-snug">{stripBrackets(item.statement ?? item)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center">
              <span className="text-amber-600 text-xl" aria-hidden>!</span>
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-amber-600">
              What went wrong
            </h3>
          </div>
          <ul className="space-y-3">
            {wrong.map((item, i) => (
              <li key={i} className="flex gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 shadow-md">
                {item.phase != null && (
                  <span className="shrink-0 w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-bold">
                    {item.phase}
                  </span>
                )}
                <span className="text-base text-gray-800 leading-snug">{stripBrackets(item.statement ?? item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
