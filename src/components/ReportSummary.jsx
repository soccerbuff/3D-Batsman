function stripBrackets(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*\([^)]*\)/g, '').trim();
}

export function ReportSummary({ summary, why }) {
  if (!summary) return null;

  const right = summary.what_went_right ?? [];
  const wrong = summary.what_went_wrong ?? [];
  const insights = summary.insights;
  const whyRight = why?.what_went_right ?? [];
  const whyWrong = why?.what_went_wrong ?? [];

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
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden />
            What went right
          </h3>
          <ul className="space-y-3">
            {right.map((item, i) => {
              const evidence = whyRight[i];
              const heading = evidence?.point ?? item.statement ?? item;
              const phase = evidence?.phase ?? item.phase;
              return (
                <li key={i} className="flex flex-nowrap items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-md">
                  {phase != null && phase !== '' && (
                    <span className="shrink-0 px-2.5 py-1.5 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold whitespace-nowrap">
                      {phase}
                    </span>
                  )}
                  <span className="text-base text-gray-800 leading-snug min-w-0 truncate">{stripBrackets(heading)}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden />
            What went wrong
          </h3>
          <ul className="space-y-3">
            {wrong.map((item, i) => {
              const evidence = whyWrong[i];
              const heading = evidence?.point ?? item.statement ?? item;
              const phase = evidence?.phase ?? item.phase;
              return (
                <li key={i} className="flex flex-nowrap items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 shadow-md">
                  {phase != null && phase !== '' && (
                    <span className="shrink-0 px-2.5 py-1.5 rounded-md bg-amber-100 flex items-center justify-center text-amber-600 text-sm font-bold whitespace-nowrap">
                      {phase}
                    </span>
                  )}
                  <span className="text-base text-gray-800 leading-snug min-w-0 truncate">{stripBrackets(heading)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
