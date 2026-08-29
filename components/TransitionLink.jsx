import { useRouter } from 'next/router';
import gsap from 'gsap';
import { TRANSITIONS } from '../pages/_app';

// A link that animates the current page out (fade + blur) before pushing the
// next route. The matching enter animation runs in _app on route change.
export default function TransitionLink({ href, children, className }) {
  const router = useRouter();

  const onClick = (e) => {
    // let modified clicks (new tab etc.) behave natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (router.asPath === href) return;

    const el = document.getElementById('page');
    if (!el) return router.push(href);

    gsap.to(el, { ...TRANSITIONS.fade.out, onComplete: () => router.push(href) });
  };

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}
