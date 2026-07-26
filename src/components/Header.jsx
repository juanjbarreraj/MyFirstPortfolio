import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { asset } from "../lib/asset.js";

/* Two header states:
   – top of page: transparent, editorial "juanbarrera" wordmark
   – scrolled: Evening Blue bar, wordmark morphs into the JB monogram
   The crossfade/compression choreography lives in CSS driven by .is-scrolled,
   so it stays buttery in both directions and costs no JS per frame. */

export default function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [logoOk, setLogoOk] = useState(true);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 48));

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
                src={asset("assets/brand/jb-logo.svg")}
                alt=""
                width="34"
                height="34"
                onError={() => setLogoOk(false)}
              />
            ) : (
              <span className="brand-jb">JB</span>
            )}
          </span>
        </a>
        <ul className="nav-links">
          <li>
            <a href="#projects">Projects</a>
          </li>
          <li>
            <a href="#education">Education</a>
          </li>
          <li>
            <a href="#leadership">Leadership</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
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
