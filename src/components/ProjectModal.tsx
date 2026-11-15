import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { trackEvent, type Project } from "../lib/api";

type Props = {
  project: Project;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, onClose, onPrev, onNext }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const hasShot = Boolean(project.imageUrl);
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<"shot" | "live">(hasShot ? "shot" : "live");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [liveLoaded, setLiveLoaded] = useState(false);

  // Count a detail view each time a different project opens
  useEffect(() => {
    trackEvent("project_view", project.slug);
  }, [project.slug]);

  // New project (prev / next): start fresh. With your own screenshot it opens on that, otherwise on the live site.
  useEffect(() => {
    setView(project.imageUrl ? "shot" : "live");
    setImgLoaded(false);
    setLiveLoaded(false);
  }, [project.slug, project.imageUrl]);

  // Short closing animation, then really close.
  const requestClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    timer.current = window.setTimeout(onClose, 180);
  }, [closing, onClose]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Lock page scroll (without layout shift) and restore focus on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
      previouslyFocused?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return requestClose();
      if (e.key === "ArrowLeft" && onPrev) return onPrev();
      if (e.key === "ArrowRight" && onNext) return onNext();
      if (e.key === "Tab" && dialogRef.current) {
        const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [requestClose, onPrev, onNext]);

  const host = project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, "") : "";
  const showLive = view === "live" && Boolean(project.liveUrl);

  return createPortal(
    <div
      className={`sc-modal-backdrop${closing ? " is-closing" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
    >
      <div
        className={`sc-modal${closing ? " is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sc-modal-title"
        ref={dialogRef}
        style={{ ["--accent" as string]: project.accent }}
      >
        <button className="sc-modal-close" onClick={requestClose} ref={closeRef} aria-label="Close project details">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="sc-modal-preview">
          <div className="sc-chrome">
            <span /><span /><span />
            <div className="sc-chrome-url">{host || "preview"}</div>
            {hasShot && project.liveUrl && (
              <div className="sc-view-tabs" role="group" aria-label="Preview type">
                <button className={view === "shot" ? "is-on" : ""} aria-pressed={view === "shot"} onClick={() => setView("shot")}>
                  Screenshot
                </button>
                <button className={view === "live" ? "is-on" : ""} aria-pressed={view === "live"} onClick={() => setView("live")}>
                  Live
                </button>
              </div>
            )}
          </div>

          <div className="sc-modal-frame">
            <div className="sc-shot-ph" aria-hidden>
              <b>{project.title.charAt(0)}</b>
            </div>

            {hasShot && (
              <img
                key={project.slug}
                src={project.imageUrl}
                alt={`${project.title} screenshot`}
                decoding="async"
                className={imgLoaded ? "is-in" : ""}
                onLoad={() => setImgLoaded(true)}
              />
            )}

            {showLive && (
              <iframe
                key={project.slug}
                src={project.liveUrl}
                title={`${project.title} live preview`}
                referrerPolicy="no-referrer"
                className={liveLoaded ? "is-in" : ""}
                onLoad={() => setLiveLoaded(true)}
              />
            )}

            {showLive && (
              <div className="sc-live-note">
                <span>
                  {liveLoaded
                    ? "Live preview. If you see an error, this site blocks embedding."
                    : "Loading live preview…"}
                </span>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("live_click", project.slug)}
                >
                  Open site ↗
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="sc-modal-body">
          <p className="sc-card-cat">
            {project.category}
            {project.year ? ` · ${project.year}` : ""}
          </p>
          <h3 id="sc-modal-title">{project.title}</h3>
          <p className="sc-modal-text">{project.description || project.summary}</p>

          {project.highlights.length > 0 && (
            <ul className="sc-highlights">
              {project.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          )}

          <div className="sc-tags">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="sc-modal-actions">
            {project.liveUrl && (
              <a
                className="sc-btn sc-btn-primary"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("live_click", project.slug)}
              >
                Open live site
              </a>
            )}
            {project.repoUrl && (
              <a
                className="sc-btn"
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("github_click", project.slug)}
              >
                View code
              </a>
            )}
            <div className="sc-modal-nav">
              <button className="sc-btn" onClick={onPrev} disabled={!onPrev} aria-label="Previous project">←</button>
              <button className="sc-btn" onClick={onNext} disabled={!onNext} aria-label="Next project">→</button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}