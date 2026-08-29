import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { getContent } from '../../lib/cms';
import Nav from '../../components/Nav';
import TransitionLink from '../../components/TransitionLink';
import { MarkerTag } from '../../components/Scribble';
import VideoLightbox from '../../components/VideoLightbox';

export async function getStaticPaths() {
  const cms = await getContent();
  return {
    paths: cms.projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const cms = await getContent();
  const project = cms.projects.find((p) => p.slug === params.slug);
  const idx = cms.projects.indexOf(project);
  const next = cms.projects[(idx + 1) % cms.projects.length];
  return { props: { site: cms.site, project, index: idx + 1, next } };
}

export default function Project({ site, project, index, next }) {
  const scope = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      gsap.set('.project-title .line > span', { yPercent: 110 });
      gsap
        .timeline({ defaults: { ease: 'power4.out' }, delay: 0.35 })
        .to('.project-title .line > span', { yPercent: 0, duration: 1.0 })
        .fromTo('.project-meta', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.5')
        .fromTo('.frame', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.4');
    }, scope);
    return () => ctx.revert();
  }, [project.slug]);

  return (
    <div ref={scope}>
      <Nav name={site.name} />
      <section className="project section-pad">
        <div className="index">{String(index).padStart(2, '0')}</div>

        <h1 className="project-title">
          <MarkerTag className="project-marker" rotate={-7}>{project.tag}</MarkerTag>
          <span className="line"><span>{project.title}</span></span>
        </h1>
        <p className="project-meta">{project.year}</p>

        {/* Rounded frame → opens the custom lightbox. Ships with the generated
            placeholder clip; point `src` at the real export when it exists. */}
        <button
          className="frame frame-playable"
          data-label={`${project.slug} — watch`}
          onClick={() => setOpen(true)}
          aria-label={`Play ${project.title}`}
        >
          <span className="play-badge">play</span>
        </button>

        <p className="project-body">
          [PLACEHOLDER] One tight paragraph on this piece: the brief, what you
          made, what it did. Keep it shorter than feels comfortable.
        </p>

        <TransitionLink href={`/projects/${next.slug}`} className="next-link">
          next — {next.title} →
        </TransitionLink>
      </section>

      <footer>
        <span>layout study v2</span>
        <TransitionLink href="/">← back to index</TransitionLink>
      </footer>

      {open && (
        <VideoLightbox
          src="/media/placeholder.mp4"
          title={project.title}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
