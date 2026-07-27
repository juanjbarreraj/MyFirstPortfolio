import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { projects } from "../data/projects.js";
import ProjectMedia from "./ProjectMedia.jsx";
import { Reveal } from "./Reveal.jsx";

/* ============================== PROJECTS ==============================
   "Horizontal Journey": on desktop the section pins and vertical scroll
   drives a horizontal track through four project chapters. Scroll distance
   maps 1:1 to horizontal distance (section height = 100vh + track overflow)
   so native scrolling is preserved — no hijack. On tablet/mobile and under
   prefers-reduced-motion the same chapters render as a vertical narrative. */

function GhIcon() {
  return (
    <svg className="gh-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.56 9.56 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function LiveIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function ChapterActions({ project, onFocusJump }) {
  return (
    <div className="chapter-actions">
      <a
        className="gh-link"
        href={project.repo}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={project.repoLabel}
        onFocus={onFocusJump}
      >
        <GhIcon />
        <span className="gh-label" aria-hidden="true">
          Repository
        </span>
      </a>
      {project.live && (
        <a
          className="live-link"
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          onFocus={onFocusJump}
        >
          Live site
          <LiveIcon />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

/* ----------------------------- desktop ----------------------------- */

function HorizontalJourney() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const offsetsRef = useRef([]);
  const [maxX, setMaxX] = useState(0);
  const [active, setActive] = useState(-1); // -1 = intro panel

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const overflow = Math.max(0, track.scrollWidth - window.innerWidth);
    setMaxX(overflow);
    const panels = track.querySelectorAll("[data-panel]");
    offsetsRef.current = Array.from(panels).map((el) => el.offsetLeft);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    /* re-measure once webfonts settle so panel widths are exact */
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -maxX]);
  const x = useSpring(xRaw, { stiffness: 110, damping: 26, mass: 0.4 });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const visibleX = p * maxX;
    const threshold = window.innerWidth * 0.32;
    let current = -1;
    offsetsRef.current.forEach((offset, i) => {
      if (offset - threshold <= visibleX) current = i;
    });
    setActive(current);
  });

  const jumpTo = useCallback(
    (i, smooth = true) => {
      const section = sectionRef.current;
      const offset = offsetsRef.current[i];
      if (!section || offset == null) return;
      window.scrollTo({
        top: section.offsetTop + offset,
        behavior: smooth ? "smooth" : "auto",
      });
    },
    []
  );

  /* keyboard users: when a link inside an off-screen chapter receives focus,
     snap the journey to that chapter so focus is never invisible */
  const focusJump = (i) => () => {
    if (active !== i) jumpTo(i, false);
  };

  return (
    <section
      className="section journey"
      id="projects"
      ref={sectionRef}
      style={{ height: maxX ? `calc(100vh + ${maxX}px)` : "auto" }}
      aria-labelledby="projects-title"
    >
      <div className="journey-viewport">
        <motion.div className="journey-track" ref={trackRef} style={{ x }}>
          <header className="journey-intro">
            <p className="kicker">
              <span className="kicker-dot" aria-hidden="true"></span>
              Projects
            </p>
            <h2 id="projects-title">
              Four builds,
              <br />
              end to end.
            </h2>
            <p className="section-lede">
              Product thinking, interface design, back-end logic, and delivery: four
              different products for four different kinds of users.
            </p>
            <ol className="journey-toc" aria-label="Project index">
              {projects.map((p, i) => (
                <li key={p.id}>
                  <button type="button" onClick={() => jumpTo(i)}>
                    <span aria-hidden="true">{p.index}</span> {p.name}
                  </button>
                </li>
              ))}
            </ol>
            <p className="journey-hint" aria-hidden="true">
              Keep scrolling
              <svg className="ico" viewBox="0 0 24 24" focusable="false">
                <path d="M5 12h13m0 0-5.5-5.5M18 12l-5.5 5.5" />
              </svg>
            </p>
          </header>

          {projects.map((p, i) => (
            <article
              key={p.id}
              data-panel
              className={`chapter chapter--${p.mood}${active === i ? " is-active" : ""}`}
            >
              <div className="chapter-info">
                <p className="chapter-index" aria-hidden="true">
                  {p.index}
                </p>
                <p className="chapter-category">{p.category}</p>
                <h3 className="chapter-name">{p.name}</h3>
                <p className="chapter-positioning">{p.positioning}</p>
                <p className="chapter-desc">{p.description}</p>
                <ul className="chapter-tags" aria-label="Technologies">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <ChapterActions project={p} onFocusJump={focusJump(i)} />
              </div>
              <div className="chapter-stage">
                <ProjectMedia id={p.id} />
              </div>
            </article>
          ))}
        </motion.div>

        <nav className="journey-progress" aria-label="Project progress">
          <span className="journey-count" aria-hidden="true">
            01·04
          </span>
          <div className="journey-bar" aria-hidden="true">
            <motion.span className="journey-bar-fill" style={{ scaleX: scrollYProgress }} />
          </div>
          <ol className="journey-dots">
            {projects.map((p, i) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={active === i ? "is-active" : ""}
                  aria-label={`Go to project ${p.index}: ${p.name}`}
                  aria-current={active === i ? "true" : undefined}
                  onClick={() => jumpTo(i)}
                >
                  {p.index}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}

/* ------------------------ tablet / mobile / reduced ------------------------ */

function VerticalJourney() {
  return (
    <section className="section journey-vertical" id="projects" aria-labelledby="projects-title">
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot" aria-hidden="true"></span>
          Projects
        </p>
        <h2 id="projects-title">
          Four builds,
          <br />
          end to end.
        </h2>
        <p className="section-lede">
          Product thinking, interface design, back-end logic, and delivery: four different
          products for four different kinds of users.
        </p>
      </Reveal>

      <div className="vchapters">
        {projects.map((p) => (
          <Reveal as="article" key={p.id} className={`vchapter chapter--${p.mood}`}>
            <div className="vchapter-head">
              <span className="chapter-index" aria-hidden="true">
                {p.index}
              </span>
              <div>
                <p className="chapter-category">{p.category}</p>
                <h3 className="chapter-name">{p.name}</h3>
              </div>
            </div>
            <div className="chapter-stage">
              <ProjectMedia id={p.id} />
            </div>
            <p className="chapter-positioning">{p.positioning}</p>
            <p className="chapter-desc">{p.description}</p>
            <ul className="chapter-tags" aria-label="Technologies">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <ChapterActions project={p} onFocusJump={() => {}} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function Projects() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  return isDesktop && !reduced ? <HorizontalJourney /> : <VerticalJourney />;
}
