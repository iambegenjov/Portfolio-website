'use client';

import { useEffect } from 'react';

// The home page flips to dark once the section above Works has scrolled fully above the viewport
export default function DarkFlip() {
  useEffect(() => {
    const before = document.getElementById('work')?.previousElementSibling;
    if (!before) return;
    const update = () => document.body.classList.toggle('is-dark', before.getBoundingClientRect().bottom <= 0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      document.body.classList.remove('is-dark');
    };
  }, []);
  return null;
}
