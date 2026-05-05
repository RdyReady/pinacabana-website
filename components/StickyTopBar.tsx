'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Countdown from './Countdown';
import { LAUNCH_DATE, IG_URL, IG_HANDLE } from '../lib/constants';
import './StickyTopBar.css';

export default function StickyTopBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Public chrome only — never on /admin routes.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className={`sticky-top-bar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="sticky-top-bar-inner">
        <span className="sticky-top-bar-label">
          <span className="dot" aria-hidden="true" />
          <span className="sticky-top-bar-label-text">Opening June 30, 2026</span>
        </span>
        <div className="sticky-top-bar-countdown">
          <Countdown target={LAUNCH_DATE} variant="mini" showLabels={true} />
        </div>
        <Link href="/events" className="sticky-top-bar-link">
          Calendar
        </Link>
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-top-bar-cta"
        >
          Follow {IG_HANDLE}
        </a>
      </div>
    </div>
  );
}
