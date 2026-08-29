import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Fredoka, Permanent_Marker } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from 'lenis';
import '../styles/globals.css';

gsap.registerPlugin(ScrollTrigger);

// Stand-ins for the reference site's licensed faces — see public/fonts/README.txt.
// Fredoka: rounded, chunky display + body. Permanent Marker: the scrawled
// annotation voice (original text only, drawn our own way).
const display = Fredoka({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-display' });
const marker = Permanent_Marker({ weight: '400', subsets: ['latin'], variable: '--font-marker' });

// Fade + blur transition config — same mechanism as v1.
export const TRANSITIONS = {
  fade: {
    set: { autoAlpha: 0, filter: 'blur(24px)' },
    in: { autoAlpha: 1, filter: 'blur(0px)', duration: 0.6, ease: 'sine.inOut' },
    out: { autoAlpha: 0, filter: 'blur(24px)', duration: 0.45, ease: 'sine.in' },
  },
};

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    const el = document.getElementById('page');
    if (!el) return;
    gsap.set(el, TRANSITIONS.fade.set);
    gsap.to(el, TRANSITIONS.fade.in);
    lenisRef.current?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [router.asPath]);

  return (
    <div className={`${display.variable} ${marker.variable}`}>
      <Head>
        <title>ro — layout study v2</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div id="page" key={router.asPath}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
