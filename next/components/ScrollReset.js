'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// A new page starts at the top (or at its #anchor)
export default function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const target = id && document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'instant' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
