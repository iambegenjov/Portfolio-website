'use client';

import { useEffect, useRef } from 'react';

const SERVICES = [
  ['Brand Identity', 'Name, mark, voice — built to be recognized.'],
  ['Retail & Environments', 'Spaces that make premium feel earned.'],
  ['Systems & Wayfinding', 'Clarity for brands that move things.'],
  ['Digital Design', 'Interfaces that carry the same weight offline.'],
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
          Services
        </p>
        <h2>Four ways I help brands find their edge and hold on to it.</h2>

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
