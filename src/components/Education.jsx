export default function Education() {
  return (
    <section className="section section--band" id="education" aria-labelledby="education-title">
      <header className="section-head">
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
      </header>

      <div className="edu-grid">
        <article className="card edu-card">
          <p className="edu-level">Bachelor’s degree, double major</p>
          <h3 className="edu-title">
            Computer Science
            <br />+ Business Management
          </h3>
          <p className="edu-meta">Point Park University, graduated April 2025</p>
          <p className="edu-desc">
            Completed a multidisciplinary undergraduate education combining software
            development, computational problem-solving, and technical systems with business
            operations, management, strategy, and organizational decision-making.
          </p>
          <ul className="tag-row" aria-label="Key areas">
            <li>Software development</li>
            <li>computer science</li>
            <li>business strategy</li>
            <li>management</li>
            <li>problem-solving</li>
            <li>product thinking</li>
          </ul>
        </article>

        <article className="card edu-card">
          <p className="edu-level">Master’s degree</p>
          <h3 className="edu-title">
            Information Systems
            <br />
            and Data Analytics
          </h3>
          <p className="edu-meta">Point Park University, graduated August 2026</p>
          <p className="edu-desc">
            Advanced study of information systems, data analysis, database technologies,
            decision-making, business intelligence, and the use of data to improve
            organizational performance.
          </p>
          <ul className="tag-row" aria-label="Key areas">
            <li>Information systems</li>
            <li>data analytics</li>
            <li>databases</li>
            <li>business intelligence</li>
            <li>data-driven decision-making</li>
            <li>technology strategy</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
