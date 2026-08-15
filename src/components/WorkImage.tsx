import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MdArrowOutward, MdClose, MdLanguage, MdOpenInNew } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  link?: string;
  linkLabel?: string;
  secondaryLink?: string;
  secondaryLabel?: string;
  previewLink?: string;
  previewLabel?: string;
}

const WorkImage = ({
  image,
  alt,
  link,
  linkLabel = "View live project",
  secondaryLink,
  secondaryLabel = "View source",
  previewLink,
  previewLabel = "Live product preview",
}: Props) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewTitle = alt?.replace(/ project preview$/i, "") || "Selected project";

  useEffect(() => {
    if (!isPreviewOpen) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPreviewOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.documentElement.classList.add("cursor-iframe");
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("cursor-iframe");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isPreviewOpen]);

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
        <span>{previewLink ? "Preview product" : "Click to explore"}</span>
        <MdArrowOutward />
      </span>
    </div>
  );

  const previewTrigger = previewLink ? (
    <button
      className="work-image-in"
      type="button"
      onClick={() => setIsPreviewOpen(true)}
      aria-label={`${previewLabel}: ${previewTitle}`}
      data-cursor="disable"
    >
      {imageContent}
    </button>
  ) : link ? (
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
  ) : (
    imageContent
  );

  const previewDialog = isPreviewOpen && previewLink ? createPortal(
    <div
      className="product-preview-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsPreviewOpen(false);
      }}
    >
      <section
        className="product-preview-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-preview-title"
      >
        <div className="product-preview-header">
          <div>
            <span className="product-preview-kicker">Live product preview</span>
            <h3 id="product-preview-title">{previewTitle}</h3>
          </div>
          <button
            className="product-preview-close"
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            aria-label="Close product preview"
          >
            <MdClose aria-hidden="true" />
          </button>
        </div>
        <div className="product-preview-browser-bar" aria-hidden="true">
          <span className="product-preview-browser-dot product-preview-browser-dot-pink" />
          <span className="product-preview-browser-dot product-preview-browser-dot-lime" />
          <span className="product-preview-browser-dot product-preview-browser-dot-muted" />
          <span className="product-preview-browser-url">{previewLink.replace(/^https?:\/\//, "")}</span>
        </div>
        <div className="product-preview-frame">
          <iframe
            title={`${previewTitle} live product preview`}
            src={previewLink}
            loading="eager"
            allow="fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            onMouseEnter={() => document.documentElement.classList.add("cursor-iframe")}
            onMouseLeave={() => document.documentElement.classList.remove("cursor-iframe")}
          />
        </div>
        <div className="product-preview-footer">
          <p><strong>Interactive preview:</strong> hover menus, cards, and controls inside the frame. Open the full demo for the most spacious view.</p>
          <a className="product-preview-open" href={previewLink} target="_blank" rel="noreferrer noopener" data-cursor="disable">
            <MdOpenInNew aria-hidden="true" /> Open full demo
          </a>
        </div>
      </section>
    </div>,
    document.body
  ) : null;

  if (!link) {
    return (
      <div className="work-image">
        {imageContent}
        <span className="work-link work-link-static">Selected work · details on request</span>
        {previewDialog}
      </div>
    );
  }

  return (
    <div className="work-image">
      {previewTrigger}
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
      {previewDialog}
    </div>
  );
};

export default WorkImage;
