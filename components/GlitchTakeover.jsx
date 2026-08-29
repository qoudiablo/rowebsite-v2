import { useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { MarkerTag } from './Scribble';

// ---------------------------------------------------------------------------
// Fullscreen scroll takeover — the mechanism the reference homepage uses:
// scrolling pins a fullscreen media stage treated with a CRT/glitch shader
// (scanlines, chromatic shift, noise, rolling bar) while text beats punctuate
// the sequence. Here the "footage" is procedural (drifting color blobs) so
// nothing ships that isn't ours.
//
// SWAP POINT for real footage: create a THREE.VideoTexture from a <video>
// element and sample it in place of the blobs() function — pass it as a
// uniform (uTex) and read texture2D(uTex, uv) as the base color before the
// glitch treatment. Everything else stays.
// ---------------------------------------------------------------------------

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress; // 0..1 scroll through the takeover

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

  // procedural stand-in "footage": three drifting soft blobs
  vec3 blobs(vec2 uv, float t){
    vec2 a = vec2(0.30 + 0.18 * sin(t * 0.40), 0.55 + 0.15 * cos(t * 0.31));
    vec2 b = vec2(0.72 + 0.16 * cos(t * 0.27), 0.40 + 0.18 * sin(t * 0.36));
    vec2 c = vec2(0.50 + 0.20 * sin(t * 0.22), 0.72 + 0.12 * cos(t * 0.45));
    float da = smoothstep(0.45, 0.0, distance(uv, a));
    float db = smoothstep(0.50, 0.0, distance(uv, b));
    float dc = smoothstep(0.40, 0.0, distance(uv, c));
    // hue drifts with scroll progress
    vec3 c1 = mix(vec3(0.16, 0.83, 0.35), vec3(0.95, 0.35, 0.55), uProgress);
    vec3 c2 = mix(vec3(0.20, 0.45, 0.95), vec3(0.98, 0.75, 0.20), uProgress);
    vec3 base = vec3(0.05);
    return base + c1 * da + c2 * db + vec3(0.9) * dc * 0.35;
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime;

    // rolling bar displacement (VHS tracking)
    float bar = smoothstep(0.0, 0.06, abs(fract(uv.y - t * 0.07) - 0.5) - 0.44);
    uv.x += (1.0 - bar) * 0.03 * sin(t * 3.0);

    // occasional horizontal tear
    float tear = step(0.985, hash(vec2(floor(uv.y * 60.0), floor(t * 8.0))));
    uv.x += tear * (hash(vec2(t)) - 0.5) * 0.12;

    // chromatic shift scales with scroll progress
    float ca = 0.0035 + uProgress * 0.004;
    vec3 col;
    col.r = blobs(uv + vec2(ca, 0.0), t).r;
    col.g = blobs(uv, t).g;
    col.b = blobs(uv - vec2(ca, 0.0), t).b;

    // scanlines + grain + vignette
    col *= 0.88 + 0.12 * sin(uv.y * 900.0);
    col += (hash(uv * t) - 0.5) * 0.07;
    float vig = smoothstep(1.05, 0.45, distance(vUv, vec2(0.5)));
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function GlitchPlane({ progressRef }) {
  const mat = useRef();
  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value = state.clock.elapsedTime;
    mat.current.uniforms.uProgress.value = progressRef.current;
  });
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{ uTime: { value: 0 }, uProgress: { value: 0 } }}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function GlitchTakeover({ beats, tag }) {
  const wrap = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const beatEls = wrap.current.querySelectorAll('.beat');

    if (reduce) {
      // static fallback: show the last beat, no pin choreography
      gsap.set(beatEls[beatEls.length - 1], { autoAlpha: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (st) => { progressRef.current = st.progress; },
        },
      });
      beatEls.forEach((el, i) => {
        tl.fromTo(el, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.6 })
          .to(el, { autoAlpha: 0, scale: 1.06, duration: 0.6 }, i === beatEls.length - 1 ? '+=0.8' : '+=0.4');
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div className="takeover" ref={wrap}>
      <div className="takeover-stage">
        <Canvas
          dpr={[1, 1.5]}
          gl={{ antialias: false, powerPreference: 'low-power', alpha: false }}
          frameloop="always"
        >
          <GlitchPlane progressRef={progressRef} />
        </Canvas>
        <MarkerTag className="takeover-tag" rotate={-8}>{tag}</MarkerTag>
        {beats.map((b) => (
          <div className="beat" key={b}>{b}</div>
        ))}
      </div>
    </div>
  );
}
