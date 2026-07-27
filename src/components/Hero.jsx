import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { EASE } from "./Reveal.jsx";
import { asset } from "../lib/asset.js";
import { introWillPlay } from "../lib/introSession.js";

/* When the session intro plays, hold the hero entrance until the panels
   start opening (~2.4s) so the reveal shows the headline rising through
   the opening seam instead of finishing unseen behind the overlay. */
const INTRO_DELAY = introWillPlay() ? 2.3 : 0;

const lineReveal = {
  hidden: { y: "112%" },
  show: (i) => ({
    y: 0,
    transition: { duration: 0.85, delay: INTRO_DELAY + 0.12 + i * 0.11, ease: EASE },
  }),
};

const softRise = {
  hidden: { opacity: 0, y: 22 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: INTRO_DELAY + 0.55 + i * 0.12, ease: EASE },
  }),
};

export default function Hero() {
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  /* Portrait parallax: image and frame drift at slightly different speeds
     during the first scroll, then settle. Disabled under reduced motion. */
  const yImage = useTransform(scrollY, [0, 640], [0, -34]);
  const yFrame = useTransform(scrollY, [0, 640], [0, -16]);

  const initial = reduced ? false : "hidden";
  const animate = reduced ? false : "show";

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.p
            className="kicker"
            variants={softRise}
            custom={0}
            initial={initial}
            animate={animate}
          >
            <span className="kicker-dot" aria-hidden="true"></span>
            Full-stack software developer · Pittsburgh, PA
          </motion.p>

          <h1 className="hero-title">
            <span className="line">
              <motion.span
                className="w"
                variants={lineReveal}
                custom={0}
                initial={initial}
                animate={animate}
              >
                Ideas In.
              </motion.span>
            </span>
            <span className="line">
              <motion.span
                className="w"
                variants={lineReveal}
                custom={1}
                initial={initial}
                animate={animate}
              >
                Working Software
              </motion.span>
            </span>
            <span className="line line-out">
              <motion.span
                className="w"
                variants={lineReveal}
                custom={2}
                initial={initial}
                animate={animate}
              >
                OUT!
              </motion.span>
            </span>
          </h1>

          <motion.p
            className="hero-intro"
            variants={softRise}
            custom={1}
            initial={initial}
            animate={animate}
          >
            I’m Juan Barrera, a full-stack software developer based in Pittsburgh, PA. I
            build modern software applications and use AI to create innovative, efficient,
            and user-focused solutions. My work combines technical problem-solving,
            thoughtful design, and emerging technologies to turn ideas into reliable
            digital products.
          </motion.p>

          <motion.div
            className="hero-cta"
            variants={softRise}
            custom={2}
            initial={initial}
            animate={animate}
          >
            <a className="btn btn-primary" href="#projects">
              View projects
              <svg className="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5v13m0 0 5.5-5.5M12 18l-5.5-5.5" />
              </svg>
            </a>
            <a
              className="btn btn-ghost"
              href={asset("assets/JuanBarrera.Resume.pdf")}
              target="_blank"
              rel="noopener"
            >
              Download résumé <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </motion.div>
        </div>

        {/* Portrait: upright, editorial layered treatment — offset Evening Blue
            back-frame, vertical mask reveal, Desert Sunset corner accent. */}
        <figure className="hero-portrait">
          <div className="portrait-stack">
            <motion.span
              className="portrait-backframe"
              aria-hidden="true"
              style={reduced ? undefined : { y: yFrame }}
              initial={reduced ? false : { opacity: 0, x: -10, y: 10 }}
              animate={reduced ? false : { opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: INTRO_DELAY + 0.75, ease: EASE }}
            />
            <motion.div
              className="portrait-frame"
              style={reduced ? undefined : { y: yImage }}
              initial={reduced ? false : { clipPath: "inset(100% 0% 0% 0%)" }}
              animate={reduced ? false : { clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 0.95, delay: INTRO_DELAY + 0.4, ease: EASE }}
            >
              <picture>
                <source
                  type="image/jpeg"
                  srcSet={`${asset("assets/profile-420.jpg")} 315w, ${asset(
                    "assets/profile-640.jpg"
                  )} 480w, ${asset("assets/profile-1000.jpg")} 750w`}
                  sizes="(max-width: 900px) 72vw, 360px"
                />
                <img
                  src={asset("assets/profile-640.jpg")}
                  alt="Juan Barrera"
                  width="480"
                  height="640"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </motion.div>
          </div>
        </figure>
      </div>
    </section>
  );
}
