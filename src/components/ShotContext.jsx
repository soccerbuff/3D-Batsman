export function ShotContext({ shot_context }) {
  if (!shot_context) return null;

  const { definition, power_intent, evaluation_principles } = shot_context;

  return (
    <section className="bg-white border border-border-dim rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-3">
        Shot context
      </h2>
      <p className="text-gray-700 text-sm leading-relaxed mb-4">{definition}</p>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Power intent:</span>
        <span className={`text-xs font-medium ${power_intent ? 'text-amber-600' : 'text-emerald-600'}`}>
          {power_intent ? 'Yes' : 'No (control/placement)'}
        </span>
      </div>
      {evaluation_principles?.length > 0 && (
        <ul className="space-y-1.5">
          {evaluation_principles.map((principle, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
              <span className="text-gray-500 mt-0.5">•</span>
              {principle}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
