import { useRef } from "react";
import "./styles/Career.css";

const careerTimeline = [
  {
    year: "2024 — now",
    title: "BBA Student",
    company: "Indian Institute of Management Bangalore",
    description:
      "Studying business while leading Learning Lab, a student initiative that shaped curriculum and learning experiences for 150+ students.",
    tag: "EDUCATION"
  },
  {
    year: "2024 — 2026",
    title: "Non-Executive Director",
    company: "Aham Aatm Deepah",
    description:
      "Supported community initiatives that served more than 10,000 people through education, food, clothing, and wellbeing programs.",
    tag: "SOCIAL IMPACT"
  },
  {
    year: "2025 — 2026",
    title: "Project Intern",
    company: "IIM Bangalore",
    description:
      "Screened and shortlisted 1,000+ candidates for research projects, while supporting official social content and producing 25+ videos and podcasts for the institution.",
    tag: "PEOPLE + MEDIA"
  },
  {
    year: "2024 — 2025",
    title: "Global Cohort",
    company: "Hiroshima University · Agile COIL e-START",
    description:
      "Selected for the Agile COIL e-START cohort across 10 universities; contributed comparative Disaster Response & Resilience research and translated the findings into a clear visual presentation.",
    tag: "GLOBAL · CASE STUDY"
  },
  {
    year: "2024",
    title: "Co-Founder",
    company: "Last Life · E-sports",
    description:
      "Launched an e-sports platform that reached 12,000+ users in 45 days, generated ₹1.5 lakh+ in revenue, and achieved a 25% net profit margin.",
    tag: "VENTURE"
  },
  {
    year: "2023 — 2024",
    title: "Diploma in Advertising",
    company: "NAEMD · IGNOU",
    description:
      "Graduated with distinction in Advertising, Media, Events & PR; ranked 4th out of 41 students.",
    tag: "FOUNDATION"
  }
];

const Career = () => {
  const containerRef = useRef<HTMLDivElement>(null);


  return (
    <section className="career-section" id="career" ref={containerRef}>
      <div className="career-container section-container">
        <div className="career-heading">
          <div>
            <p className="section-kicker">03 / TRAJECTORY</p>
            <h2>
              My <span>Career</span>
            </h2>
          </div>
          <p className="career-heading-note">
            A nonlinear path across product, business, community, and technology.
          </p>
        </div>

        <div className="career-timeline">
          {careerTimeline.map((item) => (
            <article className="career-card" key={`${item.year}-${item.title}`}>
              <div className="career-card-marker" aria-hidden="true" />
              <div className="career-card-meta">
                <span className="career-card-year">{item.year}</span>
                <span className="career-card-tag">{item.tag}</span>
              </div>
              <div className="career-card-content">
                <h3>{item.title}</h3>
                <p className="career-card-company">{item.company}</p>
                <p className="career-card-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Career;
