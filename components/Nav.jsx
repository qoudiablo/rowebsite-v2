import { useRouter } from 'next/router';
import TransitionLink from './TransitionLink';

export default function Nav({ name }) {
  const router = useRouter();
  const onHome = router.pathname === '/';

  // On the homepage, section links glide via Lenis; from any other page they
  // route home first (hash scroll after a transition is a known rough edge —
  // acceptable for a study).
  const anchor = (id) => (e) => {
    if (!onHome) return; // TransitionLink handles navigation
    e.preventDefault();
    const el = document.querySelector(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -10 });
    else el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="nav">
      {onHome ? (
        <a href="#works" onClick={anchor('#works')}>works</a>
      ) : (
        <TransitionLink href="/">works</TransitionLink>
      )}
      {onHome ? (
        <a href="#top" className="brand" onClick={anchor('#top')}>{name}</a>
      ) : (
        <TransitionLink href="/" className="brand">{name}</TransitionLink>
      )}
      {onHome ? (
        <a href="#contact" onClick={anchor('#contact')}>contact</a>
      ) : (
        <TransitionLink href="/" >contact</TransitionLink>
      )}
    </nav>
  );
}
