export function CoachView({ coachView }) {
  if (!coachView) return null;

  const {
    one_line_summary,
    key_messages,
    phase_by_phase_story,
    what_to_tell_the_player,
    watch_for_on_video,
  } = coachView;

  return (
    <section className="bg-white border border-border-dim rounded-xl p-5 shadow-sm">
      <h2 className="text-base font-bold uppercase tracking-wider text-gray-600 mb-5">
        Coach view
      </h2>

      {one_line_summary && (
        <div className="rounded-xl bg-orange-50 border border-accent/30 p-4 mb-6">
          <p className="text-base font-medium text-gray-800 leading-relaxed">
            {one_line_summary}
          </p>
        </div>
      )}

      {key_messages?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent mb-3">
            Key messages
          </h3>
          <ul className="space-y-2">
            {key_messages.map((msg, i) => (
              <li key={i} className="flex gap-2 text-base text-gray-700 leading-relaxed">
                <span className="text-accent shrink-0">•</span>
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase_by_phase_story && Object.keys(phase_by_phase_story).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 mb-3">
            Phase by phase
          </h3>
          <div className="space-y-3">
            {Object.entries(phase_by_phase_story).map(([phase, text]) => (
              <div key={phase} className="rounded-lg bg-white border border-border-dim p-4">
                <span className="text-xs font-bold text-accent uppercase">{phase}</span>
                <p className="text-base text-gray-700 mt-1 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {what_to_tell_the_player && Object.keys(what_to_tell_the_player).length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 mb-3">
            What to tell the player
          </h3>
          <div className="space-y-2">
            {Object.entries(what_to_tell_the_player).map(([key, text]) => (
              <div key={key} className="flex gap-2">
                <span className="text-xs font-bold text-emerald-600 uppercase shrink-0 w-16">
                  {key}
                </span>
                <p className="text-base text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {watch_for_on_video && Object.keys(watch_for_on_video).length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 mb-3">
            Watch for on video
          </h3>
          <div className="space-y-2">
            {Object.entries(watch_for_on_video).map(([phase, items]) => (
              <div key={phase}>
                <span className="text-xs font-bold text-amber-600 uppercase">{phase}</span>
                <ul className="mt-1 space-y-1">
                  {(Array.isArray(items) ? items : [items]).map((item, i) => (
                    <li key={i} className="text-base text-gray-700 leading-relaxed flex gap-2">
                      <span className="text-amber-500 shrink-0">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
