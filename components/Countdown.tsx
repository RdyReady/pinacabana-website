'use client';
import { useEffect, useState } from 'react';
import './Countdown.css';

type Variant = 'large' | 'mini';

interface Props {
  target: string;
  variant?: Variant;
  showLabels?: boolean;
}

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

function calculateTimeLeft(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / 1000 / 60) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ target, variant = 'large', showLabels = true }: Props) {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const targetDate = new Date(target);
    setTime(calculateTimeLeft(targetDate));
    const id = setInterval(() => setTime(calculateTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units: { value: number; label: string }[] = time
    ? [
        { value: time.d, label: 'Days' },
        { value: time.h, label: 'Hours' },
        { value: time.m, label: 'Minutes' },
        { value: time.s, label: 'Seconds' },
      ]
    : [
        { value: 0, label: 'Days' },
        { value: 0, label: 'Hours' },
        { value: 0, label: 'Minutes' },
        { value: 0, label: 'Seconds' },
      ];

  return (
    <div
      className={`countdown countdown--${variant}`}
      role="timer"
      aria-live="polite"
      aria-label="Time until launch"
    >
      {units.map((u) => (
        <div key={u.label} className="countdown-unit">
          <div className="countdown-value-wrap">
            <span key={`${u.label}-${u.value}`} className="countdown-value">
              {String(u.value).padStart(2, '0')}
            </span>
          </div>
          {showLabels && <span className="countdown-label">{u.label}</span>}
        </div>
      ))}
    </div>
  );
}
