'use client';

import { useEffect, useState } from 'react';
import Link from './SiteLink';
import Arrow from './Arrow';

const VISIBLE = 3; // paragraphs shown before "Read more"

// Project page, modelled on fiasco.design/work/boundless (without the cover photo, owner removed it):
// title and text on the left, labelled pills on the right, then the image rows.
export default function ProjectView({ project: p, next }) {
  const [open, setOpen] = useState(false);

  // Project pages stay light
  useEffect(() => {
    const body = document.body;
    const update = () => {
      body.classList.add('on-project');
      body.classList.remove('is-dark');
    };
    update();
    const late = setTimeout(update, 400); // again in case the page re-rendered after load
    return () => {
      clearTimeout(late);
      body.classList.remove('on-project');
    };
  }, [p.slug]);

  const groups = [
    ['Industry', p.category ? [p.category] : []],
    ['Discipline', p.tags || []],
  ].filter((g) => g[1].length);

  return (
    <article className="project">
      <div className="pj-panel">
        <div className="pj-intro">
          <h1 className="pj-headline">
            {p.title}
          </h1>
          <div className="pj-main">
            <div className={'pj-text' + (open ? ' is-open' : '')}>
              {p.paragraphs.map((t, k) => (
                <p key={k} className={k >= VISIBLE ? 'pj-extra' : undefined}>
                  {t}
                </p>
              ))}
            </div>
            {p.paragraphs.length > VISIBLE && (
              <button className="pj-more" type="button" onClick={() => setOpen(!open)}>
                <span>{open ? 'Read less' : 'Read more'}</span>
              </button>
            )}
          </div>
          <aside className="pj-side">
            {groups.map(([label, items]) => (
              <div className="pj-group" key={label}>
                <p className="pj-side-label">{label}</p>
                <div className="pj-pills">
                  {items.map((t) => (
                    <span className="pj-pill" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </aside>
        </div>

        {p.rows.length > 0 && (
          <div className="pj-gallery">
            {p.rows.map((r, i) => (
              <div className={'pj-row pj-row--' + r.type} key={i}>
                {r.images.map((src, k) => (
                  <div className="pj-img" role="img" aria-label={p.title} key={k}>
                    <div className="pj-img-pic" style={{ backgroundImage: `url('${src}')` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <Link className="pj-next" href={`/work/${next.slug}`}>
          <div className="pj-next-inner">
            <p className="eyebrow">Next project</p>
            <span className="pj-next-title">
              {next.title}
              <Arrow />
            </span>
          </div>
        </Link>
      </div>
    </article>
  );
}
