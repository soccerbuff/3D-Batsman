/**
 * Legend: metric key → short description (how calculated / what it means).
 * LEGEND_DISPLAY_NAMES: metric key → card title (e.g. "Stance Width", "Trunk Lean").
 */
const LEGEND_DISPLAY_NAMES = {
  archetype: 'Archetype',
  trunk_peak_frame: 'Trunk peak frame',
  lead_arm_peak_frame: 'Lead arm peak frame',
  pelvis_peak_frame: 'Pelvis peak frame',
  stance_width: 'Stance width',
  trunk_forward_lean: 'Trunk lean',
  left_knee_angle: 'Left knee',
  right_knee_angle: 'Right knee',
  weight_transfer: 'Weight transfer',
  weight_transfer_rate: 'Weight transfer rate',
  bat_backlift_angle: 'Backlift angle',
  mean_bat_swing_speed_P3: 'Mean bat speed',
  pelvis_rotation_deg: 'Pelvis rotation',
  trunk_rotation_deg: 'Trunk rotation',
  hip_shoulder_separation_deg: 'Hip–shoulder separation',
  pelvis_rotation_angular_velocity_deg_s: 'Pelvis angular velocity',
  trunk_rotation_angular_velocity_deg_s: 'Trunk angular velocity',
  lead_knee_flexion_deg: 'Lead knee flexion',
  lead_elbow_angle_deg: 'Lead elbow angle',
};

const METRIC_LEGEND = {
  archetype: 'Kinetic chain pattern: how segment rotations are ordered (e.g. arm dominant = trunk → lead arm → pelvis).',
  trunk_peak_frame: 'Frame at which trunk rotation velocity reaches its maximum during the downswing.',
  lead_arm_peak_frame: 'Frame at which lead-arm rotation velocity reaches its maximum during the downswing.',
  pelvis_peak_frame: 'Frame at which pelvis rotation velocity reaches its maximum during the downswing.',
  stance_width: 'Distance between the feet at the start of the batting stance.',
  trunk_forward_lean: 'Forward lean angle of the torso and upper body.',
  left_knee_angle: 'Angle of the left knee joint during stance.',
  right_knee_angle: 'Angle of the right knee joint during stance.',
  weight_transfer: 'Proportion of body weight on the back foot (0–1); decrease over time indicates forward shift. Front-foot peak is the maximum weight on the front foot during swing.',
  weight_transfer_rate: 'Rate of change of weight transfer; negative = weight moving to front foot.',
  bat_backlift_angle: 'Angle of the bat during the backlift phase before the swing, relative to vertical.',
  mean_bat_swing_speed_P3: 'Average speed of the bat during the downswing phase (P3).',
  pelvis_rotation_deg: 'Pelvis rotation angle (degrees) in the transverse plane; positive = opening toward the bowler.',
  trunk_rotation_deg: 'Trunk rotation angle (degrees) relative to pelvis; indicates upper-body separation.',
  hip_shoulder_separation_deg: 'Angle between hip and shoulder lines (degrees); measures pelvis–trunk separation.',
  pelvis_rotation_angular_velocity_deg_s: 'Rate of change of pelvis rotation (deg/s).',
  trunk_rotation_angular_velocity_deg_s: 'Rate of change of trunk rotation (deg/s).',
  lead_knee_flexion_deg: 'Lead (front) knee angle (degrees); 180° = straight, lower = more flexed.',
  lead_elbow_angle_deg: 'Lead elbow angle (degrees); used in arm kinematics.',
};

/**
 * Format metric key for display: title case, correct units.
 * Angular velocity is degrees per second → °/s (not "deg s" or "° s").
 */
function formatMetricLabel(key) {
  const withUnit = key
    .replace(/_deg_s\b/g, '_°/s')   // angular velocity: deg_s → °/s (degrees per second)
    .replace(/_deg\b/g, '_°')        // angle: deg → °
    .replace(/_/g, ' ')
    .replace(/\s°\/s/g, ' °/s')
    .replace(/\s°/g, ' °')
    .replace(/\bP3\b/g, 'P3 (downswing)');
  return withUnit
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatArchetype(value) {
  if (!value || typeof value !== 'string') return value;
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const PEAK_LABELS = {
  trunk_peak_frame: 'Trunk',
  lead_arm_peak_frame: 'Lead arm',
  pelvis_peak_frame: 'Pelvis',
};

const PHASES = ['P0', 'P2', 'P3'];

const PHASE_LABELS = { P0: 'Stance', P2: 'Load', P3: 'Downswing' };

function formatPhaseValue(stat) {
  if (!stat || typeof stat !== 'object') return '—';
  const mean = stat.mean;
  if (mean == null) return '—';
  const std = stat.std;
  if (std != null && typeof std === 'number') {
    return `${Number(mean).toFixed(2)} ± ${Number(std).toFixed(2)}`;
  }
  return Number(mean).toFixed(2);
}

export function Timelines({ timelines, derivedMetrics }) {
  if (!timelines) return null;

  const { sequencing, weight_transfer_pattern, mean_bat_speed_P3, data_considered } = timelines;

  const allMetricKeys = [
    ...(Array.isArray(data_considered?.derived_metrics) ? data_considered.derived_metrics : []),
    ...(Array.isArray(data_considered?.side_metrics) ? data_considered.side_metrics : []),
  ];

  const phaseMetrics = derivedMetrics?.phase_metrics ?? {};
  const derivedList = Array.isArray(data_considered?.derived_metrics) ? data_considered.derived_metrics : [];
  const metricsWithPhaseData = derivedList.filter((key) =>
    PHASES.some((phase) => phaseMetrics[phase]?.[key] && typeof phaseMetrics[phase][key] === 'object' && 'mean' in phaseMetrics[phase][key])
  );

  return (
    <section className="bg-white border border-border-dim rounded-xl p-5 shadow-lg">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-600 mb-4">
        Timelines & metrics
      </h2>

      {/* How metrics are shown */}
      <div className="mb-6 rounded-lg bg-white border border-border-dim p-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">
          How metrics are shown
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Metrics are presented by phase (P0 stance, P2 load, P3 downswing, PostP3 follow-through). 
          Sequencing uses <strong className="text-gray-700">peak frame numbers</strong>—the video frame at which each segment’s rotation velocity is greatest. 
          The <strong className="text-gray-700">archetype</strong> summarizes the order of those peaks (e.g. trunk → lead arm → pelvis). 
          Values are from side-view pose and metric inputs only; no normative thresholds are applied.
        </p>
      </div>

      <div className="space-y-6">
        {/* Sequencing & kinetic chain — formatted */}
        {sequencing && (
          <div className="bg-white border border-border-dim rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">
              Sequencing & kinetic chain
            </h3>
            {sequencing.coach_point && (
              <div className="mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Finding</span>
                <p className="text-base font-medium text-gray-800 mt-0.5">{sequencing.coach_point}</p>
              </div>
            )}
            {sequencing.archetype && (
              <div className="mb-4 inline-flex items-center rounded-lg border-2 border-accent/50 bg-orange-50 px-4 py-2">
                <span className="text-xs font-bold uppercase tracking-wider text-accent/90">Archetype</span>
                <span className="ml-2 text-base font-semibold text-gray-700">
                  {formatArchetype(sequencing.archetype)}
                </span>
              </div>
            )}
            {sequencing.peak_order?.length > 0 && sequencing.peak_frames && (
              <div className="flex flex-wrap items-center gap-1 mb-3">
                {sequencing.peak_order.map((key, i) => {
                  const label = PEAK_LABELS[key] ?? key.replace(/_/g, ' ');
                  const frame = sequencing.peak_frames[key];
                  const isLast = i === sequencing.peak_order.length - 1;
                  return (
                    <span key={key} className="flex items-center gap-1">
                      <span className="rounded-md bg-white border border-border-dim px-2.5 py-1.5 text-sm font-medium text-gray-800">
                        {label} <span className="font-mono text-accent">({frame ?? '—'})</span>
                      </span>
                      {!isLast && (
                        <span className="text-accent px-0.5" aria-hidden="true">
                          →
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            )}
            {sequencing.mechanistic_link && (
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">What it means</span>
                <p className="text-sm text-gray-700 leading-relaxed mt-0.5">{sequencing.mechanistic_link}</p>
              </div>
            )}
            {sequencing.data_backing && (
              <div className="mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Data backing</span>
                <p className="text-sm text-gray-500 leading-relaxed mt-0.5">{sequencing.data_backing}</p>
              </div>
            )}
            {sequencing.citation && (
              <p className="text-sm text-gray-500 italic border-l-2 border-gray-300 pl-3 mt-2">
                {sequencing.citation}
              </p>
            )}
            {sequencing.inter_peak_gaps_ms && (
              <p className="text-xs text-gray-500 mt-2">
                Trunk→lead arm: {sequencing.inter_peak_gaps_ms.trunk_to_lead_arm?.toFixed(0)} ms ·
                Lead arm→pelvis: {sequencing.inter_peak_gaps_ms.lead_arm_to_pelvis?.toFixed(0)} ms
              </p>
            )}
          </div>
        )}

        {weight_transfer_pattern && (
          <div className="bg-white border border-border-dim rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-2">
              Weight transfer pattern
            </h3>
            {weight_transfer_pattern.note_on_overlap && (
              <p className="text-xs text-gray-500 mb-3">{weight_transfer_pattern.note_on_overlap}</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {weight_transfer_pattern.P2 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">P2</div>
                  <div className="text-sm text-gray-600">
                    Back foot WT: {(weight_transfer_pattern.P2.back_foot_WT_start * 100).toFixed(1)}% → {(weight_transfer_pattern.P2.back_foot_WT_end * 100).toFixed(1)}%
                  </div>
                </div>
              )}
              {weight_transfer_pattern.P3 && (
                <div>
                  <div className="text-xs font-bold text-gray-500 uppercase mb-1">P3</div>
                  <div className="text-sm text-gray-600">
                    Back foot WT: {(weight_transfer_pattern.P3.back_foot_WT_start * 100).toFixed(1)}% → {(weight_transfer_pattern.P3.back_foot_WT_end * 100).toFixed(1)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {mean_bat_speed_P3 && (
          <div className="bg-white border border-border-dim rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-1">
              Mean bat speed (P3)
            </h3>
            <p className="text-xl font-mono text-gray-800">
              {mean_bat_speed_P3.value?.toFixed(1)} <span className="text-sm text-gray-500">{mean_bat_speed_P3.unit?.replace(/_/g, '/')}</span>
            </p>
            {mean_bat_speed_P3.interpretation && (
              <p className="text-sm text-gray-500 mt-2">{mean_bat_speed_P3.interpretation}</p>
            )}
          </div>
        )}

        {/* Data considered */}
        {data_considered && (data_considered.derived_metrics?.length > 0 || data_considered.side_metrics?.length > 0) && (
          <div className="bg-white border border-border-dim rounded-lg p-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-3">
              Data considered
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              The following metrics were used in this analysis. Derived metrics are computed from pose (e.g. Butterworth filtered); values below are phase-level mean ± std. Definitions are in the legend below.
            </p>
            {derivedList.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Derived (from pose — derived_metrics.json)</span>
                <ul className="mt-1.5 flex flex-wrap gap-2 mb-3">
                  {derivedList.map((key) => (
                    <li key={key} className="text-sm font-mono text-accent/90 bg-orange-50 rounded px-2 py-1">
                      {formatMetricLabel(key)}
                    </li>
                  ))}
                </ul>
                {metricsWithPhaseData.length > 0 && (
                  <div className="overflow-x-auto rounded-lg border border-border-dim">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead>
                        <tr className="border-b border-border-dim bg-gray-50">
                          <th className="text-left text-xs font-bold uppercase tracking-wider text-gray-500 px-3 py-2">Metric</th>
{PHASES.map((phase) => (
                              <th key={phase} className="text-center text-xs font-bold uppercase tracking-wider text-gray-500 px-3 py-2">
                                {phase} ({PHASE_LABELS[phase] ?? phase})
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {metricsWithPhaseData.map((key) => (
                          <tr key={key} className="border-b border-border-dim last:border-0">
                            <td className="px-3 py-2 font-mono text-gray-700/90 text-left">{formatMetricLabel(key)}</td>
                            {PHASES.map((phase) => (
                              <td key={phase} className="px-3 py-2 text-gray-600 text-center font-mono text-xs">
                                {formatPhaseValue(phaseMetrics[phase]?.[key])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {Array.isArray(data_considered.side_metrics) && data_considered.side_metrics.length > 0 && (
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-gray-800">Side metrics (from side_metrics.json)</span>
                <ul className="mt-1.5 flex flex-wrap gap-2">
                  {data_considered.side_metrics.map((key) => (
                    <li key={key} className="text-sm font-mono text-gray-800 bg-gray-100 border border-gray-300 rounded px-2 py-1">
                      {formatMetricLabel(key)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Legend: grid of cards — metric name: definition */}
        {(() => {
          const legendEntries = [];
          if (sequencing?.archetype && METRIC_LEGEND.archetype) {
            legendEntries.push({ key: 'archetype', title: LEGEND_DISPLAY_NAMES.archetype ?? 'Archetype', definition: METRIC_LEGEND.archetype });
          }
          if (sequencing?.peak_frames) {
            Object.keys(sequencing.peak_frames).forEach((k) => {
              if (METRIC_LEGEND[k]) {
                legendEntries.push({ key: k, title: LEGEND_DISPLAY_NAMES[k] ?? formatMetricLabel(k), definition: METRIC_LEGEND[k] });
              }
            });
          }
          [...new Set(allMetricKeys)].forEach((key) => {
            if (METRIC_LEGEND[key] && !legendEntries.some((e) => e.key === key)) {
              legendEntries.push({ key, title: LEGEND_DISPLAY_NAMES[key] ?? formatMetricLabel(key), definition: METRIC_LEGEND[key] });
            }
          });
          if (legendEntries.length === 0) return null;
          return (
            <div className="bg-white border border-border-dim rounded-lg p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-gray-600 shrink-0" aria-hidden />
                Legend
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {legendEntries.map(({ key, title, definition }) => (
                  <div
                    key={key}
                    className="rounded-lg border-2 border-gray-300 bg-white p-3 text-left shadow-md"
                  >
                    <p className="text-sm font-bold text-gray-800 mb-1">
                      {title}:
                    </p>
                    <p className="text-sm text-gray-700 leading-snug">
                      {definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
