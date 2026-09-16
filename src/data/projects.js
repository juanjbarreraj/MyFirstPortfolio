/* The four shipped projects. Descriptions state only facts verified from
   the live deployments and the approved portfolio copy. Screenshots in
   public/assets/work/ are real captures of the live sites and, for the
   Califree chapter, of its case study page hosted on this site. */

export const projects = [
  {
    id: "pupoclock",
    index: "01",
    name: "Pup O’Clock",
    category: "Consumer subscription product",
    positioning: "A subscription box for kids and dogs.",
    description:
      "A themed monthly subscription box designed for kids and dogs together: vet-approved enrichment, training tools, and family activities that make responsible pet ownership fun. Every box sold supports shelter dogs. Live at pupoclock.com.",
    tags: ["Live product", "Subscription box", "Consumer brand"],
    repo: "https://github.com/juanjbarreraj/PupOClock",
    repoLabel: "View Pup O’Clock repository on GitHub",
    live: "https://pupoclock.com/",
    mood: "warm",
  },
  {
    id: "openminds",
    index: "02",
    name: "OpenMinds",
    category: "Full-stack platform",
    positioning: "Tutoring, organized end to end.",
    description:
      "A full-stack platform for Open Minds Studios, a real tutoring business: role-based portals for students, tutors, and managers, appointment scheduling and tutor availability, and lead capture. Originally assembled on a no-code host, then migrated to a custom Node and SQLite backend with server-side authorization. Live at openmindsstudios.com.",
    tags: ["React", "Node + Express", "SQLite", "Role-based auth", "Netlify + Render"],
    repo: "https://github.com/juanjbarreraj/open-minds-studios",
    repoLabel: "View the Open Minds Studios repository on GitHub",
    live: "https://openmindsstudios.com",
    mood: "structured",
  },
  {
    id: "serverpanel",
    index: "03",
    name: "Califree Control Panel",
    category: "Self-hosted platform",
    positioning: "A game server that runs itself.",
    description:
      "A self-hosted Minecraft server platform on an Oracle Cloud ARM instance: a Flask control panel with 107 endpoints, a Java service that reads the game's own world generator to map terrain before anyone walks there, two live maps, and a zero-touch update pipeline. Around 20,000 lines of Python, JavaScript, Java and Bash, specified, built, deployed and operated end to end. The full case study lives on this site.",
    tags: ["Python + Flask", "Vanilla JS + canvas", "Java", "Oracle Cloud ARM", "systemd + CI/CD"],
    caseStudy: "work/califree/",
    caseStudyLabel: "Read the Califree Control Panel case study (opens in a new tab)",
    repo: "https://github.com/juanjbarreraj/ServerPanel",
    repoLabel: "View the Califree server panel repository on GitHub",
    live: "https://califree.net",
    mood: "ops",
  },
  {
    id: "efficiency",
    index: "04",
    name: "Efficiency Appliance LLC",
    category: "Production client site",
    positioning: "A small business, launched. My first ever.",
    description:
      "Production website for a Pittsburgh appliance-repair company: designed, built, and launched on a custom domain. Responsive Bootstrap layout with services, a 20-brand showcase, and click-to-call contact. This was my first website ever, and it keeps a reserved place here on purpose: it is where everything else on this page started. Live today at efficiencyappliances.com.",
    tags: ["HTML", "CSS", "Bootstrap 5", "Custom domain", "First ever build"],
    repo: "https://github.com/juanjbarreraj/EfficiencyApplianceLLC",
    repoLabel: "View Efficiency Appliance LLC repository on GitHub",
    live: "https://efficiencyappliances.com",
    mood: "service",
  },
];
