import { IG_URL } from '../lib/constants';
import './FloatingIGButton.css';

export default function FloatingIGButton() {
  return (
    <a
      href={IG_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="floating-ig-btn"
      aria-label="Follow Piña Cabana on Instagram"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
      <span>Follow</span>
    </a>
  );
}
