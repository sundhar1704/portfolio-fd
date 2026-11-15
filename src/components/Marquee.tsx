import "../styles/showcase.css";

const DEFAULT_ITEMS = [
  "React",
  "React Native",
  "JavaScript",
  "Python",
  "Django",
  "PostgreSQL",
  "Generative AI",
  "Tailwind",
  "Git",
  "Vercel",
];

// Gap-filler strip: drop it between sections (e.g. between Hero and Skills, or after Projects).
export default function Marquee({ items = DEFAULT_ITEMS }: { items?: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t}>
          {t}
          <b aria-hidden>✦</b>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="sc-root sc-marquee" role="presentation">
      <div className="sc-marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
