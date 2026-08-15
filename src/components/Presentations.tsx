import { MdDownload, MdOpenInNew } from "react-icons/md";
import "./styles/Presentations.css";
import DocumentPreview from "./DocumentPreview";

const asset = (path: string) => import.meta.env.BASE_URL + path;

const Presentations = () => {
  return (
    <section className="presentations-section" id="presentations" aria-labelledby="presentations-title">
      <div className="presentations-container section-container">
        <div className="presentations-heading-row">
          <div>
            <p className="section-kicker">Thinking in public</p>
            <h2 id="presentations-title">
              The work behind <span>the work.</span>
            </h2>
          </div>
          <p className="presentations-heading-note">
            Selected decks that show how I frame a problem, synthesize evidence, and make a room care about the answer.
          </p>
        </div>

        <div className="presentation-feature">
          <div className="presentation-copy">
            <span className="presentation-label">Featured case study · Hiroshima University</span>
            <h3>Disaster Response &amp; Resilience</h3>
            <p className="presentation-role">Comparative research · visual synthesis · presentation design</p>
            <p>
              A cross-country analysis of how government systems and local communities respond to disaster. The central insight is practical: resilience is strongest when official capacity and community action reinforce each other.
            </p>
            <div className="presentation-tags" aria-label="Case study themes">
              <span>Japan</span>
              <span>India</span>
              <span>Malaysia</span>
              <span>Community resilience</span>
            </div>
            <div className="presentation-actions">
              <a
                className="presentation-action presentation-action-primary"
                href={asset("presentations/disaster-response-resilience.pdf")}
                target="_blank"
                rel="noreferrer"
              >
                <MdOpenInNew aria-hidden="true" /> Open full PDF
              </a>
              <a
                className="presentation-action"
                href={asset("presentations/disaster-response-resilience.pdf")}
                download="Harsh-Makhija-Disaster-Response-Resilience.pdf"
              >
                <MdDownload aria-hidden="true" /> Download
              </a>
            </div>
          </div>

          <DocumentPreview
            title="Disaster Response & Resilience"
            src={asset("presentations/disaster-response-resilience.pdf")}
            pageLabel="PDF · 16 pages"
            downloadName="Harsh-Makhija-Disaster-Response-Resilience.pdf"
            showActions={false}
          />
        </div>

        <div className="presentation-supporting-grid">
          <article className="presentation-intro-card">
            <DocumentPreview
              className="document-preview-intro"
              title="Harsh Makhija — Intro"
              src={asset("presentations/harsh-makhija-intro.pdf")}
              pageLabel="PDF · 5 slides"
              downloadName="Harsh-Makhija-Intro.pdf"
            />
            <div className="presentation-card-copy">
              <span className="presentation-label">Hiroshima University · personal intro</span>
              <h3>Harsh Makhija — Intro</h3>
              <p>
                A visual introduction built around curiosity, impact, community work, and the dual context of Jaipur and Bengaluru.
              </p>
              <a
                className="presentation-text-link"
                href={asset("presentations/harsh-makhija-intro.pptx")}
                download="Harsh-Makhija-Intro.pptx"
              >
                Download the original PowerPoint <MdDownload aria-hidden="true" />
              </a>
            </div>
          </article>

          <aside className="presentation-proof-card">
            <span className="presentation-label">What this signals</span>
            <h3>Research that can travel.</h3>
            <p>
              I can move from messy real-world context to a clear narrative, then turn that narrative into something a team can discuss, act on, and remember.
            </p>
            <div className="presentation-proof-line">
              <span>01</span>
              <p>Compare systems, not just anecdotes.</p>
            </div>
            <div className="presentation-proof-line">
              <span>02</span>
              <p>Make the insight legible to a mixed audience.</p>
            </div>
            <div className="presentation-proof-line">
              <span>03</span>
              <p>End with action, not decoration.</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Presentations;
