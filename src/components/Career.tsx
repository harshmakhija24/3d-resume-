import { useEffect, useRef } from "react";
import "./styles/Career.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const careerTimeline = [
  {
    title: "Tech Intern",
    company: "IIMBx",
    duration: "NOW",
    description: "Architected a B2B Course Suggestion Engine utilizing TF-IDF matching and LLMs for reduced token sizing.",
    themeClass: "accent-tech",
    position: "center",
    row: 0
  },
  {
    title: "BBA Student",
    company: "IIM Bangalore",
    duration: "NOW",
    description: "Pursuing BBA at India's premier management institute. Led \"Learning Lab\" initiative managing curriculum for 150+ students.",
    themeClass: "accent-business",
    position: "left",
    row: 1
  },
  {
    title: "Non-Executive Director",
    company: "Aham Aatm Deepah",
    duration: "2024–26",
    description: "Helped scale community initiatives impacting 10,000+ beneficiaries. Led the GMCKS Shiksha Project.",
    themeClass: "accent-business",
    position: "right",
    row: 1
  },
  {
    title: "Project Intern",
    company: "IIM Bangalore",
    duration: "2025–26",
    description: "Supported talent acquisition by screening 1,000+ candidates. Produced 25+ short-form videos and podcasts.",
    themeClass: "accent-business",
    position: "center",
    row: 2
  },
  {
    title: "Global Cohort",
    company: "Hiroshima University",
    duration: "2024–25",
    description: "Agile COIL e-START Program. Selected for a global cohort across 10 Asia-Pacific/European universities.",
    themeClass: "accent-business",
    position: "left",
    row: 3
  },
  {
    title: "Co-Founder",
    company: "Last Life · E-Sports",
    duration: "2024",
    description: "Launched e-sports platform to 12,000+ users in 45 days. Generated ₹1.5 Lakh+ revenue.",
    themeClass: "accent-business",
    position: "right",
    row: 3
  },
  {
    title: "Diploma – Advertising",
    company: "NAEMD · IGNOU",
    duration: "2023–24",
    description: "Diploma in Advertising, Media, Events & PR. Graduated with Distinction. Managed events valued at ₹12 Crore.",
    themeClass: "accent-business",
    position: "center",
    row: 4
  }
];

const Career = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return;

    // We will animate the paths drawing themselves using stroke-dasharray and stroke-dashoffset
    const paths = svgRef.current.querySelectorAll("path");
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        }
      });
    });

    // Fade up the cards
    gsap.fromTo(
      ".career-tree-node",
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 80%",
          scrub: 0.5
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === containerRef.current) t.kill();
      });
    };
  }, []);

  return (
    <div className="career-section" id="career">
      <div className="career-container section-container">
        <h2>
          My <span>Career</span>
        </h2>

        <div className="career-tree-wrapper" ref={containerRef}>
          {/* SVG Background Lines (Desktop only) */}
          <div className="career-svg-container">
            <svg 
              ref={svgRef}
              viewBox="0 0 1000 1680" 
              className="career-svg-lines"
            >
              {/* SVG Drop Shadow Filter */}
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Row 1 to Row 2 */}
              <path d="M500 260 C500 300, 250 300, 250 340" className="tree-line" filter="url(#glow)" />
              <path d="M500 260 C500 300, 750 300, 750 340" className="tree-line" filter="url(#glow)" />
              
              {/* Row 2 to Row 3 */}
              <path d="M250 600 C250 640, 500 640, 500 680" className="tree-line" filter="url(#glow)" />
              <path d="M750 600 C750 640, 500 640, 500 680" className="tree-line" filter="url(#glow)" />
              
              {/* Row 3 to Row 4 */}
              <path d="M500 940 C500 980, 250 980, 250 1020" className="tree-line" filter="url(#glow)" />
              <path d="M500 940 C500 980, 750 980, 750 1020" className="tree-line" filter="url(#glow)" />

              {/* Row 4 to Row 5 */}
              <path d="M250 1280 C250 1320, 500 1320, 500 1360" className="tree-line" filter="url(#glow)" />
              <path d="M750 1280 C750 1320, 500 1320, 500 1360" className="tree-line" filter="url(#glow)" />
            </svg>
          </div>

          <div className="career-tree-grid">
            {careerTimeline.map((item, index) => (
              <div 
                key={index} 
                className={`career-tree-node pos-${item.position}`}
                style={{ top: `${item.row * 340}px` }}
              >
                <div className={`career-node-card ${item.themeClass}`}>
                  <div className="career-node-header">
                    <span className="career-node-duration">{item.duration}</span>
                  </div>
                  <h4 className="career-node-title">{item.title}</h4>
                  <h5 className="career-node-company">{item.company}</h5>
                  <p className="career-node-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
