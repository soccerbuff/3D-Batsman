export function MetricCard({ label, value, unit, desc }) {
  return (
    <div className="flex flex-col p-2 rounded hover:bg-gray-50/80 transition-colors">
      <span className="text-xs uppercase font-semibold text-gray-500 tracking-wider h-4 overflow-hidden text-ellipsis whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-lg font-mono font-semibold text-gray-800">
          {value ?? '--'}
        </span>
        {unit && <span className="text-xs text-gray-500 font-medium">{unit}</span>}
      </div>
      {desc && <span className="text-xs text-gray-500 mt-0.5">{desc}</span>}
    </div>
  );
}
