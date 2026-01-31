import { useState, useEffect } from 'react';

/**
 * Phase images in public/phases/
 * Original: frame_0.png, frame_229.png, ...
 * 3D mesh: frame_00000_mesh.png, frame_00229_mesh.png, ... (5-digit zero-padded)
 */
function getPhaseImageUrl(frame, mode) {
  if (mode === '3d') {
    const padded = String(frame).padStart(5, '0');
    return `/phases/frame_${padded}_mesh.png`;
  }
  return `/phases/frame_${frame}.png`;
}

export function Storyboard({ frames }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [mode, setMode] = useState('original'); // 'original' | '3d'

  if (!frames?.length) return null;

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < frames.length - 1;

  const visibleStart = Math.max(0, Math.min(currentIndex - 1, frames.length - 3));
  const visibleIndices = [visibleStart, visibleStart + 1, visibleStart + 2].filter(
    (i) => i < frames.length
  );
  const visibleItems = visibleIndices.map((i) => frames[i]);

  return (
    <section className="bg-panel border border-border-dim rounded-xl p-5 relative overflow-visible">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-slate-400">
          Phase storyboard
        </h2>
        <div className="flex rounded-lg bg-card border border-white/10 p-0.5">
          <button
            type="button"
            onClick={() => setMode('original')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'original' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Original
          </button>
          <button
            type="button"
            onClick={() => setMode('3d')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === '3d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            3D
          </button>
        </div>
      </div>

      <div className="relative flex items-center min-h-[380px]">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={!canGoLeft}
          className="absolute left-0 top-1/2 -translate-x-[51%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white text-2xl font-light transition-colors shadow-lg"
          aria-label="Previous phase"
        >
          ‹
        </button>

        <div className="mx-14 flex-1 flex gap-4 justify-center items-stretch">
          {visibleItems.map((item) => (
            <PhaseCard
              key={`${item.phase}-${item.frame}-${mode}`}
              item={item}
              mode={mode}
              isCurrent={frames[currentIndex] === item}
              onClick={() => setLightboxItem(item)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.min(frames.length - 1, i + 1))}
          disabled={!canGoRight}
          className="absolute right-0 top-1/2 translate-x-[51%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-card border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-white text-2xl font-light transition-colors shadow-lg"
          aria-label="Next phase"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-3">
        {frames.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-indigo-500' : 'bg-white/20 hover:bg-white/40'}`}
            aria-label={`Go to phase ${i + 1}`}
          />
        ))}
      </div>

      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          mode={mode}
          onClose={() => setLightboxItem(null)}
        />
      )}
    </section>
  );
}

function PhaseCard({ item, mode, isCurrent, onClick }) {
  const { frame, phase, label } = item;
  const imgSrc = getPhaseImageUrl(frame, mode);
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-0 max-w-[360px] bg-card border rounded-xl overflow-hidden text-left hover:border-indigo-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-dashboard-bg ${isCurrent ? 'border-indigo-500/50 ring-1 ring-indigo-500/30' : 'border-white/5'}`}
    >
      <div className="aspect-[4/3] bg-slate-800/50 relative flex items-center justify-center overflow-hidden">
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={label}
            className={`w-full h-full object-contain ${mode === '3d' ? 'rotate-90' : ''}`}
            onError={() => setImgFailed(true)}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center p-3 bg-slate-800/80 text-center ${!imgFailed ? 'hidden' : ''}`}>
          <span className="text-4xl text-slate-600 font-mono">{frame}</span>
          <span className="text-sm text-slate-500 mt-1">Frame</span>
          <span className="text-xs text-slate-600 mt-2">
            Add image: {mode === '3d' ? `frame_${String(frame).padStart(5, '0')}_mesh.png` : `frame_${frame}.png`}
          </span>
        </div>
      </div>
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-indigo-400 uppercase">{phase}</span>
          <span className="text-sm font-mono text-slate-500">Frame {frame}</span>
        </div>
        <p className="text-base font-medium text-slate-200 mt-1 truncate" title={label}>{label}</p>
      </div>
    </button>
  );
}

function Lightbox({ item, mode, onClose }) {
  const { frame, phase, label } = item;
  const imgSrc = getPhaseImageUrl(frame, mode);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`View ${label}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xl font-bold z-10"
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imgSrc}
          alt={label}
          className={`max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-lg shadow-2xl ${mode === '3d' ? 'rotate-90' : ''}`}
        />
        <div className="mt-3 text-center text-slate-300">
          <span className="text-sm font-bold text-indigo-400 uppercase">{phase}</span>
          <span className="text-slate-500 mx-2">·</span>
          <span className="text-base font-mono text-slate-400">Frame {frame}</span>
          <p className="text-base font-medium text-white mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
