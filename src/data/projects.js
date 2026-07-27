/* The four approved projects. Descriptions state only facts verified from
   the live deployments (captured 2026-07) and the approved portfolio copy.
   Screenshots in public/assets/work/ are real captures of the live sites. */

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
      "A full-stack tutoring platform for Open Minds Studios. Role-based dashboards for students, tutors, and administrators; appointment scheduling and tutor availability; learning modules; and automated lead capture with email notifications, file uploads, and Google Sheets sync.",
    tags: ["React", "Role-based auth", "Scheduling", "Automation", "Cloud-hosted"],
    repo: "https://github.com/juanjbarreraj/OpenMinds",
    repoLabel: "View OpenMinds repository on GitHub",
    live: "https://open-minds-studios-working-draft.base44.app/Home",
    mood: "structured",
  },
  {
    id: "picklers",
    index: "03",
    name: "Picklers",
    category: "Community platform",
    positioning: "Pittsburgh’s pickleball platform.",
    description:
      "A community platform for Pittsburgh pickleball: live player rankings that update after every verified match, tournament creation with bracket management, court discovery with live crowding, and match tracking. Built end to end and live today.",
    tags: ["Full-stack", "Community app", "Rankings", "Tournaments", "Live deployment"],
    repo: "https://github.com/juanjbarreraj/Picklers",
    repoLabel: "View Picklers repository on GitHub",
    live: "https://pickler-court-connect.base44.app/",
    mood: "energetic",
  },
  {
    id: "efficiency",
    index: "04",
    name: "Efficiency Appliance LLC",
    category: "Production client site",
    positioning: "A small business, launched.",
    description:
      "Production website for a Pittsburgh appliance-repair company: designed, built, and launched on a custom domain. Responsive Bootstrap layout with services, a 20-brand showcase, and click-to-call contact. Live today at efficiencyappliances.com.",
    tags: ["HTML", "CSS", "Bootstrap 5", "Custom domain"],
    repo: "https://github.com/juanjbarreraj/EfficiencyApplianceLLC",
    repoLabel: "View Efficiency Appliance LLC repository on GitHub",
    live: "https://efficiencyappliances.com",
    mood: "service",
  },
];
