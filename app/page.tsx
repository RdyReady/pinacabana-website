import Image from 'next/image';
import Link from 'next/link';
import './page.css';
import logoImg from '../public/logo.jpg';
import HeroVideo from '../components/HeroVideo';
import Countdown from '../components/Countdown';
import ScrollReveal from '../components/ScrollReveal';
import UpcomingEventsStrip from '../components/UpcomingEventsStrip';
import {
  LAUNCH_DATE,
  IG_URL,
  IG_HANDLE,
  REY_IG_URL,
  REY_IG_HANDLE,
  LOCATION,
  PHONE_DISPLAY,
  PHONE_TEL,
  EMAIL,
} from '../lib/constants';

const services = [
  {
    title: 'Weddings',
    blurb: 'Beach ceremonies and receptions, signature drinks tailored to the couple.',
  },
  {
    title: 'Private Events',
    blurb: 'Birthdays, anniversaries, intimate gatherings — proper cocktails, no fuss.',
  },
  {
    title: 'Beach & Villa Pop-ups',
    blurb: 'Sunset sessions, villa rentals, and boutique resort takeovers.',
  },
  {
    title: 'Brand Activations',
    blurb: 'Launches, photoshoots, and brand experiences with bar service that performs.',
  },
];

const galleryImages = [
  { src: '/gallery/01-cocktails-trio.jpg', alt: 'Three cocktails on tile coasters under a thatched umbrella' },
  { src: '/gallery/02-tequila-bottles.jpg', alt: 'Premium tequila and mezcal bottles with the sea behind' },
  { src: '/gallery/03-thatch-detail.jpg', alt: 'Thatched umbrella detail above the bar' },
  { src: '/gallery/05-margaritas.jpg', alt: 'Pink margaritas and a tropical highball with pineapple garnish' },
];

const featureImage = {
  src: '/gallery/04-bar-wide.jpg',
  alt: 'Piña Cabana mobile bar setup at sunset on Boracay beach',
};

export default function Home() {
  return (
    <main id="top">
      {/* HERO */}
      <section className="hero-section">
        <HeroVideo />
        <div className="hero-overlay" />

        <div className="container hero-content">
          <span className="hero-eyebrow fade-in">
            <span className="eyebrow-line" aria-hidden="true" />
            BORACAY ISLAND · OPENING JUNE 30, 2026
            <span className="eyebrow-line" aria-hidden="true" />
          </span>

          <div className="logo-container fade-in delay-1">
            <Image
              src={logoImg}
              alt="Piña Cabana Logo"
              width={140}
              height={140}
              className="logo-image"
              priority
            />
          </div>

          <h1 className="hero-title fade-in delay-2">
            Piña Cabana
            <br />
            <span className="text-gradient">Mobile Cocktail Bar</span>
          </h1>

          <p className="hero-tagline fade-in delay-3">
            Proper cocktails and honest service — this level isn&apos;t limited to high-end bars.
          </p>

          <div className="fade-in delay-4 hero-countdown-wrap">
            <Countdown target={LAUNCH_DATE} variant="large" />
          </div>

          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hero-cta fade-in delay-5"
          >
            Follow {IG_HANDLE}
          </a>

          <span className="hero-cta-sub fade-in delay-5">
            Inquiries &amp; bookings via Instagram DM
          </span>
        </div>

        <span className="hero-scroll-cue" aria-hidden="true">
          <span className="hero-scroll-cue-dot" />
        </span>
      </section>

      {/* WHAT WE DO */}
      <section className="services-section">
        <ScrollReveal>
          <div className="container">
            <h2 className="section-eyebrow">What We Do</h2>
            <h3 className="section-heading">Built for the moments that matter</h3>
            <p className="section-sub">
              Anywhere on Boracay — your venue, our bar. Inquire on Instagram to lock your date.
            </p>

            <div className="services-grid">
              {services.map((s, i) => (
                <ScrollReveal key={s.title} delay={i * 80} className="services-grid-item">
                  <a
                    href={IG_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="service-card"
                  >
                    <span className="service-card-num">0{i + 1}</span>
                    <h4 className="service-card-title">{s.title}</h4>
                    <p className="service-card-blurb">{s.blurb}</p>
                    <span className="service-card-cta">
                      Inquire on Instagram <span aria-hidden="true">→</span>
                    </span>
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* MEET REY */}
      <section className="rey-section">
        <ScrollReveal>
          <div className="container rey-grid">
            <div className="rey-mosaic">
              <div className="rey-mosaic-feature">
                <Image
                  src="/rey/02-hat-portrait.jpg"
                  alt="Rey — head bartender and owner of Piña Cabana"
                  fill
                  sizes="(max-width: 900px) 100vw, 50vw"
                  className="rey-mosaic-img"
                  priority
                />
              </div>
              <div className="rey-mosaic-supporting">
                <div className="rey-mosaic-thumb">
                  <Image
                    src="/rey/01-polo.jpg"
                    alt="Rey behind the bar"
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    className="rey-mosaic-img"
                  />
                </div>
                <div className="rey-mosaic-thumb">
                  <Image
                    src="/rey/03-pouring.jpg"
                    alt="Rey pouring a cocktail"
                    fill
                    sizes="(max-width: 900px) 50vw, 25vw"
                    className="rey-mosaic-img"
                  />
                </div>
              </div>
            </div>
            <div className="rey-content">
              <span className="section-eyebrow">Meet the Bartender</span>
              <h3 className="section-heading">Rey — proudly behind every pour.</h3>
              <p className="rey-bio">
                Owner and head bartender. Trained in classics, devoted to local fruit, fixed
                on hospitality that feels like home. Every drink at Piña Cabana goes through Rey&apos;s hands.
              </p>
              <a
                href={REY_IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rey-ig-link"
              >
                <span className="rey-ig-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </span>
                Follow Rey on Instagram — {REY_IG_HANDLE}
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* UPCOMING EVENTS STRIP */}
      <UpcomingEventsStrip />

      {/* PHILOSOPHY */}
      <section className="philosophy-section">
        <ScrollReveal>
          <div className="container">
            <span className="section-eyebrow">The Spirit</span>
            <h3 className="section-heading">Three things we don&apos;t compromise on.</h3>

            <div className="philosophy-split">
              <div className="philosophy-video-wrapper">
                <video autoPlay loop muted playsInline className="working-video">
                  <source src="/working.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="philosophy-content">
                <div className="philosophy-item">
                  <span className="philosophy-num">01</span>
                  <h4>Local First</h4>
                  <p>
                    Sourcing fresh local fruits and partnering with island locals — our growth
                    directly supports Boracay.
                  </p>
                </div>

                <div className="philosophy-item">
                  <span className="philosophy-num">02</span>
                  <h4>Filipino Hospitality</h4>
                  <p>
                    Built on world-renowned Filipino warmth. You feel like family the moment you
                    step up to the bar.
                  </p>
                </div>

                <div className="philosophy-item">
                  <span className="philosophy-num">03</span>
                  <h4>High Value, No Pretense</h4>
                  <p>
                    Proper cocktails and top-tier service shouldn&apos;t be exclusive or
                    exorbitant. Premium experience at honest pricing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* MOOD GALLERY */}
      <section className="gallery-section">
        <ScrollReveal>
          <div className="container">
            <span className="section-eyebrow">The Vibe</span>
            <h3 className="section-heading">Sand, sunset, and a properly cold glass.</h3>

            <div className="gallery-mosaic">
              <ScrollReveal className="gallery-feature">
                <div className="gallery-img-wrap">
                  <Image
                    src={featureImage.src}
                    alt={featureImage.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className="gallery-img"
                  />
                </div>
              </ScrollReveal>

              <div className="gallery-supporting">
                {galleryImages.map((img, i) => (
                  <ScrollReveal key={img.src} delay={i * 60} className="gallery-supporting-item">
                    <div className="gallery-img-wrap">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 900px) 50vw, 25vw"
                        className="gallery-img"
                      />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <a href="#top" className="back-to-top" aria-label="Back to top">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span>Top</span>
        </a>
        <ScrollReveal>
          <div className="container footer-inner">
            <div className="footer-brand">
              <Image
                src={logoImg}
                alt="Piña Cabana"
                width={64}
                height={64}
                className="footer-logo"
              />
              <span className="footer-name">Piña Cabana</span>
              <span className="footer-tag">Mobile Cocktail Bar</span>
            </div>

            <div className="footer-launch">
              <span className="footer-launch-label">Opening</span>
              <span className="footer-launch-date">June 30, 2026</span>
              <Countdown target={LAUNCH_DATE} variant="large" />
            </div>

            <div className="footer-meta">
              <p className="footer-location">{LOCATION}</p>
              <p className="footer-inquiry">Inquire &amp; book via Instagram DM</p>
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary footer-cta"
              >
                Follow {IG_HANDLE}
              </a>
              <ul className="footer-contact">
                <li>
                  <a href={`tel:${PHONE_TEL}`} className="footer-contact-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <span>{PHONE_DISPLAY}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="footer-contact-link">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <span>{EMAIL}</span>
                  </a>
                </li>
                <li>
                  <Link href="/events" className="footer-contact-link footer-contact-cal">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>View calendar</span>
                  </Link>
                </li>
              </ul>
            </div>

            <p className="footer-copyright">© 2026 Piña Cabana. All rights reserved.</p>
          </div>
        </ScrollReveal>
      </footer>
    </main>
  );
}
