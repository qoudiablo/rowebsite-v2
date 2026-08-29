import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// ---------------------------------------------------------------------------
// Marker scribbles + doodles — the annotation layer.
// All paths below are authored here from scratch (rough, overshooting strokes
// to read as hand-drawn). Draw-on happens by animating stroke-dashoffset when
// the element scrolls into view.
// ---------------------------------------------------------------------------

const SCRIBBLES = {
  // loose ellipse loop with an overshooting second pass
  circle: {
    viewBox: '0 0 220 110',
    d: 'M28 62 C 20 30, 80 8, 128 12 C 182 17, 214 38, 208 62 C 202 88, 148 104, 96 100 C 48 96, 10 80, 18 54 C 24 34, 66 18, 112 18',
  },
  // two overlapping wavy strokes
  underline: {
    viewBox: '0 0 260 40',
    d: 'M6 22 C 50 10, 96 30, 140 18 C 184 8, 224 26, 254 14 M14 32 C 70 22, 150 34, 246 24',
  },
  // curved arrow with a rough head
  arrow: {
    viewBox: '0 0 160 120',
    d: 'M12 108 C 30 60, 78 26, 140 20 M116 10 L 144 19 L 124 42',
  },
  // three crossing burst strokes
  burst: {
    viewBox: '0 0 120 120',
    d: 'M60 8 L 60 112 M14 34 L 106 86 M106 34 L 14 86',
  },
};

export function Scribble({ kind = 'circle', className = '', delay = 0 }) {
  const ref = useRef(null);
  const s = SCRIBBLES[kind] || SCRIBBLES.circle;

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const path = ref.current?.querySelector('path');
    if (!path) return;
    const len = path.getTotalLength();
    if (reduce) return; // leave fully drawn
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
      delay,
      ease: 'power2.inOut',
      scrollTrigger: { trigger: ref.current, start: 'top 92%', once: true },
    });
    return () => tween.scrollTrigger?.kill();
  }, [delay]);

  return (
    <svg
      ref={ref}
      className={`scribble ${className}`}
      viewBox={s.viewBox}
      fill="none"
      aria-hidden="true"
    >
      <path d={s.d} stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Scrawled word in the marker face — original text passed in as children.
export function MarkerTag({ children, className = '', rotate = -6 }) {
  return (
    <span className={`marker-tag ${className}`} style={{ '--rot': `${rotate}deg` }} aria-hidden="true">
      {children}
    </span>
  );
}

// Tiny original line doodles.
export function Doodle({ kind = 'face', className = '' }) {
  if (kind === 'bolt') {
    return (
      <svg className={`doodle ${className}`} viewBox="0 0 80 110" fill="none" aria-hidden="true">
        <path d="M48 6 L 22 58 L 42 58 L 30 104 L 62 46 L 42 46 L 54 6 Z"
          stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
      </svg>
    );
  }
  // face: circle head, dot eyes, smile, scribble hair
  return (
    <svg className={`doodle ${className}`} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="68" r="40" stroke="currentColor" strokeWidth="5" />
      <circle cx="46" cy="62" r="4" fill="currentColor" />
      <circle cx="74" cy="62" r="4" fill="currentColor" />
      <path d="M44 82 C 52 92, 68 92, 76 82" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M30 34 C 40 20, 50 30, 58 16 M58 16 C 64 30, 76 18, 86 32 M40 26 C 48 14, 66 24, 72 12"
        stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
