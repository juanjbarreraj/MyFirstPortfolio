import { asset } from "../lib/asset.js";
import { wip } from "../data/wip.js";
import { Reveal } from "./Reveal.jsx";

/* ============================ IN PROGRESS ============================
   "The Bench": work that is real and live as a preview, but not finished.
   Deliberately distinct from the four shipped builds — each project gets
   its own art-directed stage instead of the standard browser+phone pair,
   every card carries a visible WIP status, and links say "Preview", not
   "Live site". No repositories are linked until each project ships. */

function PreviewIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

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

  /* Trackeo: dark product UI + phone capture, with track-lane accents. */
  trackeo: () => (
    <div className="wip-stage wip-stage--track">
      <WipFrame
        src={asset("assets/work/wip/trackeo-home.jpg")}
        alt="Homepage of the Trackeo athletics results platform demo"
      />
      <figure className="wip-phone">
        <img
          src={asset("assets/work/wip/trackeo-mobile.jpg")}
          alt="Trackeo on a phone-sized screen"
          width={390}
          height={844}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <span className="wip-lanes" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
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
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot kicker-dot--wip" aria-hidden="true"></span>
          In the studio
        </p>
        <h2 id="wip-title">
          Three builds,
          <br />
          in progress.
        </h2>
        <p className="section-lede">
          Not finished, not hidden. These are live previews of work on the bench right now:
          what you see is real, and what is missing is labeled.
        </p>
      </Reveal>

      <div className="wip-grid">
        {wip.map((p) => (
          <Reveal as="article" key={p.id} className={`wip-card wip-card--${p.mood.replace("wip-", "")}`}>
            <div className="wip-status" role="status">
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
              <a
                className="live-link wip-link"
                href={p.liveIsInternal ? asset(p.live) : p.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.liveLabel}
              >
                Preview the work in progress
                <PreviewIcon />
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
