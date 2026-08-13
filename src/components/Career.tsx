import { useState, useCallback } from "react";
import "./styles/Career.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const careerTimeline = [
  {
    title: "Tech Intern",
    company: "IIMBx",
    duration: "NOW",
    description: "Architected a B2B Course Suggestion Engine utilizing TF-IDF matching and LLMs for reduced token sizing. Developed an AI Management Intelligence System and Executive Monitoring Dashboard for project metrics.",
    themeClass: "accent-tech"
  },
  {
    title: "BBA Student",
    company: "IIM Bangalore",
    duration: "NOW",
    description: "Pursuing Bachelor of Business Administration at India's premier management institute. Led \"Learning Lab\" initiative managing curriculum for 150+ students. Studying Business Statistics, Digital Marketing, and Social Media for Business.",
    themeClass: "accent-business"
  },
  {
    title: "Non-Executive Director",
    company: "Aham Aatm Deepah Association",
    duration: "2024–26",
    description: "Helped scale community initiatives impacting 10,000+ beneficiaries. Led the GMCKS Shiksha Project, building holistic learning initiatives focused on academics and life skills. Managed strategic closure in March 2026.",
    themeClass: "accent-business"
  },
  {
    title: "Project Intern",
    company: "IIM Bangalore",
    duration: "2025–26",
    description: "Served from July 22, 2025 to Jan 2, 2026. Supported talent acquisition by screening 1,000+ candidates for institutional programs. Produced 25+ short-form videos and podcasts. Drafted the Zonal Representative Charter and redesigned the DBE retake exam policy.",
    themeClass: "accent-business"
  },
  {
    title: "Global Cohort Program",
    company: "Hiroshima University, Japan",
    duration: "2024–25",
    description: "Agile COIL e-START Program. Selected by IIM Bangalore for a global cohort across 10 Asia-Pacific/European universities, collaborating on disaster resilience and community health.",
    themeClass: "accent-business"
  },
  {
    title: "Co-Founder",
    company: "Last Life · E-Sports",
    duration: "2024",
    description: "Launched and scaled an e-sports tournament platform to 12,000+ users in just 45 days. Generated ₹1.5 Lakh+ revenue with a 25% net profit margin through strategic marketing and partnerships.",
    themeClass: "accent-business"
  },
  {
    title: "Diploma – Advertising",
    company: "NAEMD · IGNOU",
    duration: "2023–24",
    description: "Diploma in Advertising, Media, Events & Public Relations. Graduated with Distinction — GPA 7.33/10, Rank 4 out of 41. Worked with Zingolu Organisers managing logistics for events valued at ₹12 Crore.",
    themeClass: "accent-business"
  }
];

const Career = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? careerTimeline.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === careerTimeline.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="career-section" id="career">
      <div className="career-container section-container">
        <h2>
          My <span>Career</span>
        </h2>

        <div className="career-carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="career-carousel-arrow career-carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous role"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="career-carousel-arrow career-carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next role"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="career-carousel-track-container">
            <div
              className="career-carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {careerTimeline.map((item, index) => (
                <div className="career-carousel-slide" key={index}>
                  <div className="career-carousel-content">
                    <div className="career-carousel-info">
                      <div className="career-carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="career-carousel-details">
                        <h4 className={item.themeClass}>{item.title}</h4>
                        <p className="career-carousel-company">
                          {item.company}
                        </p>
                        <div className="career-carousel-tools">
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="career-carousel-image-wrapper">
                       <h2 className={`massive-year ${item.themeClass}`}>{item.duration}</h2>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="career-carousel-dots">
            {careerTimeline.map((_, index) => (
              <button
                key={index}
                className={`career-carousel-dot ${
                  index === currentIndex ? "career-carousel-dot-active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to role ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
