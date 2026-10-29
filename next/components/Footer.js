'use client';

import Link from './SiteLink';
import Logo from './Logo';

export function BackTop() {
  return (
    <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
      ↑
    </button>
  );
}

// CTA panel (sticks under the page; must stay a direct child of body for that) and the dark footer beneath it, revealed as the page scrolls up
export default function Footer({ site }) {
  const out = (url) => (url ? { href: url, target: '_blank', rel: 'noopener noreferrer' } : { href: '#' });
  const mail = site.email ? { href: `mailto:${site.email}` } : { href: '#' };
  return (
    <>
      <section className="cta-panel">
        <h2>{site.ctaHeading}</h2>
        <a className="pill" {...mail}>
          {site.ctaButton}
        </a>
      </section>

      <footer>
        <div className="wrap foot-grid">
          <div className="foot-col">
            <Link href="/#work">Works</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#about">About</Link>
          </div>
          <div className="foot-col">
            <a {...mail}>Contact</a>
            <a {...out(site.resume)}>Résumé</a>
          </div>
          <div className="foot-col">
            <a {...out(site.instagram)}>Instagram</a>
            <a {...out(site.linkedin)}>LinkedIn</a>
          </div>
          <div className="foot-copy">© Copyright Muhammet Begenjov 2026</div>
        </div>
        <div className="wrap foot-wordmark">
          <Logo />
        </div>
      </footer>
    </>
  );
}
