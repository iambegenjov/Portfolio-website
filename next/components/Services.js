'use client';

import { useEffect, useRef } from 'react';

// Focus, discipline and principles (owner asked for at most five)
const SERVICES = [
  ['Brand Identity', 'My main focus: identities built on strategy, from the mark to the tone of voice.'],
  ['Packaging & Editorial', 'Design that works as well in print and on the shelf as it does on screen.'],
  ['Brand Architecture', 'Clear systems that keep every brand and sub-brand consistent as it grows.'],
  ['Clarity First', 'One idea, said well. Nothing on the page without a reason to be there.'],
  ['Discipline & Craft', 'Careful detail, honest timelines and work built to last beyond the launch.'],
];

export default function Services() {
  const rowsRef = useRef(null);
  const pillRef = useRef(null);
  const active = useRef(false);

  // Until this script runs, CSS gives each row its own pill (see .rows:not(.is-ready) in globals.css)
  useEffect(() => {
    rowsRef.current.classList.add('is-ready');
  }, []);

  // One shared dark pill slides from the previously hovered row to the current one
  const enter = (e) => {
    const row = e.currentTarget;
    const pill = pillRef.current;
    if (!active.current) pill.classList.add('no-move');
    pill.style.top = row.offsetTop - 1 + 'px';
    pill.style.height = row.offsetHeight + 2 + 'px';
    if (!active.current) {
      void pill.offsetWidth;
      pill.classList.remove('no-move');
      active.current = true;
    }
    rowsRef.current.classList.add('is-hovering');
  };
  const leave = () => {
    rowsRef.current.classList.remove('is-hovering');
    active.current = false;
  };

  return (
    <section className="services" id="services">
      <div className="wrap">
        <p className="eyebrow">
          Approach
        </p>
        <h2>My focus, discipline and the principles behind the work.</h2>

        <div className="rows" ref={rowsRef} onMouseLeave={leave}>
          <span className="row-pill" ref={pillRef} aria-hidden="true" />
          {SERVICES.map(([title, text]) => (
            <div className="row" key={title} onMouseEnter={enter}>
              <div className="row-title">
                <h3>{title}</h3>
              </div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
