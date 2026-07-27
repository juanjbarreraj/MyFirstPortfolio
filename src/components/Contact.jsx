import { Reveal } from "./Reveal.jsx";
import { asset } from "../lib/asset.js";

export default function Contact() {
  return (
    <section className="section section--band" id="contact" aria-labelledby="contact-title">
      <Reveal as="header" className="section-head">
        <p className="kicker">
          <span className="kicker-dot" aria-hidden="true"></span>
          Contact
        </p>
        <h2 id="contact-title">
          Have an idea?
          <br />
          Let’s make it run.
        </h2>
      </Reveal>

      <Reveal className="contact-body" delay={0.1}>
        <a className="contact-mail" href="mailto:juanjbarreraj@gmail.com">
          juanjbarreraj
          <wbr />
          @gmail.com
          <svg className="mail-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6 18 18 6m0 0H8m10 0v10" />
          </svg>
        </a>

        <ul className="contact-links">
          <li>
            <a href="https://github.com/juanjbarreraj" target="_blank" rel="noopener noreferrer">
              GitHub <span className="sr-only">profile (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/juanjbarreraj/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn <span className="sr-only">profile (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={asset("assets/JuanBarrera.Resume.pdf")} target="_blank" rel="noopener">
              Resume <span className="sr-only">(PDF, opens in a new tab)</span>
            </a>
          </li>
        </ul>

        <p className="contact-note">
          Open to full-time roles and freelance builds · usually replies within a day.
        </p>
      </Reveal>
    </section>
  );
}
