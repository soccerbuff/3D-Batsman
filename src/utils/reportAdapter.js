/**
 * Normalizes cover_drive_report.json (detailed report) into the shape
 * expected by dashboard components. Also supports legacy cover_drive_side_dashboard.json.
 */

/** Resolve key_frames from either flat (report) or nested (side_dashboard) shape. */
function resolveKeyFrames(data) {
  const raw = data.visuals?.frames_to_review?.key_frames ?? data.key_frames ?? {};
  const peaks = raw.sequencing_peaks_P3 ?? raw;
  const onsets = raw.sequencing_onsets_P3 ?? raw;
  return {
    backlift_angle_frame: raw.backlift_angle_frame,
    pelvis_onset_frame: onsets.pelvis_onset_frame ?? raw.pelvis_onset_frame,
    trunk_peak_frame: peaks.trunk_peak_frame ?? raw.trunk_peak_frame,
    lead_arm_peak_frame: peaks.lead_arm_peak_frame ?? raw.lead_arm_peak_frame,
    pelvis_peak_frame: peaks.pelvis_peak_frame ?? raw.pelvis_peak_frame,
    hip_shoulder_separation_max_frame_P2: raw.hip_shoulder_separation_max_frame_P2,
  };
}

export function getStoryboardFrames(data) {
  const legacy = data.visuals?.storyboard_frames;
  if (Array.isArray(legacy) && legacy.length > 0) return legacy;

  const keyFrames = resolveKeyFrames(data);
  const frames = [];

  frames.push({ frame: 0, phase: 'P0', label: 'Stance reference' });
  const backlift = keyFrames.backlift_angle_frame ?? keyFrames.hip_shoulder_separation_max_frame_P2 ?? 229;
  frames.push({ frame: backlift, phase: 'P2', label: 'Max load / top of backlift' });
  const downswing = keyFrames.pelvis_onset_frame ?? 230;
  frames.push({ frame: downswing, phase: 'P3', label: 'Downswing start' });
  if (keyFrames.trunk_peak_frame != null) frames.push({ frame: keyFrames.trunk_peak_frame, phase: 'P3', label: 'Trunk peak' });
  if (keyFrames.lead_arm_peak_frame != null) frames.push({ frame: keyFrames.lead_arm_peak_frame, phase: 'P3', label: 'Lead-arm peak' });
  if (keyFrames.pelvis_peak_frame != null) frames.push({ frame: keyFrames.pelvis_peak_frame, phase: 'P3', label: 'Pelvis peak (end of P3)' });
  frames.push({ frame: 260, phase: 'PostP3', label: 'Follow-through start' });

  return frames.sort((a, b) => a.frame - b.frame);
}

export function getReportSummary(data) {
  const summary = data.report?.summary;
  if (!summary) return null;

  const right = summary.what_went_right;
  const wrong = summary.what_went_wrong ?? summary.what_to_improve;
  const sequencingArchetype =
    summary.sequencing_archetype ??
    data.report?.why?.sequencing_and_kinetic_chain?.archetype;
  if (Array.isArray(right) && (Array.isArray(wrong) || !wrong)) {
    const normalize = (item) => (typeof item === 'string' ? { statement: item } : item);
    return {
      what_went_right: right.map(normalize),
      what_went_wrong: (wrong ?? []).map(normalize),
      sequencing_archetype: sequencingArchetype,
    };
  }
  return summary;
}

function formatCitation(c) {
  if (!c || typeof c === 'string') return c;
  const parts = [c.authors, c.year, c.title].filter(Boolean);
  return parts.length ? parts.join(', ') : null;
}

export function getReportWhy(data) {
  const why = data.report?.why;
  if (!why) return null;

  // Dashboard format: what_went_right / what_went_wrong are arrays of { phase, coach_point, mechanistic_link?, data_backing, citation }
  if (Array.isArray(why.what_went_right) || Array.isArray(why.what_went_wrong)) {
    const mapItem = (item) => ({
      phase: item.phase ?? '',
      point: item.coach_point ?? item.point ?? '',
      mechanistic_link: item.mechanistic_link ?? '',
      explanation: item.data_backing ?? item.explanation ?? '',
      citation: formatCitation(item.citation) ?? item.citation,
      data: item.data,
    });
    return {
      what_went_right: (why.what_went_right ?? []).map(mapItem),
      what_went_wrong: (why.what_went_wrong ?? []).map(mapItem),
    };
  }

  const entries = Object.entries(why).filter(([, v]) => v && typeof v === 'object' && (v.observation || v.interpretation));
  const what_went_right = [];
  const what_went_wrong = [];
  const positiveKeys = ['backlift', 'weight_transfer', 'sequencing'];
  entries.forEach(([key, v]) => {
    const point = v.observation || key.replace(/_/g, ' ');
    const item = {
      phase: key.split('_')[0] || '',
      point,
      explanation: v.interpretation || '',
      citation: Array.isArray(v.research_support) ? v.research_support.join('; ') : v.research_support,
      data: v.data,
    };
    const isPositive = positiveKeys.some((k) => key.toLowerCase().includes(k)) && !key.includes('improve') && !key.includes('risk') && !key.includes('mechanics_control');
    if (isPositive) what_went_right.push(item);
    else what_went_wrong.push(item);
  });
  return { what_went_right, what_went_wrong };
}

export function getTimelines(data) {
  if (data.visuals?.timelines) return data.visuals.timelines;

  const summary = data.report?.summary;
  const dataConsidered = data.report?.data_considered;
  const whySeq = data.report?.why?.sequencing_and_kinetic_chain;
  const explicitPeaks =
    dataConsidered?.derived_metrics?.explicit_peak_frames_used?.P3 ?? data.key_frames;
  if (!summary && !dataConsidered && !whySeq) return null;

  // Sequencing: from summary or from dashboard's sequencing_and_kinetic_chain + key_frames / explicit_peak_frames_used
  let sequencing = null;
  const seq = summary?.sequencing_archetype ?? whySeq;
  const peakOrder = seq?.peak_order_by_frame ?? [];
  const peakFramesSource = explicitPeaks ?? seq?.peak_frames ?? data.key_frames ?? {};
  if (seq?.archetype || peakFramesSource?.trunk_peak_frame != null || peakFramesSource?.pelvis_peak_frame != null) {
    const archetype = seq?.archetype ?? whySeq?.archetype ?? 'arm_dominant';
    const peakFrames = peakFramesSource;
    const order = peakOrder.length
      ? peakOrder.map((entry) => (Array.isArray(entry) ? entry[0] : entry))
      : ['trunk_peak_frame', 'lead_arm_peak_frame', 'pelvis_peak_frame'].filter((k) => peakFrames[k] != null);
    const frames = {};
    if (peakFrames.trunk_peak_frame != null) frames.trunk_peak_frame = peakFrames.trunk_peak_frame;
    if (peakFrames.lead_arm_peak_frame != null) frames.lead_arm_peak_frame = peakFrames.lead_arm_peak_frame;
    if (peakFrames.pelvis_peak_frame != null) frames.pelvis_peak_frame = peakFrames.pelvis_peak_frame;
    sequencing = {
      method: whySeq?.data_backing ?? whySeq?.mechanistic_link ?? 'Derived from explicit peak frames (trunk, lead arm, pelvis).',
      archetype,
      peak_order: order.length ? order : Object.keys(frames),
      peak_frames: Object.keys(frames).length ? frames : undefined,
      coach_point: whySeq?.coach_point,
      mechanistic_link: whySeq?.mechanistic_link,
      data_backing: whySeq?.data_backing,
      citation: formatCitation(whySeq?.citation) ?? whySeq?.citation,
    };
  } else if (seq) {
    sequencing = {
      method: 'Derived from explicit peak frames (trunk, lead arm, pelvis).',
      archetype: seq.archetype,
      peak_order: peakOrder.map((entry) => (Array.isArray(entry) ? entry[0] : entry)),
      peak_frames: Object.fromEntries(
        peakOrder.map((entry) => (Array.isArray(entry) ? [entry[0], entry[1]] : [entry, null]))
      ),
    };
  }

  const wt = dataConsidered?.weight_transfer_phase_summaries ?? dataConsidered?.side_metrics?.weight_transfer;
  const weight_transfer_pattern = wt?.P2 || wt?.P3
    ? {
        P2: wt.P2 ? { back_foot_WT_start: wt.P2.WT_start, back_foot_WT_end: wt.P2.WT_end } : undefined,
        P3: wt.P3 ? { back_foot_WT_start: wt.P3.WT_start, back_foot_WT_end: wt.P3.WT_end } : undefined,
      }
    : null;

  const batSpeed = dataConsidered?.bat_swing_speed_P3 ?? dataConsidered?.bat_swing_speed_P3_mean;
  const mean_bat_speed_P3 = batSpeed
    ? {
        value: batSpeed.value ?? batSpeed.bat_swing_speed_P3_mean,
        unit: (batSpeed.unit ?? 'km_per_hr').replace('.', '_'),
        interpretation: batSpeed.notes ?? 'Mean swing speed over P3 (downswing).',
      }
    : null;

  return {
    sequencing,
    weight_transfer_pattern,
    mean_bat_speed_P3,
    data_considered: data.report?.data_considered ?? null,
  };
}

export function getMeta(data) {
  const meta = data.meta ?? {};
  const shotContext = data.shot_context ?? {};
  const postP3End = data.phase_ranges?.PostP3?.[1];
  const n_pose_frames =
    meta.n_pose_frames ??
    meta.pose_n_frames ??
    (typeof postP3End === 'number' ? postP3End + 1 : null) ??
    data.report?.data_considered?.pose_frames_n ??
    376;
  return {
    shot_type: meta.shot_type ?? shotContext.shot_type ?? shotContext.shot ?? 'cover_drive',
    view: meta.view ?? 'side',
    frame_rate_fps: meta.frame_rate_fps ?? 90,
    n_pose_frames,
  };
}
