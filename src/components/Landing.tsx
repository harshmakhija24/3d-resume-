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
            <span>Business strategy · Product · AI</span>
          </div>
          <h2>Hello, I&apos;m</h2>
          <h1 id="hero-title">
            Harsh
            <span>Makhija</span>
          </h1>
          <p className="landing-role">BBA · IIM Bangalore / Product strategy · Builder</p>
        </div>

        <div className="landing-info">
          <p className="landing-eyebrow">BUSINESS × TECHNOLOGY</p>
          <h3>I turn ambitious ideas into useful systems.</h3>
          <p className="landing-tagline">
            I work across business strategy, product thinking, and practical AI — from early
            prototypes to platforms used by real communities.
          </p>

          <div className="landing-stats" aria-label="Selected impact metrics">
            <div className="stat-item">
              <span className="stat-value accent-tech">12K+</span>
              <span className="stat-label">Users in 45 days</span>
            </div>
            <div className="stat-item">
              <span className="stat-value accent-tech">₹12Cr+</span>
              <span className="stat-label">Event value managed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value accent-tech">10K+</span>
              <span className="stat-label">People served through NGO work</span>
            </div>
          </div>

          <div className="landing-ctas">
            <a href="#work" className="btn btn-primary">
              Explore selected work <span aria-hidden="true">↗</span>
            </a>
          </div>
          <p className="landing-note">Scroll to see the products, communities, and experiences behind the numbers.</p>
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
