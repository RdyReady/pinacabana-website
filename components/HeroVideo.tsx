'use client';
import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const video = ref.current;
    if (!video) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        if (y < vh * 1.2) {
          const t = Math.min(y, vh);
          video.style.transform = `translate3d(0, ${t * 0.25}px, 0) scale(${1 + t * 0.0004})`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      className="hero-video-bg"
    >
      <source src="/hero-bg.mp4" type="video/mp4" />
    </video>
  );
}
