import { asset } from "../lib/asset.js";

export default function Contact() {
  return (
    <section className="section section--band" id="contact" aria-labelledby="contact-title">
      <header className="section-head">
        <h2 id="contact-title">
          Have an idea?
          <br />
          Let’s make it run.
        </h2>
      </header>

      <div className="contact-body">
        <a className="contact-mail" href="mailto:juanjbarreraj@gmail.com">
          juanjbarreraj
          <wbr />
          @gmail.com
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
          Open to full-time roles and freelance builds. I usually reply within a day.
        </p>
      </div>
    </section>
  );
}
