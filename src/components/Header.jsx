export function Header({ meta }) {
  const shotType = meta?.shot_type ?? 'cover_drive';
  const view = meta?.view ?? 'side';
  const shotLabel = shotType.replace(/_/g, ' ');
  const viewLabel = view === 'side' ? 'Side View' : `${view} view`;

  return (
    <header className="sticky top-0 z-20 border-b border-border-dim bg-white backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-start">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center font-bold text-base text-gray-900 shrink-0">
            3D
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 text-left">
              Batting Analysis
            </h1>
            <p className="text-sm text-gray-600 capitalize text-left">
              3D · {viewLabel} · {shotLabel}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
