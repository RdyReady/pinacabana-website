import Image from "next/image";
import "./page.css";
import logoImg from "../public/logo.jpg";
import reyImg from "../public/rey.jpg";

export default function Home() {
  return (
    <main>
      <section className="hero-section">
       <video 
         autoPlay 
         loop 
         muted 
         playsInline 
         className="hero-video-bg"
       >
         <source src="/hero-bg.mp4" type="video/mp4" />
       </video>
       <div className="hero-overlay"></div>
       
       <div className="container hero-content fade-in">
          <div className="logo-container">
            <Image 
              src={logoImg} 
              alt="Piña Cabana Logo" 
              width={180} 
              height={180}
              className="logo-image"
              priority
            />
          </div>
          
          <h1 className="hero-title delay-1 fade-in">
            Piña Cabana<br/>
            <span className="text-gradient">Mobile Cocktail Bar</span>
          </h1>
          
          <p className="hero-tagline delay-2 fade-in">
            Proper cocktails and honest service—this level isn't limited to high-end bars.
          </p>

          <div className="glass-panel delay-3 fade-in info-panel">
            <p className="description">
              A premium Tequila & Mezcal mobile bar experience, coming soon to Boracay Island, Aklan. We craft our drinks with fresh local fruits, handmade syrups, and an absolute passion for agave.
            </p>
            
            <div className="bartender-profile">
              <Image 
                src={reyImg} 
                alt="Rey - Head Bartender" 
                width={80} 
                height={80} 
                className="bartender-image"
              />
              <div className="bartender-info">
                <h4>Meet Rey</h4>
                <p>Head Bartender & Owner</p>
                <a href="https://www.instagram.com/reytirement?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="bartender-social">
                  @reytirement
                </a>
              </div>
            </div>

            <div className="cta-divider"></div>

            <h3 className="join-title">Claim Your Discount!</h3>
            <p className="join-subtitle">Follow us on Instagram to secure an exclusive discount on your first booking when we launch.</p>
            
            <a href="https://instagram.com/pinacabana.ph" target="_blank" rel="noopener noreferrer" className="btn-primary instagram-btn">
              Follow @pinacabana.ph
            </a>
          </div>
       </div>
      </section>

      <section className="philosophy-section fade-in delay-4">
        <div className="container">
          <div className="glass-panel philosophy-panel">
            <h3 className="panel-heading">The Piña Cabana Spirit</h3>
            
            <div className="philosophy-split">
              <div className="philosophy-video-wrapper">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="working-video"
                >
                  <source src="/working.mp4" type="video/mp4" />
                </video>
              </div>
              
              <div className="philosophy-content">
                <div className="philosophy-item">
                  <h4>Local First</h4>
                  <p>We are deeply committed to social responsibility and building a strong local community. By sourcing fresh local fruits and partnering with island locals, our growth directly supports Boracay.</p>
                </div>
                
                <div className="philosophy-item">
                  <h4>Filipino Hospitality</h4>
                  <p>Our core is built on the world-renowned Filipino warmth. Every cocktail served is accompanied by genuine care, ensuring you feel like family the moment you step up to our bar.</p>
                </div>
                
                <div className="philosophy-item">
                  <h4>High Value, No Pretense</h4>
                  <p>Proper cocktails and top-tier service shouldn't be exclusive or exorbitant. We deliver a truly premium experience at honest pricing, proving that high value and accessibility go hand in hand.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
