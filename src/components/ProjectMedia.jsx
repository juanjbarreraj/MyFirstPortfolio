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

const STAGES = {
  pupoclock: () => (
    <div className="stage stage--pup">
      <Browser
        src={asset("assets/work/pupoclock-home.jpg")}
        alt="Homepage of the live Pup O’Clock website"
        domain="pupoclock.com"
      />
      <Phone
        src={asset("assets/work/pupoclock-mobile.jpg")}
        alt="Pup O’Clock on a phone-sized screen"
      />
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
  openminds: () => (
    <div className="stage stage--om">
      <Browser
        src={asset("assets/work/openminds-home.jpg")}
        alt="Sign-in screen of the live OpenMinds tutoring platform, with Google and email authentication"
        domain="open-minds-studios…base44.app"
      />
      <Phone
        src={asset("assets/work/openminds-mobile.jpg")}
        alt="OpenMinds on a phone-sized screen"
      />
      <span className="stage-accent" aria-hidden="true"></span>
    </div>
  ),
  picklers: () => (
    <div className="stage stage--pk">
      <Browser
        src={asset("assets/work/picklers-home.jpg")}
        alt="Homepage of the live Picklers match-results platform"
        domain="pickler-court-connect…base44.app"
      />
      <Phone
        src={asset("assets/work/picklers-mobile.jpg")}
        alt="Picklers on a phone-sized screen"
      />
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
