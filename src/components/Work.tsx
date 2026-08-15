import { type KeyboardEvent, type PointerEvent, useCallback, useRef, useState } from "react";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import WorkImage from "./WorkImage";
import "./styles/Work.css";

type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

type Project = {
  title: string;
  category: string;
  tools: string;
  outcome: string;
  image: string;
  link?: string;
  linkLabel?: string;
  gallery?: GalleryImage[];
  themeClass: "accent-tech" | "accent-business";
};

const ahamAatmGallery: GalleryImage[] = [
  {
    src: import.meta.env.BASE_URL + "images/aham-aatm/children-sharing-food.jpeg",
    alt: "Children sharing a meal inside a temporary community shelter",
    caption: "Shared meals, shared dignity.",
  },
  {
    src: import.meta.env.BASE_URL + "images/aham-aatm/food-distribution.jpeg",
    alt: "A child receiving a food container during an outdoor distribution drive",
    caption: "Food distribution in the field.",
  },
  {
    src: import.meta.env.BASE_URL + "images/aham-aatm/community-distribution.jpeg",
    alt: "Volunteers and families gathered during a community distribution drive",
    caption: "Community support, delivered locally.",
  },
];

const projects: Project[] = [
  {
    title: "KrishiTech",
    category: "Digital product · Full-stack overhaul",
    tools: "AI chatbot · multilingual LLM workflows · Supabase RBAC",
    outcome:
      "A farmer-first agriculture platform with product discovery, dealer journeys, and KrishiBot AI support.",
    image: import.meta.env.BASE_URL + "images/preview1.png",
    link: "https://krishitek-website.vercel.app",
    linkLabel: "Experience KrishiTech",
    themeClass: "accent-tech",
  },
  {
    title: "PM Dashboard",
    category: "Built product · Project intelligence demo",
    tools: "Project portfolio · milestone tracking · team ledgers · PM insights",
    outcome:
      "A fictionalized operations dashboard that makes project risk, velocity, and team allocation visible in one working interface.",
    image: import.meta.env.BASE_URL + "images/product-pm-dashboard.svg",
    link: import.meta.env.BASE_URL + "demos/pm-dashboard/",
    linkLabel: "Open PM Dashboard",
    themeClass: "accent-business",
  },
  {
    title: "Course Intelligence",
    category: "Built product · Recommendation operations demo",
    tools: "Course catalogue · explainable recommendations · graph view · CRUD workflows",
    outcome:
      "A working recommendation and catalogue-operations system with local deterministic fallback, filters, graph exploration, and report export.",
    image: import.meta.env.BASE_URL + "images/product-course-intelligence.svg",
    link: import.meta.env.BASE_URL + "demos/suggestion-engine/",
    linkLabel: "Open Course Intelligence",
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
    gallery: ahamAatmGallery,
    themeClass: "accent-business",
  },
];

const AhamAatmGallery = ({ images }: { images: GalleryImage[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  const showPrevious = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const showNext = () => {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <div className="aham-gallery" aria-label="Aham Aatm Deepah field documentation">
      <div className="aham-gallery-frame">
        <img src={activeImage.src} alt={activeImage.alt} loading="lazy" />
        <button
          className="aham-gallery-arrow aham-gallery-arrow-left"
          type="button"
          onClick={showPrevious}
          aria-label="Previous Aham Aatm Deepah photo"
          data-cursor="disable"
        >
          <MdArrowBack aria-hidden="true" />
        </button>
        <button
          className="aham-gallery-arrow aham-gallery-arrow-right"
          type="button"
          onClick={showNext}
          aria-label="Next Aham Aatm Deepah photo"
          data-cursor="disable"
        >
          <MdArrowForward aria-hidden="true" />
        </button>
        <span className="aham-gallery-count">
          {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>
      <div className="aham-gallery-footer">
        <p>{activeImage.caption}</p>
        <div className="aham-gallery-dots" aria-label="Aham Aatm Deepah photo navigation">
          {images.map((image, index) => (
            <button
              key={image.src}
              className={`aham-gallery-dot ${index === activeIndex ? "aham-gallery-dot-active" : ""}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show Aham Aatm Deepah photo ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              data-cursor="disable"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const pointerStartX = useRef<number | null>(null);

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

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(distance) < 48) return;
    if (distance < 0) goToNext();
    else goToPrev();
  };

  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrev();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  };

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

          <div
            className="carousel-track-container"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => { pointerStartX.current = null; }}
            onKeyDown={handleCarouselKeyDown}
            tabIndex={0}
            aria-label="Swipe or use arrow keys to browse selected work"
          >
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
                      {project.gallery ? (
                        <AhamAatmGallery images={project.gallery} />
                      ) : (
                        <WorkImage
                          image={project.image}
                          alt={`${project.title} project preview`}
                          link={project.link}
                          linkLabel={project.linkLabel}
                        />
                      )}
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
