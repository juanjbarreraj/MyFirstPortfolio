const STACK = [
  "React",
  "Node.js",
  "Express",
  "PostgreSQL",
  "Python",
  "pandas",
  "JavaScript",
  "C#",
  "PHP",
  "SQL",
  "Tableau",
  "Power BI",
  "GitHub",
  "Postman",
  "Render",
  "Netlify",
];

/* A quiet typographic band: the working stack, readable as real content.
   No animation; the list simply wraps. */
export default function Marquee() {
  return (
    <div className="marquee">
      <ul className="marquee-track" aria-label="Core stack">
        {STACK.map((item) => (
          <li key={item}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
