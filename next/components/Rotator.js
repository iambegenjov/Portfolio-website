'use client';

import { useEffect, useRef, useState } from 'react';

const STEP = 2200; // ms each word stays

// Words that roll up one after another in a fixed-height slot; the slot's width follows the current word.
// The first word is repeated at the end so the loop can jump back to it without a visible reset.
export default function Rotator({ words }) {
  const list = [...words, words[0]];
  const [i, setI] = useState(0);
  const [snap, setSnap] = useState(false);
  const [width, setWidth] = useState(null);
  const [still, setStill] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setStill(true);
    const t = setInterval(() => setI((n) => n + 1), STEP);
    return () => clearInterval(t);
  }, []);

  // After sliding onto the repeated first word, jump back to the real one with no transition
  useEffect(() => {
    if (i < words.length) return;
    const t = setTimeout(() => {
      setSnap(true);
      setI(0);
      requestAnimationFrame(() => requestAnimationFrame(() => setSnap(false)));
    }, 700);
    return () => clearTimeout(t);
  }, [i, words.length]);

  useEffect(() => {
    const measure = () => setWidth(refs.current[i]?.offsetWidth || null);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [i]);

  // Reduced motion: the whole list, no movement
  if (still) return <span style={{ whiteSpace: 'normal' }}>{words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1]}</span>;

  return (
    <span className={'rotator' + (snap ? ' is-snap' : '')} style={width ? { width } : undefined} aria-hidden="true">
      <span className="rotator-track" style={{ transform: `translateY(${-i * 1.2}em)` }}>
        {list.map((w, k) => (
          <span key={k} ref={(el) => (refs.current[k] = el)}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
