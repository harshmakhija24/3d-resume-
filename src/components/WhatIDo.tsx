import "./styles/WhatIDo.css";

const WhatIDo = () => {
  return (
    <section className="whatIDO section-container" id="what-i-do" aria-labelledby="what-i-do-title">
      <div className="what-intro">
        <p className="section-kicker">04 / OPERATING RANGE</p>
        <h2 id="what-i-do-title" className="what-title">
          What I do
        </h2>
        <p className="what-summary">
          I work between the messy first question and the useful thing a team can actually ship, learn from, and improve.
        </p>
      </div>

      <div className="what-grid">
        <article className="what-card what-card-tech">
          <div className="what-card-index">01</div>
          <div className="what-card-content">
            <p className="what-card-kicker">PRODUCT + AI</p>
            <h3>Build useful systems quickly.</h3>
            <p>
              I use practical AI, lightweight code, and strong product judgment to turn a rough idea into a working prototype, dashboard, or user journey.
            </p>
            <div className="what-tags" aria-label="Product and AI capabilities">
              <span>Rapid prototyping</span>
              <span>Applied AI</span>
              <span>Product systems</span>
            </div>
            <a className="what-link accent-tech" href="#work-projects">
              Explore selected work <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>

        <article className="what-card what-card-community">
          <div className="what-card-index">02</div>
          <div className="what-card-content">
            <p className="what-card-kicker">GROWTH + COMMUNITY</p>
            <h3>Make the work matter to people.</h3>
            <p>
              I connect communication, operations, and community insight to build programs that earn attention, create participation, and leave a measurable footprint.
            </p>
            <div className="what-tags" aria-label="Growth and community capabilities">
              <span>Growth loops</span>
              <span>Community programs</span>
              <span>Clear storytelling</span>
            </div>
            <a className="what-link accent-business" href="#career">
              See the evidence <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};

export default WhatIDo;
