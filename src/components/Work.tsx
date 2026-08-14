import { useCallback, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import WorkImage from "./WorkImage";
import "./styles/Work.css";

type Project = {
  title: string;
  category: string;
  tools: string;
  outcome: string;
  image: string;
  link?: string;
  linkLabel?: string;
  themeClass: "accent-tech" | "accent-business";
};

const projects: Project[] = [
  {
    title: "KrishiTech",
    category: "Digital product · Full-stack overhaul",
    tools: "AI chatbot · multilingual LLM workflows · Supabase RBAC",
    outcome:
      "A farmer-first agriculture platform with product discovery, dealer journeys, and KrishiBot AI support.",
    image: import.meta.env.BASE_URL + "images/preview1.png",
    link: "https://krishitek-website.vercel.app",
    linkLabel: "Open live site",
    themeClass: "accent-tech",
  },
  {
    title: "Wandr",
    category: "Product concept · DDT project",
    tools: "Group preference matching · safety scoring · local experiences",
    outcome:
      "A group-travel flow that turns competing preferences into a shared, safety-aware shortlist.",
    image: import.meta.env.BASE_URL + "images/events.png",
    link: "https://harshmakhija24.github.io/DDT-PROJECT-/",
    linkLabel: "View live prototype",
    themeClass: "accent-tech",
  },
  {
    title: "Last Life",
    category: "Venture · E-sports platform",
    tools: "Platform launch · community growth · revenue generation",
    outcome:
      "Built and launched a platform that reached 12,000+ users in 45 days and generated ₹1.5L+ in revenue.",
    image: import.meta.env.BASE_URL + "images/lastlife.png",
    themeClass: "accent-business",
  },
  {
    title: "Aham Aatm Deepah",
    category: "Social impact · NGO initiative",
    tools: "Community outreach · wellbeing · education, food & clothing",
    outcome:
      "Supported community programs that served more than 10,000 people through practical, local initiatives.",
    image: import.meta.env.BASE_URL + "images/ngo.png",
    themeClass: "accent-business",
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
      window.setTimeout(() => setIsAnimating(false), 400);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <section className="work-section" id="work" aria-labelledby="work-title">
      <div className="work-container section-container">
        <div className="work-heading-row">
          <div>
            <p className="section-kicker">Selected work</p>
            <h2 id="work-title">
              Products with a <span>point of view.</span>
            </h2>
          </div>
          <p className="work-heading-note">
            A small set of products, ventures, and community systems I have helped shape.
          </p>
        </div>

        <div className="carousel-wrapper">
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

          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {projects.map((project, index) => (
                <article className="carousel-slide" key={project.title}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-details">
                        <span className={`carousel-number-tag ${project.themeClass}`}>
                          PROJECT 0{index + 1}
                        </span>
                        <h3 className={`carousel-title ${project.themeClass}`}>
                          {project.title}
                        </h3>
                        <h4 className="carousel-category">{project.category}</h4>
                        <div className="carousel-tools">
                          <span className="tools-label">What I worked on</span>
                          <p>{project.tools}</p>
                        </div>
                        <div className="carousel-outcome">
                          <span className="tools-label">Why it matters</span>
                          <p>{project.outcome}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage
                        image={project.image}
                        alt={`${project.title} project preview`}
                        link={project.link}
                        linkLabel={project.linkLabel}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="carousel-footer">
            <div className="carousel-dots" aria-label="Project navigation">
              {projects.map((project, index) => (
                <button
                  key={project.title}
                  className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to ${project.title}`}
                  data-cursor="disable"
                />
              ))}
            </div>
            <span className="carousel-index">
              {String(currentIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
