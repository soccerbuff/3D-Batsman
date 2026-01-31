import { useState } from 'react';

function stripBrackets(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*\([^)]*\)/g, '').trim();
}

export function ReportWhy({ why }) {
  if (!why) return null;

  const right = why.what_went_right ?? [];
  const wrong = why.what_went_wrong ?? [];
  const [expanded, setExpanded] = useState(null);

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5">
      <h2 className="text-base font-bold uppercase tracking-wider text-slate-400 mb-5">
        Why (evidence & citations)
      </h2>

      <div className="space-y-6">
        {right.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              What went right
            </h3>
            <div className="space-y-2">
              {right.map((item, i) => (
                <WhyCard
                  key={`r-${i}`}
                  item={item}
                  type="right"
                  id={`r-${i}`}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              ))}
            </div>
          </div>
        )}
        {wrong.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              What went wrong
            </h3>
            <div className="space-y-2">
              {wrong.map((item, i) => (
                <WhyCard
                  key={`w-${i}`}
                  item={item}
                  type="wrong"
                  id={`w-${i}`}
                  expanded={expanded}
                  setExpanded={setExpanded}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function WhyCard({ item, type, id, expanded, setExpanded }) {
  const isOpen = expanded === id;
  const isRight = type === 'right';

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-colors ${
        isRight
          ? 'border-emerald-500/25 bg-emerald-500/5 hover:bg-emerald-500/10'
          : 'border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10'
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded(isOpen ? null : id)}
        className="w-full px-4 py-4 text-left flex items-center gap-3"
      >
        <span
          className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center justify-center ${
            isRight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
          }`}
          title={item.phase}
        >
          {item.phase}
        </span>
        <span className="flex-1 text-base font-medium text-slate-200 min-w-0 break-words">
          {stripBrackets(item.point)}
        </span>
        <span
          className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          aria-hidden
        >
          ▶
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-white/5">
          {item.mechanistic_link && (
            <p className="text-base text-slate-300 leading-relaxed pt-4 pb-2">
              {item.mechanistic_link}
            </p>
          )}
          <p className="text-base text-slate-400 leading-relaxed pt-2 pb-3">
            {item.explanation}
          </p>
          {item.data && (
            <div className="rounded-lg bg-black/20 p-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Data
              </p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-slate-400">
                {Object.entries(item.data).map(([key, value]) => (
                  <span key={key} className="contents">
                    <dt className="font-medium text-slate-500 truncate">{key}</dt>
                    <dd className="font-mono text-slate-300 truncate">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </dd>
                  </span>
                ))}
              </dl>
            </div>
          )}
          {item.citation && (
            <p className="text-sm text-slate-500 italic border-l-2 border-slate-600 pl-3">
              {item.citation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
