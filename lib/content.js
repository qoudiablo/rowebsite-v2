// ---------------------------------------------------------------------------
// MOCK CMS PAYLOAD (v2 — light collage system)
// Same role as v1: stands in for the headless CMS. Everything marked
// [PLACEHOLDER] is meant to be replaced with real content.
// ---------------------------------------------------------------------------

export const content = {
  site: {
    name: 'rohith reghu',
    title: 'ro — layout study v2',
    description:
      'Video Editor & AI Creative. Layout study v2 — light collage system. Next.js, GSAP, Lenis, R3F.',
  },

  hero: {
    index: '00',
    lines: ['Hey', "I'm Ro"],
    marker: 'hey!', // scrawled marker word near the headline
    bio: {
      lead: 'Video Editor & AI Creative.',
      rest: 'I cut live action together with AI-generated worlds — making tech feel human, and making things that shouldn\u2019t exist look real.',
    },
    // [PLACEHOLDER] collage cutouts — blob-masked tiles until real cutout
    // PNGs exist. Swap by giving each an `img` and rendering it in index.jsx.
    cutouts: [
      { label: 'cutout 01', hue: 160 },
      { label: 'cutout 02', hue: 280 },
      { label: 'cutout 03', hue: 30 },
    ],
  },

  // Pinned glitch-takeover beats — one word per scroll stage.
  takeover: {
    beats: ['shoot.', 'generate.', 'cut.'],
    tag: 'ai video', // marker scrawl over the footage
  },

  // [PLACEHOLDER] projects — `year` and `tag` render on the detail page.
  projects: [
    { slug: 'launch-film', title: 'launch film', tag: 'ai video', year: '2026' },
    { slug: 'brand-anthem', title: 'brand anthem', tag: 'live action + ai', year: '2026' },
    { slug: 'concept-trailer', title: 'concept trailer', tag: 'ai video', year: '2025' },
    { slug: 'product-explainer', title: 'product explainer', tag: 'motion', year: '2025' },
    { slug: 'social-cutdowns', title: 'social cutdowns', tag: 'edit', year: '2025' },
    { slug: 'event-sizzle', title: 'event sizzle', tag: 'edit', year: '2024' },
  ],

  statement: {
    chunks: [
      { text: "I've cut " },
      { text: 'launch films', link: true, href: '/projects/launch-film' },
      { text: ', built ' },
      { text: 'AI video pipelines', link: true, href: '/projects/concept-trailer' },
      { text: ', directed ' },
      { text: 'concept trailers', link: true, href: '/projects/concept-trailer' },
      { text: ', and shipped ' },
      { text: 'brand work', link: true, href: '/projects/brand-anthem' },
      { text: ' people can\u2019t stop watching — and ' },
      { text: 'counting', link: true, href: '/#works' },
    ],
    personal:
      '[PLACEHOLDER] Off the timeline I\u2019m building a multi-model AI video pipeline — swap this line for the one that makes the section human.',
  },

  contact: {
    heading: ["Let's", 'Talk'],
    rows: [
      { label: 'E-mail', value: 'hello@roworks.co', href: 'mailto:hello@roworks.co' }, // [PLACEHOLDER] verify address
      { label: 'Based in', value: 'Toronto, Canada' },
      { label: 'Elsewhere', value: 'portfolio · linkedin · vimeo' }, // [PLACEHOLDER] real links
    ],
  },

  footer: {
    left: 'layout study v2 — structure after artemartemartem.com',
    right: 'next.js · gsap · lenis · r3f',
  },

  stills: {
    top: [
      { label: 'still 01' }, { label: 'still 02' }, { label: 'still 03' },
      { label: 'still 04' }, { label: 'still 05' }, { label: 'still 06' },
    ],
    bottom: [
      { label: 'still 07' }, { label: 'still 08' }, { label: 'still 09' },
      { label: 'still 10' }, { label: 'still 11' }, { label: 'still 12' },
    ],
  },
};
