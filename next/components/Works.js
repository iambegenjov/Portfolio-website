'use client';

import { useEffect, useRef } from 'react';
import Link from './SiteLink';
import Arrow from './Arrow';

// On touch screens the card nearest the middle of the screen gets the hover state
function useCenterCard(boxRef) {
  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;
    const box = boxRef.current;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = box.getBoundingClientRect();
      const inView = r.top < innerHeight * 0.8 && r.bottom > innerHeight * 0.2;
      const mid = innerWidth / 2;
      let best = null;
      let bestDist = Infinity;
      for (const card of box.children) {
        const c = card.getBoundingClientRect();
        const d = Math.abs(c.left + c.width / 2 - mid);
        if (d < bestDist) [best, bestDist] = [card, d];
      }
      for (const card of box.children) card.classList.toggle('is-active', inView && card === best && bestDist < best.offsetWidth * 0.35);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    box.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      box.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [boxRef]);
}

export default function Works({ projects }) {
  const cardsRef = useRef(null);
  useCenterCard(cardsRef);

  return (
    <section className="studies" id="work">
      <div className="wrap">
        <p className="eyebrow">
          Works
        </p>
        <h2>Build something so clear, it needs no explanation.</h2>
        <a className="pill light" href="#events">
          Explore
        </a>
      </div>

      <div className="cards wrap" ref={cardsRef}>
        {projects.map((p) => (
          <Link className="card" href={`/work/${p.slug}`} key={p.slug}>
            <div className="card-img">
              <div className="card-pic" style={p.cardUrl ? { backgroundImage: `url('${p.cardUrl}')` } : undefined} />
            </div>
            <div className="card-info">
              <h3>{p.title}</h3>
              <p>{p.category}</p>
              <span className="card-arrow" aria-hidden="true">
                <Arrow />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
