import { useEffect, useState } from "react";
import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const sectionIds = ["about", "career", "work", "presentations", "contact"] as const;
type SectionId = (typeof sectionIds)[number] | "landingDiv";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("landingDiv");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const updateNavigation = () => {
      frame = 0;
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 28);

      const headerClearance = Math.max(96, window.innerHeight * 0.16);
      let current: SectionId = "landingDiv";
      let closestTop = Number.POSITIVE_INFINITY;

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;

        const top = section.getBoundingClientRect().top;
        if (top <= headerClearance && top > -section.getBoundingClientRect().height * 0.55) {
          const distance = Math.abs(top - headerClearance);
          if (distance < closestTop) {
            closestTop = distance;
            current = id;
          }
        }
      });

      setActiveSection(current);
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateNavigation);
    };

    updateNavigation();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const linkClass = (id: SectionId) => `nav-item${activeSection === id ? " nav-active" : ""}`;

  return (
    <>
      <div className={`header${isScrolled ? " header-scrolled" : ""}`}>
        <a href="#landingDiv" className="navbar-title" data-cursor="disable" aria-label="Back to home">
          HM
        </a>
        <span className="navbar-connect" aria-label="Portfolio focus">
          PRODUCT · AI · COMMUNITY
        </span>
        <ul>
          <li>
            <a data-href="#about" href="#about" className={linkClass("about")} aria-current={activeSection === "about" ? "page" : undefined}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career" className={linkClass("career")} aria-current={activeSection === "career" ? "page" : undefined}>
              <HoverLinks text="CAREER" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" className={linkClass("work")} aria-current={activeSection === "work" ? "page" : undefined}>
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#presentations" href="#presentations" className={linkClass("presentations")} aria-current={activeSection === "presentations" ? "page" : undefined}>
              <HoverLinks text="DECKS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" className={linkClass("contact")} aria-current={activeSection === "contact" ? "page" : undefined}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li>
            <a
              className="navbar-cv"
              href={import.meta.env.BASE_URL + "HarshMakhija.pdf"}
              target="_blank"
              rel="noreferrer"
              aria-label="Open Harsh Makhija CV"
            >
              <span>CV</span>
              <TbNotes aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>

      <div className="nav-fade" aria-hidden="true"></div>
    </>
  );
};

export default Navbar;
