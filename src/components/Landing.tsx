import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <section className="landing-section" id="landingDiv" aria-labelledby="hero-title">
      <div className="landing-noise" aria-hidden="true" />
      <div className="landing-circle1" aria-hidden="true" />
      <div className="landing-circle2" aria-hidden="true" />
      <div className="landing-grid" aria-hidden="true" />

      <div className="landing-container">
        <div className="landing-intro">
          <div className="landing-status">
            <span className="status-dot" />
            <span>Available for ambitious builds</span>
          </div>
          <p className="landing-eyebrow">01 / PROFILE</p>
          <h2>Hello, I&apos;m</h2>
          <h1 id="hero-title">
            Harsh
            <span>Makhija</span>
          </h1>
          <p className="landing-role">Entrepreneur · Product strategist · Builder</p>
        </div>

        <div className="landing-info">
          <p className="landing-eyebrow">BUSINESS × TECHNOLOGY</p>
          <h3>Making complex ideas useful.</h3>
          <p className="landing-tagline">
            I build products, communities, and growth systems where business strategy meets
            practical AI.
          </p>

          <div className="landing-stats" aria-label="Selected impact metrics">
            <div className="stat-item">
              <span className="stat-value accent-tech">12K+</span>
              <span className="stat-label">Users reached</span>
            </div>
            <div className="stat-item">
              <span className="stat-value accent-business">₹12Cr+</span>
              <span className="stat-label">Event value managed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value accent-tech">10K+</span>
              <span className="stat-label">Lives impacted</span>
            </div>
          </div>

          <div className="landing-ctas">
            <a href="#work" className="btn btn-primary">
              Explore selected work <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`${import.meta.env.BASE_URL}Harsh_Makhija_CV.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download="Harsh_Makhija_CV.pdf"
              className="btn btn-secondary"
            >
              View CV <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="landing-note">The character reacts to your movement. Scroll to see the work behind it.</p>
        </div>
      </div>

      <div className="landing-scroll-cue" aria-hidden="true">
        <span>Scroll to explore</span>
        <span className="scroll-line" />
      </div>
      {children}
    </section>
  );
};

export default Landing;
