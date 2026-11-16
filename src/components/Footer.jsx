export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="foot-inner">
        <p className="foot-mark">Juan Barrera</p>
        <p className="foot-colophon">
          Designed &amp; built from scratch: React, Framer Motion, hand-written CSS. No
          templates.
        </p>
        <p className="foot-copy">© {new Date().getFullYear()} Juan Barrera</p>
      </div>
    </footer>
  );
}
