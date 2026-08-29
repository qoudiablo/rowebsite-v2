import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getContent } from '../lib/cms';
import Nav from '../components/Nav';
import Strip from '../components/Strip';
import GifStrip from '../components/GifStrip';
import TransitionLink from '../components/TransitionLink';
import { Scribble, MarkerTag, Doodle } from '../components/Scribble';

// Three.js is client-only.
const GlitchTakeover = dynamic(() => import('../components/GlitchTakeover'), { ssr: false });

export async function getStaticProps() {
  const cms = await getContent();
  return { props: { cms } };
}

export default function Home({ cms }) {
  const scope = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // hero load-in
      gsap.set('.hero h1 .line > span', { yPercent: 110 });
      gsap.set('.hero .bio, .hero .index, .hero .cutout, .hero .doodle', { autoAlpha: 0, y: 24 });
      gsap
        .timeline({ defaults: { ease: 'power4.out' }, delay: 0.3 })
        .to('.hero h1 .line > span', { yPercent: 0, duration: 1.1, stagger: 0.12 })
        .to('.hero .index', { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.7')
        .to('.hero .cutout', { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
        .to('.hero .doodle', { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 }, '-=0.6')
        .to('.hero .bio', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.5');

      // project rows
      gsap.set('.row', { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch('.row', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }),
      });

      // generic reveals
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          }
        );
      });

      // gif tiles pop
      gsap.set('.gif i', { scale: 0 });
      ScrollTrigger.batch('.gif i', {
        start: 'top 90%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { scale: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2)' }),
      });
    }, scope);

    return () => ctx.revert();
  }, []);

  const { site, hero, takeover, projects, statement, contact, footer, stills } = cms;

  return (
    <div ref={scope}>
      <Nav name={site.name} />
      <div id="top" />

      <Strip stills={stills.top} />

      <section className="hero">
        <div className="index">{hero.index}</div>

        <div className="hero-grid">
          <h1>
            <Scribble kind="circle" className="hero-scribble" />
            <MarkerTag className="hero-marker" rotate={-10}>{hero.marker}</MarkerTag>
            {hero.lines.map((l, i) => (
              <span className="line" key={i}><span>{l}</span></span>
            ))}
          </h1>

          {/* [PLACEHOLDER] collage stack — blob cutouts until real PNGs exist */}
          <div className="collage" aria-hidden="true">
            {hero.cutouts.map((c, i) => (
              <div key={c.label} className={`cutout c${i + 1}`} style={{ '--h': c.hue }} data-label={c.label} />
            ))}
            <Doodle kind="face" className="d-face" />
            <Doodle kind="bolt" className="d-bolt" />
          </div>

          <p className="bio">
            <b>{hero.bio.lead}</b> {hero.bio.rest}
          </p>
        </div>

        <div className="scroll-cue">scroll</div>
      </section>

      {/* pinned glitch-footage takeover */}
      <GlitchTakeover beats={takeover.beats} tag={takeover.tag} />

      <Strip stills={stills.bottom} reverse />

      <section id="works" className="section-pad">
        <div className="projects">
          <div className="eyebrow">selected work</div>
          {projects.map((p, i) => (
            <TransitionLink key={p.slug} href={`/projects/${p.slug}`} className="row">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="title">{p.title}</span>
              <span className="tag">{p.tag}</span>
              <span className="arrow">→</span>
            </TransitionLink>
          ))}
          <a className="row" href="#works">
            <span className="num">+</span>
            <span className="title">20 more</span>
            <span className="tag">all work</span>
            <span className="arrow">→</span>
          </a>
        </div>
      </section>

      <section className="section-pad">
        <div className="statement">
          <p className="reveal">
            <Scribble kind="underline" className="statement-scribble" />
            {statement.chunks.map((c, i) =>
              c.link ? (
                <TransitionLink key={i} href={c.href} className="lnk">{c.text}</TransitionLink>
              ) : (
                <span key={i}>{c.text}</span>
              )
            )}
          </p>
          <p className="personal reveal">{statement.personal}</p>
        </div>
      </section>

      <GifStrip />

      <section id="contact" className="contact-band">
        <div className="contact section-pad">
          <Doodle kind="bolt" className="contact-doodle" />
          <h2 className="reveal">
            {contact.heading.map((l, i) => (
              <span key={i}>{l}{i < contact.heading.length - 1 && <br />}</span>
            ))}
          </h2>
          <div className="grid">
            {contact.rows.map((r) => (
              <div className="reveal" key={r.label}>
                <h3>{r.label}</h3>
                <div className="val">{r.href ? <a href={r.href}>{r.value}</a> : r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer>
        <span>{footer.left}</span>
        <span>{footer.right}</span>
      </footer>
    </div>
  );
}
