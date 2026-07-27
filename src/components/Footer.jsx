export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="foot-inner">
        <p className="foot-mark">
          <span className="brand-prompt" aria-hidden="true">
            &#10095;
          </span>{" "}
          juanbarrera
          <span className="foot-cursor" aria-hidden="true">
            _
          </span>
        </p>
        <p className="foot-colophon">
          Designed &amp; built from scratch: React, Framer Motion, hand-written CSS. No
          templates.
        </p>
        <p className="foot-copy">© {new Date().getFullYear()} Juan Barrera</p>
      </div>
    </footer>
  );
}
