import { useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Fullscreen video lightbox — the reference site's project player pattern:
// dark overlay, edge-to-edge video, minimal text controls (pause / mute /
// fullscreen / timecode) and a close affordance top-right. Ships with the
// generated placeholder clip in /public/media; pass any src.
// ---------------------------------------------------------------------------

const fmt = (s) => {
  if (!isFinite(s)) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export default function VideoLightbox({ src, title, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setTime(v.currentTime);
    const onMeta = () => setDur(v.duration);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    v.play().catch(() => setPlaying(false)); // autoplay may be blocked with sound
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
      window.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [onClose]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const goFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); // iOS Safari
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !dur) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * dur;
  };

  return (
    <div className="lightbox" role="dialog" aria-label={`${title} — video`}>
      <div className="lightbox-top">
        <span className="lightbox-title">{title}</span>
        <button className="lb-btn" onClick={onClose}>close</button>
      </div>

      <video ref={videoRef} src={src} onClick={toggle} playsInline />

      <div className="lightbox-bottom">
        <span className="lb-time">{fmt(time)} / {fmt(dur)}</span>
        <div className="lb-track" onClick={seek}>
          <div className="lb-fill" style={{ width: dur ? `${(time / dur) * 100}%` : 0 }} />
        </div>
        <button className="lb-btn" onClick={toggle}>{playing ? 'pause' : 'play'}</button>
        <button className="lb-btn" onClick={toggleMute}>{muted ? 'unmute' : 'mute'}</button>
        <button className="lb-btn" onClick={goFullscreen}>full screen</button>
      </div>
    </div>
  );
}
