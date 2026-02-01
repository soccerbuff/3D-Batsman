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
    <section className="bg-white border border-border-dim rounded-xl p-5 relative overflow-visible shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-600">
          Phase storyboard
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">View</span>
          <div className="flex rounded-lg bg-gray-200 border-2 border-gray-400 p-1 shadow-inner" role="group" aria-label="View mode">
            <button
              type="button"
              onClick={() => setMode('original')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'original' ? 'bg-accent text-gray-900 shadow-md' : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900'}`}
              aria-pressed={mode === 'original'}
              aria-label="Show original frames"
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setMode('3d')}
              className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === '3d' ? 'bg-accent text-gray-900 shadow-md' : 'text-gray-700 hover:bg-gray-300 hover:text-gray-900'}`}
              aria-pressed={mode === '3d'}
              aria-label="Show 3D mesh frames"
            >
              3D
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex items-center min-h-[380px]">
        <button
          type="button"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={!canGoLeft}
          className="absolute left-0 top-1/2 -translate-x-[51%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-border-dim hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-gray-800 text-2xl font-light transition-colors shadow-lg"
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
          className="absolute right-0 top-1/2 translate-x-[51%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-border-dim hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center text-gray-800 text-2xl font-light transition-colors shadow-lg"
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
            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-accent' : 'bg-gray-300 hover:bg-gray-400'}`}
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
      className={`flex-1 min-w-0 max-w-[360px] bg-white border-2 rounded-xl overflow-hidden text-left hover:border-accent/60 transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-white shadow-lg hover:shadow-xl ${isCurrent ? 'border-black ring-2 ring-black/20' : 'border-black'}`}
    >
      <div className="aspect-[4/3] bg-gray-200 relative flex items-center justify-center overflow-hidden">
        {!imgFailed ? (
          <img
            src={imgSrc}
            alt={label}
            className={`w-full h-full object-contain ${mode === '3d' ? 'rotate-90' : ''}`}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-gray-300 text-center">
            <span className="text-4xl text-gray-600 font-mono">{frame}</span>
            <span className="text-sm text-gray-500 mt-1">Frame</span>
            <span className="text-xs text-gray-600 mt-2">
              {mode === '3d' ? `frame_${String(frame).padStart(5, '0')}_mesh.png` : `frame_${frame}.png`}
            </span>
          </div>
        )}
      </div>
      <div className="p-3 border-t border-border-dim">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-accent uppercase">{phase}</span>
          <span className="text-sm font-mono text-gray-500">Frame {frame}</span>
        </div>
        <p className="text-base font-medium text-gray-800 mt-1 truncate" title={label}>{label}</p>
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
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-100 text-xl font-bold z-10"
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
        <div className="mt-3 text-center text-gray-200">
          <span className="text-sm font-bold text-accent uppercase">{phase}</span>
          <span className="text-gray-400 mx-2">·</span>
          <span className="text-base font-mono text-gray-300">Frame {frame}</span>
          <p className="text-base font-medium text-gray-100 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
}
