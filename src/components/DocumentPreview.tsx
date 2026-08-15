import { MdDownload, MdOpenInNew } from "react-icons/md";

type DocumentPreviewProps = {
  title: string;
  src: string;
  pageLabel: string;
  downloadName: string;
  className?: string;
  showActions?: boolean;
};

const DocumentPreview = ({
  title,
  src,
  pageLabel,
  downloadName,
  className = "",
  showActions = true,
}: DocumentPreviewProps) => {
  const previewSrc = `${src}#view=FitH&toolbar=1&navpanes=0`;

  return (
    <div className={`document-preview ${className}`.trim()}>
      <div className="document-preview-bar">
        <span>Live document preview</span>
        <span>{pageLabel}</span>
      </div>
      <div className="document-preview-frame">
        <iframe title={`${title} live preview`} src={previewSrc} loading="lazy" />
      </div>
      {showActions && (
        <div className="document-preview-footer">
          <span className="document-preview-title">{title}</span>
          <div className="document-preview-actions">
            <a
              className="document-preview-action document-preview-action-primary"
              href={src}
              target="_blank"
              rel="noreferrer"
            >
              <MdOpenInNew aria-hidden="true" /> Open full document
            </a>
            <a
              className="document-preview-action"
              href={src}
              download={downloadName}
            >
              <MdDownload aria-hidden="true" /> Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPreview;
