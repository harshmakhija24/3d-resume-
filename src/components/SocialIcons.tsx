import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";

const SocialIcons = () => {
  return (
    <div className="icons-section" aria-label="Resume utility">
      <a
        className="resume-button"
        href={import.meta.env.BASE_URL + "Harsh_Makhija_CV.pdf"}
        download="Harsh_Makhija_CV.pdf"
      >
        <span>CV</span>
        <TbNotes aria-hidden="true" />
      </a>
    </div>
  );
};

export default SocialIcons;
