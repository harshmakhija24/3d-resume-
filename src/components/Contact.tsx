import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <section className="contact-section section-container" id="contact" aria-labelledby="contact-title">
      <div className="contact-container">
        <div className="contact-intro">
          <p className="section-kicker">06 / LET&apos;S TALK</p>
          <h2 id="contact-title" className="contact-title">
            Build something <span>useful.</span>
          </h2>
          <p className="contact-lede">
            If the problem sits between product, people, and growth, I&apos;d be glad to talk through it.
          </p>
        </div>

        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <a
              href="https://www.linkedin.com/in/harshmakhija24/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward aria-hidden="true" />
            </a>
            <a
              href="mailto:harsh.makhija24@iimb.ac.in"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward aria-hidden="true" />
            </a>
            <p className="contact-detail">+91 8302079889</p>
          </div>

          <div className="contact-box">
            <h4>Education</h4>
            <p>BBA, Indian Institute of Management Bangalore — 2024–Present</p>
            <p>Diploma in Advertising, NAEMD (IGNOU) — 2023–2024 · 7.33 CGPA · Rank 4/41</p>
          </div>

          <div className="contact-box contact-signature">
            <h4>Built with intent</h4>
            <p>Designed and developed by <strong>Harsh Makhija</strong>.</p>
            <h5>
              <MdCopyright aria-hidden="true" /> 2026
            </h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
