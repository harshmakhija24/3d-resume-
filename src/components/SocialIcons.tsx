import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";

const SocialIcons = () => {
  return (
    <div className="icons-section" aria-label="Resume utility">
      <a
        className="resume-button"
        href={import.meta.env.BASE_URL + "HarshMakhija.pdf"}
        download="HarshMakhija.pdf"
        aria-label="Download Harsh Makhija CV"
      >
        <span>Download CV</span>
        <TbNotes aria-hidden="true" />
      </a>
    </div>
  );
};

export default SocialIcons;
