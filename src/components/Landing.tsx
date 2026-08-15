import { PropsWithChildren } from "react";
import { TbNotes } from "react-icons/tb";
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
            <span>AI product · Growth systems · Strategy</span>
          </div>
          <p className="landing-greeting">Hello, I&apos;m</p>
          <h1 id="hero-title">
            <span className="hero-first-name">Harsh</span>
            <span className="hero-last-name">Makhi<span className="hero-j">j</span>a</span>
          </h1>
        </div>

        <div className="landing-info">
          <p className="landing-eyebrow">AI × GROWTH</p>
          <h2>I turn AI-enabled ideas into useful systems.</h2>
          <p className="landing-tagline">
            I connect product thinking, practical AI, and growth execution — from Gemini-enabled dashboards to platforms adopted by real communities.
          </p>

          <div className="landing-ctas">
            <a href="#work-projects" className="btn btn-primary">
              Explore selected work <span aria-hidden="true">↗</span>
            </a>
            <a
              href={import.meta.env.BASE_URL + "HarshMakhija.pdf"}
              className="btn landing-cv-btn"
              target="_blank"
              rel="noreferrer"
            >
              View CV <TbNotes aria-hidden="true" />
            </a>
          </div>
          <p className="landing-note">Products, communities, and experiences behind the numbers.</p>
        </div>

        <div className="landing-bottom-bar">
          <p className="landing-role">BBA · IIM BANGALORE / PRODUCT + GROWTH BUILDER</p>
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
