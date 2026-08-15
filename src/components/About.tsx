import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <p className="section-kicker">02 / CONTEXT</p>
        <h3 className="title">About Me</h3>
        <p className="para">
          I&apos;m a BBA(DBE) student at IIM Bangalore building at the intersection of product, growth, and applied AI.
        </p>
        <p className="para">
          My edge is moving from a question to a working system quickly. I have engineered executive dashboards, integrated Gemini AI into a conversational interface, and shaped products, journeys, and growth systems from the user need backwards.
        </p>
        <div className="about-stats" aria-label="Selected experience highlights">
          <span className="stat-line">
            <strong className="stat-number">12,000+</strong>
            <span className="stat-text">users reached in 45 days through Last Life</span>
          </span>
          <span className="stat-line">
            <strong className="stat-number">₹12Cr+</strong>
            <span className="stat-text">of event value managed through event work</span>
          </span>
          <span className="stat-line">
            <strong className="stat-number">10,000+</strong>
            <span className="stat-text">people served through NGO and community initiatives</span>
          </span>
        </div>
        <p className="para about-close">
          I do my best work where a clear business objective meets something people can actually use — and where the team can measure whether it worked.
        </p>
      </div>
    </div>
  );
};

export default About;
