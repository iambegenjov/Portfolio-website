'use client';

import Link from './SiteLink';
import Arrow from './Arrow';

export default function Works({ projects }) {
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

      <div className="cards wrap">
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
