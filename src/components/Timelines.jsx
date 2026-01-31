export function Timelines({ timelines }) {
  if (!timelines) return null;

  const { sequencing, weight_transfer_pattern, mean_bat_speed_P3 } = timelines;

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5">
      <h2 className="text-base font-bold uppercase tracking-wider text-slate-400 mb-4">
        Timelines & metrics
      </h2>
      <div className="space-y-6">
        {sequencing && (
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">
              Sequencing
            </h3>
            {sequencing.method && (
              <p className="text-sm text-slate-500 mb-3">{sequencing.method}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-sm bg-indigo-500/20 text-indigo-300 rounded px-2 py-1">
                Archetype: {sequencing.archetype?.replace('_', ' ')}
              </span>
              {sequencing.peak_order?.map((p) => (
                <span key={p} className="text-sm text-slate-400">
                  {p.replace('_', ' ')} (frame {sequencing.peak_frames?.[p] ?? '—'})
                </span>
              ))}
            </div>
            {sequencing.inter_peak_gaps_ms && (
              <p className="text-xs text-slate-600">
                Trunk→lead arm: {sequencing.inter_peak_gaps_ms.trunk_to_lead_arm?.toFixed(0)} ms · 
                Lead arm→pelvis: {sequencing.inter_peak_gaps_ms.lead_arm_to_pelvis?.toFixed(0)} ms
              </p>
            )}
          </div>
        )}

        {weight_transfer_pattern && (
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
              Weight transfer pattern
            </h3>
            {weight_transfer_pattern.note_on_overlap && (
              <p className="text-xs text-slate-600 mb-3">{weight_transfer_pattern.note_on_overlap}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {weight_transfer_pattern.P2 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">P2</div>
                  <div className="text-sm text-slate-400">
                    Back foot WT: {(weight_transfer_pattern.P2.back_foot_WT_start * 100).toFixed(1)}% → {(weight_transfer_pattern.P2.back_foot_WT_end * 100).toFixed(1)}%
                  </div>
                </div>
              )}
              {weight_transfer_pattern.P3 && (
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase mb-1">P3</div>
                  <div className="text-sm text-slate-400">
                    Back foot WT: {(weight_transfer_pattern.P3.back_foot_WT_start * 100).toFixed(1)}% → {(weight_transfer_pattern.P3.back_foot_WT_end * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mean_bat_speed_P3 && (
          <div className="bg-card border border-white/5 rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mean bat speed (P3)
            </h3>
            <p className="text-xl font-mono text-slate-200">
              {mean_bat_speed_P3.value?.toFixed(1)} <span className="text-sm text-slate-500">{mean_bat_speed_P3.unit?.replace('_', '/')}</span>
            </p>
            {mean_bat_speed_P3.interpretation && (
              <p className="text-sm text-slate-500 mt-2">{mean_bat_speed_P3.interpretation}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
