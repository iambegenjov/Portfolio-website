'use client';

import { useEffect, useRef, useState } from 'react';

const STEP = 2800; // ms each name stays

// Names that swap in one slot, word by word: the words of the current name rise out one after another
// ("United", then "Kingdom"), and the next name's words rise in the same way, starting just after.
// Plain CSS transitions (globals.css › .rotator); the slot's width eases to the current name.
// `end` (e.g. a full stop) is attached to each name's last word, so it never lands alone on a line.
export default function Rotator({ words, end = '' }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState(null);
  const [width, setWidth] = useState(null);
  const [still, setStill] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStill(true);
    const t = setInterval(() => {
      setI((n) => {
        setPrev(n);
        return (n + 1) % words.length;
      });
    }, STEP);
    return () => clearInterval(t);
  }, [words.length]);

  useEffect(() => {
    const measure = () => setWidth(refs.current[i]?.offsetWidth || null);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [i]);

  // Reduced motion: the whole list, no movement
  if (still) return <span style={{ whiteSpace: 'normal' }}>{words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1] + end}</span>;

  return (
    <span className="rotator" style={width ? { width } : undefined} aria-hidden="true">
      <span className="rotator-sizer">{words[0] + end}</span>
      {words.map((w, k) => {
        const parts = w.split(' ');
        return (
          <span
            key={w}
            ref={(el) => (refs.current[k] = el)}
            className={'rotator-word' + (k === i ? ' is-in' : k === prev ? ' is-out' : '')}
          >
            {parts.map((p, j) => (
              <span className="rotator-part" key={j} style={{ '--k': j }}>
                {p + (j === parts.length - 1 ? end : '')}
              </span>
            ))}
          </span>
        );
      })}
    </span>
  );
}
