import "./styles/About.css";

const focusAreas = ["Product systems", "Applied AI", "Growth execution"];

const About = () => {
  return (
    <section className="about-section" id="about" aria-labelledby="about-title">
      <div className="about-me">
        <div className="about-heading">
          <p className="section-kicker">02 / CONTEXT</p>
          <h2 className="title" id="about-title">About Me</h2>
        </div>

        <div className="about-content">
          <p className="about-lede">
            I build practical systems where product thinking, applied AI, and growth execution meet.
          </p>
          <p className="para">
            My edge is moving from an ambiguous question to a working product quickly — then making the outcome easier to understand, adopt, and measure. I have built executive dashboards, AI-enabled interfaces, course intelligence workflows, and community-facing products from the user need backwards.
          </p>

          <div className="about-focuses" aria-label="Core working areas">
            {focusAreas.map((focus) => (
              <span className="focus-chip" key={focus}>{focus}</span>
            ))}
          </div>

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
            I do my best work where a clear business objective meets something people can actually use — and where the team can see whether it worked.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
