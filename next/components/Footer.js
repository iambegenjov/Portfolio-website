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
  const mail = site.email ? { href: `mailto:${site.email}` } : { href: '#' };
  // The editable links (admin › Contact), in their saved order
  const link = (l, i) =>
    l.href ? (
      <a key={i} href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {l.label}
        {l.external && <span className="foot-ext" aria-hidden="true">↗</span>}
      </a>
    ) : (
      <span key={i}>{l.label}</span>
    );

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
          <nav className="foot-col" aria-label="Menu">
            <p className="foot-label">Menu</p>
            <Link href="/#work">Works</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#about">About</Link>
          </nav>
          {site.links.length > 0 && (
            <div className="foot-col">
              <p className="foot-label">Connect</p>
              {site.links.map(link)}
            </div>
          )}
        </div>
        <div className="wrap foot-bottom">
          <p>© Muhammet Begenjov 2026</p>
          <button type="button" className="foot-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top ↑
          </button>
        </div>
        <div className="wrap foot-wordmark">
          <Logo />
        </div>
      </footer>
    </>
  );
}
