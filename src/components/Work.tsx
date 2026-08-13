import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "Krishitek Digital Platform",
    category: "Full-Stack Overhaul",
    tools: "Serverless AI Chatbot, LLM Multilingual Translation, Supabase RBAC",
    image: import.meta.env.BASE_URL + "images/krishitek.png",
    link: "https://krishitek-website.vercel.app",
    themeClass: "accent-tech"
  },
  {
    title: "Wandr",
    category: "Group Travel Discovery Platform",
    tools: "Group-quiz preference-matching algorithm, Destination safety scoring",
    image: import.meta.env.BASE_URL + "images/events.png", // Valid image from folder
    link: "https://harshmakhija24.github.io/DDT-PROJECT-",
    themeClass: "accent-tech"
  },
  {
    title: "Last Life",
    category: "E-Sports Tournament Platform",
    tools: "Platform Launch, Community Growth, Revenue Generation, Marketing",
    image: import.meta.env.BASE_URL + "images/lastlife.png",
    link: "https://linkedin.com/in/harshmakhija24",
    themeClass: "accent-business"
  },
  {
    title: "Aham Aatm Deepah Association",
    category: "Social Impact Initiative",
    tools: "Community Outreach, Mental Health, Pranic Healing, Food & Clothing",
    image: import.meta.env.BASE_URL + "images/ngo.png",
    link: "https://linkedin.com/in/harshmakhija24",
    themeClass: "accent-business"
  },
];

const Work = () => {
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
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-details">
                        <span className={`carousel-number-tag ${project.themeClass}`}>
                          PROJECT 0{index + 1}
                        </span>
                        <h3 className={`carousel-title ${project.themeClass}`}>{project.title}</h3>
                        <h4 className="carousel-category">
                          {project.category}
                        </h4>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={project.title}
                        link={project.link}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
