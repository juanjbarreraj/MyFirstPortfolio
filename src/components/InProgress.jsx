import { asset } from "../lib/asset.js";
import { wip } from "../data/wip.js";

/* ============================ IN PROGRESS ============================
   "The Bench": work that is real and live as a preview, but not finished.
   Deliberately distinct from the four shipped builds — each project gets
   its own art-directed stage instead of the standard browser+phone pair,
   every card carries a visible WIP status, and links say "Preview", not
   "Live site". Repository links appear as each codebase goes public. */

function WipFrame({ src, alt, label }) {
  return (
    <figure className="wip-frame">
      <img src={src} alt={alt} width={1440} height={900} loading="lazy" decoding="async" />
      {label && (
        <figcaption className="wip-frame-tag" aria-hidden="true">
          {label}
        </figcaption>
      )}
    </figure>
  );
}

/* Per-project stages ------------------------------------------------- */

const STAGES = {
  /* Mireya: the same build in both languages, fanned like two sheets on
     a drawing table — the bilingual system is the story. */
  mireya: () => (
    <div className="wip-stage wip-stage--art" aria-label="Two captures of the same page, in English and in Spanish">
      <WipFrame
        src={asset("assets/work/wip/mireya-es.jpg")}
        alt="Illustration gallery of Mireya Rojas Fenoy's portfolio in Spanish"
        label="ES"
      />
      <WipFrame
        src={asset("assets/work/wip/mireya-en.jpg")}
        alt="Illustration gallery of Mireya Rojas Fenoy's portfolio in English"
        label="EN"
      />
    </div>
  ),

  /* El Globo: a single full-bleed dark frame — gallery lighting, no chrome. */
  elglobo: () => (
    <div className="wip-stage wip-stage--globe">
      <WipFrame
        src={asset("assets/work/wip/globo-sphere.jpg")}
        alt="The interactive WebGL globe of The Art of War and Peace, figures climbing from its torn plaster rim"
      />
      <span className="wip-brass" aria-hidden="true"></span>
    </div>
  ),
};

export default function InProgress() {
  return (
    <section className="section section--band wip" id="in-progress" aria-labelledby="wip-title">
      <header className="section-head">
        <h2 id="wip-title">
          Two builds,
          <br />
          in progress.
        </h2>
        <p className="section-lede">
          Not finished, not hidden. These are live previews of work on the bench right now:
          what you see is real, and what is missing is labeled.
        </p>
      </header>

      <div className="wip-grid">
        {wip.map((p) => (
          <article key={p.id} className={`wip-card wip-card--${p.mood.replace("wip-", "")}`}>
            <div className="wip-status">
              <span className="wip-badge">Work in progress</span>
              <span className="wip-status-text">{p.status}</span>
            </div>

            {STAGES[p.id]?.()}

            <div className="wip-body">
              <p className="chapter-category">{p.category}</p>
              <h3 className="wip-name">{p.name}</h3>
              <p className="chapter-positioning">{p.positioning}</p>
              <p className="wip-desc">{p.description}</p>
              <ul className="chapter-tags" aria-label="Technologies">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="wip-actions">
                <a
                  className="live-link wip-link"
                  href={p.liveIsInternal ? asset(p.live) : p.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={p.liveLabel}
                >
                  Preview the work in progress
                </a>
                {p.repo && (
                  <a
                    className="live-link wip-link wip-link--repo"
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={p.repoLabel}
                  >
                    {p.repoText || "Code"}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
