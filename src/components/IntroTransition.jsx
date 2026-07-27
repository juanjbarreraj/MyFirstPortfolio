import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { introWillPlay, markIntroPlayed } from "../lib/introSession.js";
import "../styles/intro.css";

/* Branded intro — plays on every page load. The real portfolio is mounted
   and interactive underneath the whole time — this overlay only covers it,
   then opens.

   Timeline (total ≈ 3.0s):
     windowIn             0.00–0.18   terminal window rises on Evening Blue
     messageTyping        0.18–0.74   "Let’s grow together." types (CSS steps)
     messageComplete      0.74–0.80   cursor settles into a steady blink
     bulbOff              0.80        lightbulb appears after the sentence,
                                      unlit (space reserved from the start —
                                      zero text shift)
     bulbOn               1.70        bulb lights: Evening Blue stroke,
                                      Desert Sunset glass, restrained glow
     avatarStageReserved  —           future avatar plays here, between the
                                      lit bulb and panelsOpen; it mounts
                                      inside .intro-avatar-stage
     panelsOpen           2.40–2.86   window divides; halves ride the panels
                                      out L/R, seam opens onto the live site
     siteRevealed         2.86–3.00   overlay unmounts, scroll restored

   The unified window (with text) sits above two pre-mounted, pixel-identical
   window halves attached to the half-viewport panels. At panelsOpen the
   unified window hides and the halves show in the same frame — an invisible
   swap that lets the window genuinely split and travel with the panels. */

const BULB_OFF_AT = 800;
const BULB_ON_AT = 1700;
const PANELS_OPEN_AT = 2400;
const FINISH_AT = 3000;
const REDUCED_FINISH_AT = 260; // reduced motion: show phrase + lit bulb, reveal
const SAFETY_AT = 5500; // failure fallback: always hand the site back

function Chrome({ dots }) {
  return (
    <div className="intro-bar" aria-hidden="true">
      {dots && (
        <>
          <i></i>
          <i></i>
          <i></i>
        </>
      )}
    </div>
  );
}

function Bulb({ state }) {
  return (
    <span
      className={`intro-bulb${state !== "hidden" ? " is-visible" : ""}${
        state === "on" ? " is-on" : ""
      }`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" focusable="false">
        <path
          className="bulb-glass"
          d="M12 3a6.5 6.5 0 0 0-3.9 11.7c.7.55 1.15 1.3 1.3 2.05h5.2c.15-.75.6-1.5 1.3-2.05A6.5 6.5 0 0 0 12 3Z"
        />
        <path className="bulb-base" d="M9.8 19.6h4.4M10.5 21.6h3" />
      </svg>
    </span>
  );
}

export default function IntroTransition() {
  const [play] = useState(introWillPlay);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [bulb, setBulb] = useState(() => (reduced ? "on" : "hidden"));
  const finished = useRef(false);

  useEffect(() => {
    if (!play) return;

    /* lock scroll while the overlay owns the viewport */
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      markIntroPlayed(); // only set once the site is safely revealed
      document.documentElement.style.overflow = prevOverflow;
      setDone(true);
    };

    const timers = reduced
      ? [setTimeout(finish, REDUCED_FINISH_AT)]
      : [
          setTimeout(() => setBulb("off"), BULB_OFF_AT),
          setTimeout(() => setBulb("on"), BULB_ON_AT),
          setTimeout(() => setOpen(true), PANELS_OPEN_AT),
          setTimeout(finish, FINISH_AT),
        ];
    timers.push(setTimeout(finish, SAFETY_AT)); // failure fallback

    return () => {
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [play, reduced]);

  if (!play || done) return null;

  const panelTransition = { duration: 0.46, ease: [0.76, 0, 0.24, 1] };

  return (
    <div className={`intro${open ? " is-open" : ""}${reduced ? " intro--reduced" : ""}`} role="presentation">
      <motion.div
        className="intro-panel intro-panel--l"
        initial={false}
        animate={{ x: open ? "-100%" : "0%" }}
        transition={panelTransition}
      >
        <div className="intro-half intro-half--l" aria-hidden="true">
          <Chrome dots />
        </div>
      </motion.div>

      <motion.div
        className="intro-panel intro-panel--r"
        initial={false}
        animate={{ x: open ? "100%" : "0%" }}
        transition={panelTransition}
      >
        <div className="intro-half intro-half--r" aria-hidden="true">
          <Chrome />
        </div>
      </motion.div>

      {/* avatarStageReserved: the future avatar layer mounts here. Empty and
          zero-cost in this temporary version. */}
      <div className="intro-avatar-stage" aria-hidden="true"></div>

      {!open && (
        <motion.div
          className="intro-window"
          initial={reduced ? false : { opacity: 0, scaleY: 0.72 }}
          animate={reduced ? false : { opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <Chrome dots />
          <p className="intro-line">
            <span className="intro-prompt" aria-hidden="true">
              &#10095;
            </span>
            <span className="intro-type">Let’s grow together.</span>
            <Bulb state={bulb} />
          </p>
        </motion.div>
      )}
    </div>
  );
}
