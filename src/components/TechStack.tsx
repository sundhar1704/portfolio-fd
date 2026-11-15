import { useEffect, useRef, useState } from "react";
import { Database, Sparkles, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const dev = (name: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${name}-${variant}.svg`;

// Logos that devicon does not have (Claude, Render) come from Simple Icons, with the colour set in the URL.
const simple = (name: string, color: string) => `https://cdn.simpleicons.org/${name}/${color}`;

type Skill = { name: string; sub: string; icon?: string; Icon?: LucideIcon };
type Group = { id: string; title: string; skills: Skill[] };

const groups: Group[] = [
  {
    id: "frontend",
    title: "Frontend",
    skills: [
      { name: "HTML5", sub: "Semantic markup", icon: dev("html5") },
      { name: "CSS3", sub: "Modern layouts", icon: dev("css3") },
      { name: "JavaScript", sub: "ES6+", icon: dev("javascript") },
      { name: "React.js", sub: "Component architecture", icon: dev("react") },
      { name: "Tailwind", sub: "Utility-first CSS", icon: dev("tailwindcss") },
      { name: "Bootstrap", sub: "Bootstrap 5", icon: dev("bootstrap") },
    ],
  },
  {
    id: "mobile",
    title: "Mobile & Deploy",
    skills: [
      { name: "React Native", sub: "Mobile apps", icon: dev("react") },
      { name: "Vercel", sub: "Deployment", icon: dev("vercel") },
      { name: "Render", sub: "Backend hosting", icon: simple("render", "46E3B7") },
    ],
  },
  {
    id: "ai",
    title: "AI & Backend",
    skills: [
      { name: "Python", sub: "Backend scripting", icon: dev("python") },
      { name: "Gen AI / LLMs", sub: "Prompting & APIs" },
      { name: "RAG", sub: "Retrieval-augmented AI", Icon: Database },
      { name: "Claude", sub: "AI assistant & API", icon: simple("claude", "D97757") },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    skills: [
      { name: "Git", sub: "Version control", icon: dev("git") },
      { name: "VS Code", sub: "Editor & tooling", icon: dev("vscode") },
    ],
  },
];

// Make sure Inter is loaded in index.html.
const SANS = "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

function SkillCard({ s, delay }: { s: Skill; delay: number }) {
  return (
    <Reveal
      delay={delay}
      className="flex flex-col items-center rounded-lg border border-slate-200 bg-white px-4 py-6 text-center transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-12 w-12 items-center justify-center">
        {s.icon ? (
          <img src={s.icon} alt={s.name} className="h-10 w-10 object-contain" loading="lazy" />
        ) : s.Icon ? (
          <s.Icon size={34} className="text-teal-700" />
        ) : (
          <Sparkles size={34} className="text-teal-700" />
        )}
      </div>
      <p className="mt-4 text-[13px] font-bold text-slate-950">{s.name}</p>
      <p className="mt-1 text-[11px] font-normal text-slate-500">{s.sub}</p>
    </Reveal>
  );
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(groups[0].id);

  // Which group is in the middle of the screen right now.
  useEffect(() => {
    const els = groups
      .map((g) => document.getElementById(`skills-${g.id}`))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.replace("skills-", ""));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The thin line on the left fills as you scroll through the section.
  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
      line.style.transform = `scaleY(${p.toFixed(3)})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(`skills-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="mx-auto max-w-6xl px-6 py-24"
      style={{ fontFamily: SANS }}
    >
      <SectionHeading
        label="02 / SKILLS"
        lines={["My", "Skills."]}
        desc="The core web, mobile and AI technologies I use to design and build responsive, user-friendly products."
      />

      <div className="mt-12 lg:grid lg:grid-cols-[200px_1fr] lg:gap-14">
        {/* left: sticky group list with a progress line (desktop only) */}
        <nav aria-label="Skill groups" className="hidden lg:block">
          <div className="sticky top-32">
            <div className="relative pl-5">
              <div className="absolute left-0 top-0 h-full w-px bg-slate-200" />
              <div
                ref={lineRef}
                className="absolute left-0 top-0 h-full w-px origin-top bg-teal-600"
                style={{ transform: "scaleY(0)" }}
              />
              <ul className="space-y-6">
                {groups.map((g, i) => (
                  <li key={g.id}>
                    <a
                      href={`#skills-${g.id}`}
                      onClick={goTo(g.id)}
                      className={`block transition-colors duration-300 motion-reduce:transition-none ${
                        active === g.id ? "text-teal-700" : "text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
                      <span className={`block text-sm ${active === g.id ? "font-bold" : "font-medium"}`}>
                        {g.title}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>

        {/* right: the groups; the one in the middle of the screen is fully visible, the others fade back */}
        <div className="space-y-20">
          {groups.map((g, gi) => (
            <div
              key={g.id}
              id={`skills-${g.id}`}
              className={`scroll-mt-28 transition-opacity duration-500 motion-reduce:transition-none ${
                active === g.id ? "" : "lg:opacity-45"
              }`}
            >
              <Reveal className="mb-6 flex items-end justify-between border-b border-slate-200 pb-3">
                <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">{g.title}</h3>
                <span className="font-mono text-xs text-slate-500">
                  {String(gi + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
                </span>
              </Reveal>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {g.skills.map((s, i) => (
                  <SkillCard key={s.name} s={s} delay={i * 0.07} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}