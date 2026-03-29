import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              <a
                href="https://www.linkedin.com/in/harshmakhija24/"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
              >
                LinkedIn — harshmakhija24
              </a>
            </p>
            <p>
              <a
                href="mailto:harsh.makhija24@iimb.ac.in"
                data-cursor="disable"
              >
                harsh.makhija24@iimb.ac.in
              </a>
            </p>
            <p>+91 8302079889</p>
            <h4>Education</h4>
            <p>
              BBA, Indian Institute of Management Bangalore — 2024–Present
            </p>
            <p>
              Diploma in Advertising, NAEMD (IGNOU) — 2023–2024 · Rank 4/41
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://www.linkedin.com/in/harshmakhija24/"
              target="_blank"
              rel="noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              LinkedIn <MdArrowOutward />
            </a>
            <a
              href="mailto:harsh.makhija24@iimb.ac.in"
              data-cursor="disable"
              className="contact-social"
            >
              Email <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Harsh Makhija</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
