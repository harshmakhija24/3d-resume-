import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <p className="section-kicker">02 / CONTEXT</p>
        <h3 className="title">About Me</h3>
        <p className="para">
          I&apos;m a BBA student at IIM Bangalore who works at the intersection of business strategy,
          product development, and practical AI.
        </p>
        <p className="para">
          My edge is moving from a question to a working system quickly: shaping the idea,
          validating the experience, and using modern AI tools to prototype responsibly. I&apos;ve
          built chatbots, recommendation engines, RBAC-backed platforms, and growth systems for
          both institutional and commercial contexts.
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
          I like work that connects a clear business objective to something people can actually
          use.
        </p>
      </div>
    </div>
  );
};

export default About;
