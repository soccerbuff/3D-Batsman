import { useRef, useEffect } from 'react';

export function VideoPlayer() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700 relative group">
      <video
        ref={videoRef}
        src="/side_annotated.mp4"
        className="w-full h-full object-contain"
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
