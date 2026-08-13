import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm a BBA student at IIM Bangalore, working at the intersection of business strategy and AI-driven product development.
        </p>
        <p className="para">
          I call it secure vibecoding — rapidly prototyping and shipping real, scalable systems (AI chatbots, LLM engines, RBAC infrastructure) for IIMBx and live commercial platforms, without the traditional dev bottleneck.
        </p>
        <p className="para about-stats">
          <span className="stat-line"><strong className="stat-number">12,000+</strong> <span className="stat-text">users scaled in 45 days</span></span>
          <span className="stat-line"><strong className="stat-number">₹12Cr+</strong> <span className="stat-text">in events managed</span></span>
          <span className="stat-line"><strong className="stat-number">10,000+</strong> <span className="stat-text">lives touched through social impact work</span></span>
        </p>
        <p className="para">
          Technology and business, built to move together.
        </p>
      </div>
    </div>
  );
};

export default About;
