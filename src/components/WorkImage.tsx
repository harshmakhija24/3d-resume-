import { MdArrowOutward, MdLanguage } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
  linkLabel?: string;
}

const WorkImage = ({ image, alt, link, linkLabel = "View live project" }: Props) => {
  const imageContent = (
    <div className="work-image-frame">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = import.meta.env.BASE_URL + "images/placeholder.webp";
        }}
      />
      <span className="work-image-sheen" aria-hidden="true" />
    </div>
  );

  if (!link) {
    return (
      <div className="work-image">
        {imageContent}
        <span className="work-link work-link-static">Selected work · details on request</span>
      </div>
    );
  }

  return (
    <div className="work-image">
      <a
        className="work-image-in"
        href={link}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${linkLabel}: ${alt ?? "project"}`}
        data-cursor="disable"
      >
        {imageContent}
        <span className="work-link">
          <MdLanguage aria-hidden="true" />
          <span>{linkLabel}</span>
          <MdArrowOutward aria-hidden="true" />
        </span>
      </a>
    </div>
  );
};

export default WorkImage;
