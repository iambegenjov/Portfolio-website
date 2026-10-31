'use client';

import { useEffect, useRef, useState } from 'react';


const COPIES = 3; // the set repeats so the strip can loop without a visible seam
const SPEED = 70; // pixels per second

// An endless sideways strip of small pill photos. It keeps drifting left, even on hover;
// hovering (or tapping) a photo pops it up large, and moving off it shrinks it back.
export default function Events({ event, first }) {
  const { photos } = event;
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setManual(reduce);
    const stage = stageRef.current;
    const track = trackRef.current;
    const items = () => [...track.querySelectorAll('.moment')];
    const setActive = (el) => items().forEach((o) => o.classList.toggle('is-active', o === el));

    // Touch screens: the photo passing the middle of the screen pops up by itself (see tick)
    const touch = window.matchMedia('(hover: none)').matches;
    const onClick = (e) => {
      if (touch && !reduce) return;
      const m = e.target.closest('.moment');
      if (m) setActive(m.classList.contains('is-active') ? null : m);
    };
    track.addEventListener('click', onClick);

    if (reduce) {
      const onOver = (e) => {
        const m = e.target.closest('.moment');
        if (m) setActive(m);
      };
      track.addEventListener('mouseover', onOver);
      return () => {
        track.removeEventListener('click', onClick);
        track.removeEventListener('mouseover', onOver);
      };
    }

    // The photos move under a still mouse, so the hovered photo is worked out from the pointer every frame
    let pointer = null;
    let offset = 0;
    let inView = true;
    const onMove = (e) => (pointer = { x: e.clientX, y: e.clientY });
    const onLeave = () => {
      pointer = null;
      setActive(null);
    };
    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting));
    io.observe(stage);

    let raf = 0;
    let last = 0;
    const tick = (time) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      if (!inView) return;
      if (pointer) {
        const under = document.elementFromPoint(pointer.x, pointer.y);
        const hit = under && under.closest('.moment');
        if (!hit || !hit.classList.contains('is-active')) setActive(hit && track.contains(hit) ? hit : null);
      } else if (touch) {
        const r = stage.getBoundingClientRect();
        const y = r.top + r.height / 2;
        if (y > innerHeight * 0.2 && y < innerHeight * 0.8) {
          const under = document.elementFromPoint(innerWidth / 2, y);
          const hit = under && under.closest('.moment');
          if (hit && track.contains(hit) && !hit.classList.contains('is-active')) setActive(hit);
        } else {
          setActive(null);
        }
      }
      // A popped-up photo changes the width of its set, so measure every frame
      const all = track.children;
      const setWidth = all[photos.length].offsetLeft - all[0].offsetLeft;
      if (setWidth) {
        offset -= SPEED * dt;
        if (offset <= -setWidth) offset += setWidth;
        track.style.transform = `translate3d(${offset}px,0,0)`;
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      track.removeEventListener('click', onClick);
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }, [photos.length]);

  const sets = manual ? 1 : COPIES;

  return (
    <section className="events" id={first ? 'events' : `events-${event.slug}`}>
      <div className="wrap events-head">
        {first && <p className="eyebrow">Events</p>}
        {event.logo &&
          (event.logo.mono ? (
            <span
              className="events-logo"
              role="img"
              aria-label={`${event.title.split('\n')[0]} logo`}
              style={{ aspectRatio: event.logo.ratio, WebkitMaskImage: `url('${event.logo.src}')`, maskImage: `url('${event.logo.src}')` }}
            />
          ) : (
            <img className="events-logo" src={event.logo.src} alt={`${event.title.split('\n')[0]} logo`} style={{ aspectRatio: event.logo.ratio }} />
          ))}
        <h2>
          {event.title.split('\n').map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h2>
        {event.story && (
          <div className="events-story">
            <p>{event.story}</p>
          </div>
        )}
      </div>
      <div className={'moments-stage' + (manual ? ' is-manual' : '')} ref={stageRef}>
        <div className="moments-track" ref={trackRef}>
          {Array.from({ length: sets }).flatMap((_, c) =>
            photos.map((m, i) => (
              <figure className="moment" key={`${c}-${i}`} style={{ '--r': m.ratio }} aria-hidden={c > 0 ? 'true' : undefined}>
                <img src={m.src} alt={c > 0 ? '' : m.alt} loading={c > 0 ? 'lazy' : undefined} draggable="false" />
              </figure>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
