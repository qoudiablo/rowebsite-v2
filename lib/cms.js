import { content } from './content';

// ---------------------------------------------------------------------------
// CMS BOUNDARY
// The reference architecture: Next.js pulls all content from a headless
// Strapi v5 instance at render time, and every image URL is rewritten through
// an imgproxy server (on-the-fly WebP conversion + resize variants).
//
// This function is the entire seam. Today it returns the local mock payload.
// When Strapi is live, it becomes something like:
//
//   const res = await fetch(`${process.env.STRAPI_URL}/api/home?populate=deep`, {
//     headers: { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` },
//   });
//   const { data } = await res.json();
//   return mapStrapiToContent(data);
//
// Nothing else in the codebase needs to change.
// ---------------------------------------------------------------------------

export async function getContent() {
  return content;
}

// imgproxy URL builder — the reference site serves every image as
// {IMGPROXY_HOST}/{signature}/dpr:1/f:webp/q:90/rs:fill:{width}/plain/{source}
// Unsigned variant below works with IMGPROXY_ALLOW_UNSIGNED=true for local dev.
export function imgproxyUrl(source, width = 1920) {
  const host = process.env.NEXT_PUBLIC_IMGPROXY_URL;
  if (!host) return source; // no imgproxy running — serve the original
  return `${host}/unsafe/f:webp/q:90/rs:fill:${width}/plain/${encodeURIComponent(source)}`;
}
