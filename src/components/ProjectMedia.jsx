import { asset } from "../lib/asset.js";

/* Art-directed media stages — one per project, all real product media.
   Desktop screenshots sit in a browser frame; a phone-framed mobile capture
   overlaps for depth. Each project's mood shifts the composition + accent.
   All dimensions are fixed to prevent layout shift. */

function Browser({ src, alt, domain, width = 1440, height = 900 }) {
  return (
    <figure className="stage-browser">
      <div className="stage-chrome" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
        <span>{domain}</span>
      </div>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </figure>
  );
}

function Phone({ src, alt, width = 390, height = 844 }) {
  return (
    <figure className="stage-phone" aria-hidden={alt ? undefined : "true"}>
      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </figure>
  );
}

/* A phone frame whose screen slowly crawls through a full-page capture of the
   live mobile site, so the stage reads as the site being browsed. Purely
   decorative motion: it pauses on hover and turns off under
   prefers-reduced-motion (see .stage-phone--live in main.css). */
function LivePhone({ src, alt, width, height }) {
  return (
    <figure className="stage-phone stage-phone--live">
      <div className="phone-scroll">
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </div>
    </figure>
  );
}

const STAGES = {
  pupoclock: () => (
    <div className="stage stage--pup">
      <Browser
        src={asset("assets/work/pupoclock-home.jpg")}
        alt="Homepage of the live Pup O’Clock website"
        domain="pupoclock.com"
      />
      <LivePhone
        src={asset("assets/work/pupoclock-mobile-full.jpg")}
        alt="The full Pup O’Clock mobile site, scrolling slowly from top to bottom"
        width={420}
        height={9242}
      />
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
  openminds: () => (
    <div className="stage stage--om">
      <Browser
        src={asset("assets/work/openminds-home.jpg")}
        alt="Student Portal page of the live Open Minds Studios site, showing the demo student dashboard with progress stats and upcoming sessions"
        domain="openmindsstudios.com"
      />
      <Phone
        src={asset("assets/work/openminds-mobile.jpg")}
        alt="Open Minds Studios on a phone-sized screen"
      />
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
  serverpanel: () => (
    <div className="stage stage--sp">
      <Browser
        src={asset("assets/work/serverpanel-panel.jpg")}
        alt="Home view of the live Califree control panel: server online, tick-time and memory charts, and the join info card"
        domain="califree.net"
      />
      {/* Secondary card: the player book view. Placeholder slot for a
          recorded video walkthrough of the panel, coming later. */}
      <figure className="stage-card" aria-hidden="true">
        <img
          src={asset("assets/work/serverpanel-players.jpg")}
          alt=""
          width={1440}
          height={828}
          loading="lazy"
          decoding="async"
        />
      </figure>
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
  efficiency: () => (
    <div className="stage stage--ef">
      <Browser
        src={asset("assets/work/efficiency.jpg")}
        alt="Homepage of the live Efficiency Appliance LLC website"
        domain="efficiencyappliances.com"
        width={1184}
        height={750}
      />
      <ul className="stage-brands" aria-label="A few of the twenty appliance brands showcased on the site">
        {["whirlpool", "geappliances", "lg", "samsung", "bosch", "maytag"].map((b) => (
          <li key={b}>
            <img
              src={asset(`assets/work/efficiency/${b}.svg`)}
              alt={
                {
                  whirlpool: "Whirlpool",
                  geappliances: "GE Appliances",
                  lg: "LG",
                  samsung: "Samsung",
                  bosch: "Bosch",
                  maytag: "Maytag",
                }[b]
              }
              width="72"
              height="36"
              loading="lazy"
            />
          </li>
        ))}
      </ul>
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
};

export default function ProjectMedia({ id }) {
  const Stage = STAGES[id];
  return Stage ? <Stage /> : null;
}
