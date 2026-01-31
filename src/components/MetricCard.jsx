export function MetricCard({ label, value, unit, desc }) {
  return (
    <div className="flex flex-col p-2 rounded hover:bg-white/5 transition-colors">
      <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider h-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-lg font-mono font-semibold text-slate-200">
          {value ?? '--'}
        </span>
        {unit && <span className="text-xs text-slate-600 font-medium">{unit}</span>}
      </div>
      {desc && <span className="text-xs text-slate-600 mt-0.5">{desc}</span>}
    </div>
  );
}
