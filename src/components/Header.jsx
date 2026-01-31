export function Header({ meta }) {
  const shotType = meta?.shot_type ?? 'cover_drive';
  const view = meta?.view ?? 'side';
  const fps = meta?.frame_rate_fps ?? 90;
  const nFrames = meta?.n_pose_frames ?? 376;

  return (
    <header className="sticky top-0 z-20 border-b border-border-dim bg-dashboard-bg/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-base">
            3D
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-200">
              3D Batsman Dashboard
            </h1>
            <p className="text-sm text-slate-500 capitalize">
              {shotType.replace('_', ' ')} · {view} view · {fps} fps · {nFrames} frames
            </p>
          </div>
        </div>
        <span className="text-sm font-mono text-slate-500">Cover drive · Side</span>
      </div>
    </header>
  );
}
