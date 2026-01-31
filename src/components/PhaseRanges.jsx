export function PhaseRanges({ phase_ranges, key_frames }) {
  if (!phase_ranges) return null;

  const phases = Object.entries(phase_ranges);
  const keyList = key_frames ? Object.entries(key_frames) : [];

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
        Phase ranges & key frames
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {phases.map(([name, range]) => (
          <div
            key={name}
            className="bg-card border border-white/5 rounded-lg p-3"
          >
            <div className="text-xs font-bold text-indigo-300">{name}</div>
            <div className="text-xs text-slate-500 mt-1">
              Frames {range.start_frame}–{range.end_frame ?? '…'}
            </div>
          </div>
        ))}
      </div>
      {keyList.length > 0 && (
        <div className="border-t border-white/5 pt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Key frames
          </h3>
          <div className="flex flex-wrap gap-2">
            {keyList.map(([label, frame]) => (
              <span
                key={label}
                className="text-xs bg-card border border-white/5 rounded px-2 py-1 text-slate-400"
              >
                {label.replace(/_/g, ' ')}: <span className="text-slate-300 font-mono">{frame}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
