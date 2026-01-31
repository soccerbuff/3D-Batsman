export function ShotContext({ shot_context }) {
  if (!shot_context) return null;

  const { definition, power_intent, evaluation_principles } = shot_context;

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
        Shot context
      </h2>
      <p className="text-slate-300 text-sm leading-relaxed mb-4">{definition}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-slate-500">Power intent:</span>
        <span className={`text-xs font-medium ${power_intent ? 'text-amber-400' : 'text-emerald-400'}`}>
          {power_intent ? 'Yes' : 'No (control/placement)'}
        </span>
      </div>
      {evaluation_principles?.length > 0 && (
        <ul className="space-y-1.5">
          {evaluation_principles.map((principle, i) => (
            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
              <span className="text-slate-600 mt-0.5">•</span>
              {principle}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
