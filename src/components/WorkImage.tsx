import { MdArrowOutward, MdLanguage } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
  linkLabel?: string;
  secondaryLink?: string;
  secondaryLabel?: string;
}

const WorkImage = ({
  image,
  alt,
  link,
  linkLabel = "View live project",
  secondaryLink,
  secondaryLabel = "View source",
}: Props) => {
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
      <span className="work-image-cta" aria-hidden="true">
        <span>Click to explore</span>
        <MdArrowOutward />
      </span>
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
      </a>
      <div className="work-link-row">
        <a
          className="work-link"
          href={link}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${linkLabel}: ${alt ?? "project"}`}
          data-cursor="disable"
        >
          <MdLanguage aria-hidden="true" />
          <span>{linkLabel}</span>
          <MdArrowOutward aria-hidden="true" />
        </a>
        {secondaryLink && (
          <a
            className="work-link work-link-secondary"
            href={secondaryLink}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${secondaryLabel}: ${alt ?? "project"}`}
            data-cursor="disable"
          >
            <span>{secondaryLabel}</span>
            <MdArrowOutward aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
};

export default WorkImage;
