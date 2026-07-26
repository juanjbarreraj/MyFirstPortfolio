import { Reveal, Stagger, StaggerItem } from "./Reveal.jsx";

export default function Education() {
  return (
    <section className="section section--band" id="education" aria-labelledby="education-title">
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot" aria-hidden="true"></span>
          Education
        </p>
        <h2 id="education-title">
          A foundation in technology, business,
          <br />
          information systems, and data.
        </h2>
        <p className="section-lede">
          My education combines technical development, business strategy, information
          systems, and data analytics. This interdisciplinary background allows me to
          understand both how digital products are built and how they can solve real
          organizational and customer needs.
        </p>
      </Reveal>

      <Stagger className="edu-grid" gap={0.12}>
        <StaggerItem as="article" variant="scale" className="card edu-card">
          <p className="edu-level">Bachelor’s Degree — Double Major</p>
          <h3 className="edu-title">
            Computer Science
            <br />+ Business Management
          </h3>
          <p className="edu-meta">Point Park University · Graduated April 2025</p>
          <p className="edu-desc">
            Completed a multidisciplinary undergraduate education combining software
            development, computational problem-solving, and technical systems with business
            operations, management, strategy, and organizational decision-making.
          </p>
          <ul className="tag-row" aria-label="Key areas">
            <li>Software Development</li>
            <li>Computer Science</li>
            <li>Business Strategy</li>
            <li>Management</li>
            <li>Problem-Solving</li>
            <li>Product Thinking</li>
          </ul>
        </StaggerItem>

        <StaggerItem as="article" variant="scale" className="card edu-card">
          <p className="edu-level">
            Master’s Degree <span className="edu-status">Currently pursuing</span>
          </p>
          <h3 className="edu-title">
            Information Systems
            <br />
            and Data Analytics
          </h3>
          <p className="edu-meta">Point Park University · Expected Aug 2026</p>
          <p className="edu-desc">
            Developing advanced knowledge in information systems, data analysis, database
            technologies, decision-making, business intelligence, and the use of data to
            improve organizational performance.
          </p>
          <ul className="tag-row" aria-label="Key areas">
            <li>Information Systems</li>
            <li>Data Analytics</li>
            <li>Databases</li>
            <li>Business Intelligence</li>
            <li>Data-Driven Decision-Making</li>
            <li>Technology Strategy</li>
          </ul>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
