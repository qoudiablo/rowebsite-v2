# ro — layout study v2 (light collage system)

Second pass, restyled against a screen recording of the reference site
(artemartemartem.com). Same open-source stack as v1; visual system rebuilt:
light theme, rounded display type, marker-scribble annotation layer, collage
hero, pinned glitch-footage takeover, and a custom fullscreen video lightbox.

All scribbles, doodles, copy, and code are original. The reference site's
licensed fonts, artwork, cutout imagery, and CMS content are not included.

## Stack
- Next.js 14, Pages Router, SSG
- GSAP 3 + ScrollTrigger — load-ins, reveals, scrubbed takeover beats,
  scribble draw-on (stroke-dashoffset)
- Lenis — smooth scrolling on GSAP's ticker
- Three.js via @react-three/fiber — CRT/glitch shader on the takeover stage
  (scanlines, chromatic shift, noise, rolling bar). Swap point for a
  THREE.VideoTexture is documented in components/GlitchTakeover.jsx
- Fade + blur page transitions (TransitionLink + _app)
- CMS boundary in lib/cms.js — mock payload now, Strapi fetch later
- Custom video lightbox (components/VideoLightbox.jsx) — play/pause, mute,
  fullscreen, timecode, seek. Ships with a generated placeholder clip at
  public/media/placeholder.mp4

## Run it
    npm install
    npm run dev        # http://localhost:3000

Zero-local-compute: push to GitHub, import in Vercel.

## Swap points
- Fonts: public/fonts/README.txt (Fredoka + Permanent Marker are stand-ins)
- Content: lib/content.js (everything marked [PLACEHOLDER])
- Real CMS: lib/cms.js getContent()
- Takeover footage: components/GlitchTakeover.jsx (VideoTexture note)
- Project videos: pages/projects/[slug].jsx — point the lightbox src at
  real exports
- Hero cutouts: index.jsx collage block — replace blob tiles with PNGs
