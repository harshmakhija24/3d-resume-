import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <div className="landing-status">
              <span className="status-dot"></span> Currently: Tech Intern @ IIMBx
            </div>
            <h2>Hello! I'm</h2>
            <h1>
              HARSH
              <br />
              <span>MAKHIJA</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>Entrepreneur &</h3>
            <p className="landing-tagline">
              Building at the intersection of business strategy and AI-driven product.
            </p>
            
            <div className="landing-stats">
              <div className="stat-item">
                <span className="stat-label">Users Scaled</span>
                <span className="stat-value accent-tech">12,000+</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Events Managed</span>
                <span className="stat-value accent-tech">₹12Cr+</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Lives Impacted</span>
                <span className="stat-value accent-tech">10,000+</span>
              </div>
            </div>

            <div className="landing-ctas">
              <a href="#work" className="btn btn-primary">View My Work</a>
              <a href="/Harsh_Makhija_CV.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Download Resume</a>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
