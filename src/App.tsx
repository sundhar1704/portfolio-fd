import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import QuickMetrics from "./components/QuickMetrics";
import TechStack from "./components/TechStack";
import Marquee from "./components/Marquee";
import ProjectsShowcase from "./components/ProjectsShowcase";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import VoiceAssistant from "./components/VoiceAssistant";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import { trackEvent } from "./lib/api";

function App() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Count one portfolio visit per page load
  useEffect(() => {
    trackEvent("page_view");
  }, []);

  // Hover glow: tell every card where the mouse is, so the glow can follow it.
  useEffect(() => {
    const CARD = '.bg-white[class*="rounded-"]';
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || raf) return;
      const { clientX, clientY } = e;
      const target = e.target as HTMLElement | null;
      raf = requestAnimationFrame(() => {
        raf = 0;
        let el: HTMLElement | null = target?.closest<HTMLElement>(CARD) ?? null;
        while (el) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--gx", `${clientX - r.left}px`);
          el.style.setProperty("--gy", `${clientY - r.top}px`);
          el = el.parentElement?.closest<HTMLElement>(CARD) ?? null;
        }
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f0faf8] text-slate-900">
      <ScrollProgress />
      <Hero onOpenAssistant={() => setAssistantOpen(true)} />
      <QuickMetrics />
      <TechStack />
      <Marquee />
      <ProjectsShowcase />
      <Experience />
      <Contact />
      <VoiceAssistant open={assistantOpen} onClose={() => setAssistantOpen(false)} />
      <Navbar />
    </div>
  );
}

export default App;