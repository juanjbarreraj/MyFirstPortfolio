import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Projects from "./components/Projects.jsx";
import Education from "./components/Education.jsx";
import Leadership from "./components/Leadership.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Projects />
        <Education />
        <Leadership />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
