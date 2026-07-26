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

export default function Marquee() {
  return (
    <>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {/* list appears twice so the loop is seamless */}
          {[...STACK, ...STACK].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
      <p className="sr-only">Core stack: {STACK.join(", ")}.</p>
    </>
  );
}
