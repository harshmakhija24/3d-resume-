import { TbNotes } from "react-icons/tb";
import HoverLinks from "./HoverLinks";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="header">
        <a href="#landingDiv" className="navbar-title" data-cursor="disable" aria-label="Back to home">
          HM
        </a>
        <span className="navbar-connect" aria-label="Portfolio focus">
          PRODUCT · AI · COMMUNITY
        </span>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#career" href="#career">
              <HoverLinks text="CAREER" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#presentations" href="#presentations">
              <HoverLinks text="DECKS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
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
