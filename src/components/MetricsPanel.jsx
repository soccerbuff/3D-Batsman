import { MetricCard } from './MetricCard';

export function MetricsPanel({ metrics, error }) {
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 mb-2 text-base">Error loading metrics</div>
        <div className="text-sm text-gray-600">{error}</div>
        <div className="text-xs text-gray-500 mt-2">Ensure side_metrics.json is in public/</div>
      </div>
    );
  }
  if (!metrics) return <div className="p-8 text-center text-gray-600 text-base">Loading metrics…</div>;

  const getValue = (obj, path) => {
    if (!obj) return null;
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return null;
    }
    return value;
  };

  const stanceWidth = getValue(metrics, 'stance_width.value');
  const trunkLean = getValue(metrics, 'trunk_forward_lean.value');
  const leftKnee = getValue(metrics, 'left_knee_angle.value');
  const rightKnee = getValue(metrics, 'right_knee_angle.value');
  const minWT = getValue(metrics, 'weight_transfer.summary.min_WT');
  const maxWT = getValue(metrics, 'weight_transfer.summary.max_WT');
  const handedness = getValue(metrics, 'weight_transfer.summary.detected_handedness');
  const backliftAngle = getValue(metrics, 'backlift_angle.value');
  const meanBatSpeed = getValue(metrics, 'bat_swing_speed_P3.bat_swing_speed_P3_mean');

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-4">
      <Section title="Stance & Balance" color="text-gray-800" border="border-teal-500/30">
        <MetricCard label="Stance Width" value={stanceWidth != null ? stanceWidth.toFixed(1) : null} unit={getValue(metrics, 'stance_width.unit')} />
        <MetricCard label="Trunk Lean" value={trunkLean != null ? trunkLean.toFixed(1) : null} unit={getValue(metrics, 'trunk_forward_lean.unit')} />
        <MetricCard label="Left Knee" value={leftKnee != null ? leftKnee.toFixed(1) : null} unit={getValue(metrics, 'left_knee_angle.unit')} />
        <MetricCard label="Right Knee" value={rightKnee != null ? rightKnee.toFixed(1) : null} unit={getValue(metrics, 'right_knee_angle.unit')} />
      </Section>

      <Section title="Weight Transfer & Movement" color="text-gray-800" border="border-orange-500/30">
        <MetricCard label="Front Foot Peak" value={minWT != null ? ((1 - minWT) * 100).toFixed(1) : null} unit="%" />
        <MetricCard label="Back Foot Peak" value={maxWT != null ? (maxWT * 100).toFixed(1) : null} unit="%" />
        <MetricCard label="Handedness" value={handedness ? handedness.charAt(0).toUpperCase() + handedness.slice(1) : null} unit="" />
      </Section>

      <Section title="Swing & Impact" color="text-gray-800" border="border-accent/50">
        <MetricCard label="Backlift Angle" value={backliftAngle != null ? backliftAngle.toFixed(1) : null} unit={getValue(metrics, 'backlift_angle.unit')} desc="Measured relative to vertical; smaller angle = higher backlift." />
        <MetricCard label="Mean Bat Speed" value={meanBatSpeed != null ? meanBatSpeed.toFixed(1) : null} unit={getValue(metrics, 'bat_swing_speed_P3.unit')?.replace('_', '/')} />
      </Section>
    </div>
  );
}

function Section({ title, color, border, children }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className={`text-sm font-bold uppercase tracking-widest pl-1 ${color}`}>{title}</h3>
      <div className={`grid grid-cols-2 gap-3 p-3 rounded-xl bg-white border ${border}`}>
        {children}
      </div>
    </div>
  );
}
