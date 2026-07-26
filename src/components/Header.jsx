import { useEffect, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { asset } from "../lib/asset.js";

/* Two header states:
   – top of page: transparent, editorial "juanbarrera" wordmark
   – scrolled: Evening Blue bar, wordmark crossfades into the supplied JB
     monogram (public/assets/brand/jb-logo-nav.png — a trimmed retina copy
     of Juan's jb-logo.png; CSS inverts the black mark to white on blue).
   Nav links carry a hidden "keycap" surface (CSS ::before) that rises on
   hover/focus and presses in on click. A scroll-spy marks the current
   section with a small Desert Sunset indicator. */

const SECTIONS = ["projects", "education", "leadership", "contact"];

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const [current, setCurrent] = useState("");

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

  /* scroll-spy: the section crossing the viewport's middle band is current */
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setCurrent(e.target.id);
          } else {
            setCurrent((c) => (c === e.target.id ? "" : c));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const link = (id, label) => (
    <li>
      <a href={`#${id}`} className={current === id ? "is-current" : undefined}>
        <span className="nav-label">{label}</span>
      </a>
    </li>
  );

  return (
    <header className={`site-head${scrolled ? " is-scrolled" : ""}`} id="site-head">
      <nav className="nav" aria-label="Primary">
        <a className="brand" href="#top" aria-label="Juan Barrera — home">
          <span className="brand-word" aria-hidden="true">
            <span className="brand-prompt">&#10095;</span>
            <span className="brand-name">juanbarrera</span>
            <span className="brand-cursor"></span>
          </span>
          <span className="brand-logo" aria-hidden="true">
            {logoOk ? (
              <img
                src={asset("assets/brand/jb-logo-nav.png")}
                alt=""
                width="49"
                height="34"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="brand-jb">JB</span>
            )}
          </span>
        </a>
        <ul className="nav-links">
          {link("projects", "Projects")}
          {link("education", "Education")}
          {link("leadership", "Leadership")}
          {link("contact", "Contact")}
        </ul>
        <a
          className="btn btn-ghost nav-resume"
          href={asset("assets/JuanBarrera.Resume.pdf")}
          target="_blank"
          rel="noopener"
        >
          Résumé
          <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M12 4v11m0 0 4.5-4.5M12 15l-4.5-4.5M5 19.5h14" />
          </svg>
          <span className="sr-only">(PDF, opens in a new tab)</span>
        </a>
      </nav>
    </header>
  );
}
