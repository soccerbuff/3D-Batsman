import { useState } from 'react';

function stripBrackets(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/\s*\([^)]*\)/g, '').trim();
}

export function ReportWhy({ why }) {
  if (!why) return null;

  const right = why.what_went_right ?? [];
  const wrong = why.what_went_wrong ?? [];

  return (
    <section className="bg-white border border-border-dim rounded-xl p-5 shadow-lg">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-600 mb-5">
        Why (evidence & citations)
      </h2>

      <div className="space-y-6">
        {right.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              What went right
            </h3>
            <div className="space-y-3">
              {right.map((item, i) => (
                <WhyCard key={`r-${i}`} item={item} type="right" />
              ))}
            </div>
          </div>
        )}
        {wrong.length > 0 && (
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-warning mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-warning" />
              What went wrong
            </h3>
            <div className="space-y-3">
              {wrong.map((item, i) => (
                <WhyCard key={`w-${i}`} item={item} type="wrong" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Popover on hover; click to pin (like Ashwat’s pattern). */
function CitationPopover({ citation }) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const show = pinned || hover;

  if (!citation) return null;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onClick={() => setPinned((p) => !p)}
        className="inline-flex items-center justify-center w-6 h-6 rounded text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-panel"
        aria-label="Research sources"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>
      {show && (
        <div className="absolute left-0 bottom-full mb-2 w-80 max-w-[calc(100vw-2rem)] z-30 bg-white text-gray-800 rounded-lg shadow-xl border border-border-dim p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Research sources
          </p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{citation}</p>
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            className="mt-2 text-xs text-gray-500 hover:text-gray-700 underline focus:outline-none"
          >
            {pinned ? 'Unpin' : 'Click to pin this popover open'}
          </button>
        </div>
      )}
    </div>
  );
}

function WhyCard({ item, type }) {
  const isRight = type === 'right';

  return (
    <div
      className={`rounded-xl overflow-hidden border shadow-md ${
        isRight
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-amber-200 bg-amber-50'
      }`}
    >
      <div className="px-4 py-4">
        <div className="flex items-start gap-3 mb-3">
          <span
            className={`shrink-0 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center justify-center ${
              isRight ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
            title={item.phase}
          >
            {item.phase}
          </span>
          <span className="flex-1 text-base font-medium text-gray-800 min-w-0 break-words">
            {stripBrackets(item.point)}
          </span>
        </div>
        {item.mechanistic_link && (
          <p className="text-base text-gray-700 leading-relaxed pb-2">
            {item.mechanistic_link}
          </p>
        )}
        <p className="text-base text-gray-600 leading-relaxed pb-3">
          {item.explanation}
        </p>
        {item.data && (
          <div className="rounded-lg bg-white border border-border-dim p-3 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Data
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-gray-600">
              {Object.entries(item.data).map(([key, value]) => (
                <span key={key} className="contents">
                  <dt className="font-medium text-gray-500 truncate">{key}</dt>
                  <dd className="font-mono text-gray-700 truncate">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </dd>
                </span>
              ))}
            </dl>
          </div>
        )}
        {item.citation && (
          <div className="flex items-center gap-2 pt-2 border-t border-border-dim">
            <CitationPopover citation={item.citation} />
            <span className="text-xs text-gray-500">View source</span>
          </div>
        )}
      </div>
    </div>
  );
}
