'use client';

import { useEffect, useRef } from 'react';
import Link from './SiteLink';
import Logo from './Logo';

// Sticky nav: hides on scroll down, returns on scroll up
export default function Nav() {
  const ref = useRef(null);

  useEffect(() => {
    const nav = ref.current;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      nav.classList.toggle('nav-hidden', y > lastY && y > nav.offsetHeight);
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    const setHeight = () => document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
    setHeight();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', setHeight);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', setHeight);
    };
  }, []);

  return (
    <nav ref={ref}>
      <div className="nav-row">
        <Link className="logo" href="/" aria-label="Muhammet Begenjov">
          <Logo className="logo-mark" />
        </Link>
      </div>
    </nav>
  );
}
