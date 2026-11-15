import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useProjects, type Project } from "../lib/api";
import ProjectModal from "./ProjectModal";
import "../styles/showcase.css";

const FILTERS: { id: "all" | Project["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "react", label: "React" },
  { id: "react-native", label: "React Native" },
  { id: "js-html", label: "JS / HTML" },
];

function useMedia(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ───────────────────────── Card ───────────────────────── */

type CardProps = {
  project: Project;
  index: number;
  active: boolean;
  onOpen: () => void;
};

function ProjectCard({ project, index, active, onOpen }: CardProps) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false); // true only while the card is close to the screen
  const [loaded, setLoaded] = useState(false);
  const useImage = Boolean(project.imageUrl); // your own screenshot = no iframe needed

  useEffect(() => {
    const el = ref.current;
    if (!el || useImage) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (!entry.isIntersecting) setLoaded(false); // unloaded: it fades in again next time
      },
      { rootMargin: "0px 40% 0px 40%" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [useImage]);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    ref.current.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
    ref.current.style.setProperty("--mx", `${((x + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  const onKey = (e: ReactKeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      onOpen();
    }
  };

  const host = project.liveUrl.replace(/^https?:\/\//, "");

  return (
    <article
      ref={ref}
      className={`sc-card${active ? " is-active" : ""}`}
      style={{ ["--accent" as string]: project.accent }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onOpen}
      onKeyDown={onKey}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${project.title}`}
    >
      <div className="sc-card-glow" aria-hidden />
      <div className="sc-chrome">
        <span /><span /><span />
        <div className="sc-chrome-url">{host || "preview"}</div>
      </div>

      <div className="sc-shot">
        <div className="sc-shot-ph" aria-hidden>
          <b>{project.title.charAt(0)}</b>
        </div>
        {useImage && (
          <img
            src={project.imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className={loaded ? "is-in" : ""}
            onLoad={() => setLoaded(true)}
          />
        )}
        {!useImage && near && project.liveUrl && (
          <iframe
            src={project.liveUrl}
            title={`${project.title} preview`}
            tabIndex={-1}
            aria-hidden
            scrolling="no"
            referrerPolicy="no-referrer"
            className={loaded ? "is-in" : ""}
            onLoad={() => setLoaded(true)}
          />
        )}
        <span className="sc-badge">{project.kind === "react-native" ? "React Native" : project.kind === "js-html" ? "JS / HTML" : "React App"}</span>
        <span className="sc-index">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="sc-card-body">
        <p className="sc-card-cat">{project.category}</p>
        <h3>{project.title}</h3>
        <p className="sc-card-sum">{project.summary}</p>
        <div className="sc-card-foot">
          <div className="sc-tags">
            {project.tech.slice(0, 4).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <span className="sc-more">
            View details <i aria-hidden>→</i>
          </span>
        </div>
      </div>
    </article>
  );
}

/* ─────────────────────── Showcase ─────────────────────── */

type Props = {
  githubUrl?: string;
  contactHref?: string;
};

export default function ProjectsShowcase({
  githubUrl = "https://github.com/sundhar1704",
  contactHref = "#contact",
}: Props) {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState<"all" | Project["kind"]>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [sectionHeight, setSectionHeight] = useState<number | undefined>(undefined);

  const isDesktop = useMedia("(min-width: 900px)");
  const reduced = useMedia("(prefers-reduced-motion: reduce)");
  const pinned = isDesktop && !reduced;

  const visible = useMemo(
    () => (filter === "all" ? projects : projects.filter((p) => p.kind === filter)),
    [projects, filter]
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    projects.forEach((p) => (c[p.kind] = (c[p.kind] ?? 0) + 1));
    return c;
  }, [projects]);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const maxRef = useRef(0);
  const countRef = useRef(visible.length);
  countRef.current = visible.length;

  // How far the track must travel sideways; the section is made exactly that much taller
  // (plus one screen), so vertical scroll distance maps 1:1 to horizontal movement.
  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !pinned) {
      setSectionHeight(undefined);
      maxRef.current = 0;
      return;
    }
    const max = Math.max(0, track.scrollWidth - window.innerWidth);
    maxRef.current = max;
    setSectionHeight(max + window.innerHeight);
  }, [pinned]);

  useLayoutEffect(() => {
    measure();
    const track = trackRef.current;
    const ro = new ResizeObserver(measure);
    if (track) ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, visible.length]);

  // Scroll → transform, smoothed with a small lerp inside requestAnimationFrame.
  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!pinned || !track || !section) {
      if (track) track.style.transform = "";
      section?.style.setProperty("--p", "0");
      return;
    }

    let raf = 0;
    let current = 0;
    let target = 0;

    const tick = () => {
      raf = 0;
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.0004) current = target;

      track.style.transform = `translate3d(${(-current * maxRef.current).toFixed(2)}px,0,0)`;
      barRef.current?.style.setProperty("transform", `scaleX(${current.toFixed(4)})`);
      section.style.setProperty("--p", current.toFixed(4));

      const n = countRef.current;
      const idx = n > 1 ? Math.min(n - 1, Math.max(0, Math.round(current * (n - 1)))) : 0;
      setActive((prev) => (prev === idx ? prev : idx));

      if (current !== target) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(1, section.offsetHeight - window.innerHeight);
      target = Math.min(1, Math.max(0, -rect.top / total));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pinned, sectionHeight, visible.length]);

  // Close the popup if the filter removes the open project.
  useEffect(() => {
    if (openIndex !== null && openIndex >= visible.length) setOpenIndex(null);
  }, [visible.length, openIndex]);

  const open = openIndex !== null ? visible[openIndex] : null;

  return (
    <section
      id="projects"
      ref={sectionRef}
      className={`sc-root sc-section${pinned ? " is-pinned" : ""}`}
      style={pinned && sectionHeight ? { height: sectionHeight } : undefined}
      aria-label="Selected projects"
    >
      <div className="sc-sticky">
        <div className="sc-blob sc-blob-a" aria-hidden />
        <div className="sc-blob sc-blob-b" aria-hidden />
        <div className="sc-ghost" aria-hidden>WORK</div>

        <div className="sc-track" ref={trackRef}>
          {/* intro panel */}
          <div className="sc-intro">
            <p className="sc-eyebrow">03 / PROJECTS</p>
            <h2>
              Selected
              <br />
              Work.
            </h2>
            <p className="sc-intro-text">
              Complete, working applications. Each card shows the live site — click one for the full story.
            </p>
            <div className="sc-filters" role="group" aria-label="Filter projects">
              {FILTERS.filter((f) => f.id === "all" || counts[f.id]).map((f) => (
                <button
                  key={f.id}
                  className={filter === f.id ? "is-on" : ""}
                  aria-pressed={filter === f.id}
                  onClick={() => setFilter(f.id)}
                >
                  {f.label} ({counts[f.id] ?? 0})
                </button>
              ))}
            </div>
            <p className="sc-hint" aria-hidden>
              {pinned ? "Keep scrolling" : "Swipe"} <span>→</span>
            </p>
          </div>

          {loading && visible.length === 0 && <div className="sc-loading">Loading projects…</div>}

          {visible.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              active={!pinned || i === active}
              onOpen={() => setOpenIndex(i)}
            />
          ))}

          {/* closing panel */}
          <div className="sc-outro">
            <p className="sc-eyebrow">More on GitHub</p>
            <h3>Want to see more?</h3>
            <p>Every repository, experiments included, lives on my GitHub. Or tell me about your idea.</p>
            <div className="sc-modal-actions">
              <a className="sc-btn sc-btn-primary" href={githubUrl} target="_blank" rel="noopener noreferrer">
                GitHub profile
              </a>
              <a className="sc-btn" href={contactHref}>
                Let's talk
              </a>
            </div>
          </div>
        </div>

        {pinned && (
          <div className="sc-hud" aria-hidden>
            <span className="sc-count">
              {String(Math.min(active + 1, Math.max(visible.length, 1))).padStart(2, "0")}
              <em> / {String(visible.length).padStart(2, "0")}</em>
            </span>
            <div className="sc-bar">
              <div ref={barRef} />
            </div>
          </div>
        )}
      </div>

      {open && openIndex !== null && (
        <ProjectModal
          project={open}
          onClose={() => setOpenIndex(null)}
          onPrev={openIndex > 0 ? () => setOpenIndex(openIndex - 1) : undefined}
          onNext={openIndex < visible.length - 1 ? () => setOpenIndex(openIndex + 1) : undefined}
        />
      )}
    </section>
  );
}