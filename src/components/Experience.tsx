import { useEffect, useRef, useState, type ReactNode } from "react";
import { Award, Briefcase, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import { experience, learning } from "../data/content";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

/* One stop on the timeline: big label on the left, node on the line, card on the right. */
function Step({
  label,
  caption,
  live = false,
  children,
}: {
  label: string;
  caption: string;
  live?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(false);

  // "reached" = this stop has passed the middle of the screen, so its node and label light up.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setReached(e.isIntersecting || e.boundingClientRect.top < 0),
      { rootMargin: "0px 0px -50% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative grid gap-4 pl-10 lg:grid-cols-[190px_1fr] lg:gap-10 lg:pl-0">
      {/* node on the line */}
      <span
        aria-hidden
        className={`absolute left-0 top-2 z-10 grid h-4 w-4 place-items-center rounded-full border-2 transition-colors duration-500 motion-reduce:transition-none lg:left-[202px] ${
          reached ? "border-teal-600 bg-teal-600" : "border-slate-300 bg-white"
        }`}
      >
        {live && <span className="absolute inset-0 animate-ping rounded-full bg-teal-500/60 motion-reduce:hidden" />}
      </span>

      {/* big label (stays in view on desktop while a tall card scrolls) */}
      <div className="lg:sticky lg:top-32 lg:self-start lg:pr-2 lg:text-right">
        <p
          className={`font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors duration-500 motion-reduce:transition-none ${
            reached ? "text-teal-700" : "text-slate-400"
          }`}
        >
          {caption}
        </p>
        <p
          className={`text-3xl font-black tracking-tighter transition-colors duration-500 motion-reduce:transition-none lg:text-4xl ${
            reached ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {label}
        </p>
      </div>

      <div>{children}</div>
    </div>
  );
}

const TAG = "text-[11px] font-semibold uppercase tracking-wider text-slate-400";

export default function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  // The teal line fills as you scroll down through the timeline.
  useEffect(() => {
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!track || !fill) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
      fill.style.transform = `scaleY(${p.toFixed(3)})`;
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

  // "Graduation: 2024" -> "2024"
  const gradYear = experience.education.year.match(/\d{4}/)?.[0] ?? experience.education.year;

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        label="04 / EXPERIENCE"
        lines={["My", "Journey."]}
        desc="Where I work today, what I am learning right now, and where I started."
      />

      <div ref={trackRef} className="relative mt-14">
        {/* the line (grey base + teal fill) */}
        <div aria-hidden className="absolute bottom-0 top-4 left-[7px] w-0.5 bg-slate-200 lg:left-[209px]" />
        <div
          ref={fillRef}
          aria-hidden
          className="absolute bottom-0 top-4 left-[7px] w-0.5 origin-top bg-teal-600 lg:left-[209px]"
          style={{ transform: "scaleY(0)" }}
        />

        <div className="space-y-14">
          {/* 1. NOW: current job */}
          <Step label="Now" caption="Professional track" live>
            <Reveal className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-teal-600/30 transition hover:-translate-y-1 hover:shadow-md sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" /> Currently Working
                </span>
                <span className="text-xs text-slate-400">{experience.started}</span>
              </div>

              <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900">{experience.role}</h3>
              <p className="text-sm font-medium text-teal-700">{experience.company}</p>

              <p className={`mt-6 ${TAG}`}>What I do</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{experience.desc}</p>

              <p className={`mt-6 ${TAG}`}>Focus areas</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {experience.pillars.map((p) => (
                  <div
                    key={p.title}
                    className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-900/5 transition hover:ring-teal-600/40"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50">
                      {p.title === "Python Systems" ? (
                        <Briefcase size={18} className="text-teal-700" />
                      ) : (
                        <Sparkles size={18} className="text-teal-700" />
                      )}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </Step>

          {/* 2. LEARNING: skills in development + institute + certifications */}
          <Step label="Learning" caption="Transparent growth">
            <Reveal className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-md sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">Skills in Development</h3>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                  Honest Status
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {learning.map((l) => (
                  <div
                    key={l.title}
                    className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-900/5 transition hover:ring-teal-600/40"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Sparkles size={15} className="text-teal-600" /> {l.title}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500 motion-reduce:animate-none" />
                        {l.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{l.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-teal-50 p-4 text-sm">
                <ShieldCheck size={18} className="mt-0.5 shrink-0 text-teal-700" />
                <div>
                  <p className="font-semibold text-slate-800">Vetri IT Training Institute</p>
                  <p className="text-xs text-slate-500">
                    Enrolled in structured mentorship and enterprise engineering standard practices.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* certifications: an honest "empty slot" */}
            <Reveal
              delay={0.1}
              className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 p-6 transition hover:border-teal-600/60"
            >
              <div className="flex items-center gap-2 text-slate-800">
                <Award size={18} className="text-teal-700" />
                <h3 className="text-base font-bold">Certifications</h3>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                No certifications added yet — in progress during current training at Vetri IT Training Institute.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400" /> Formal assessments scheduled upon training
                completion
              </div>
            </Reveal>
          </Step>

          {/* 3. EDUCATION */}
          <Step label={gradYear} caption="Higher education">
            <Reveal className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-md sm:p-8">
              <div className="flex items-center gap-2 text-slate-800">
                <GraduationCap size={20} className="text-teal-700" />
                <span className="text-xs font-semibold uppercase tracking-wide">Higher Education</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                  {experience.education.degree}
                </h3>
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-900/5">
                  {experience.education.year}
                </span>
              </div>
              <p className="text-sm font-medium text-teal-700">{experience.education.school}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{experience.education.desc}</p>
            </Reveal>
          </Step>
        </div>
      </div>
    </section>
  );
}