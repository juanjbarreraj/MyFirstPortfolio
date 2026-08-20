/* Work currently in progress. These are real client and product builds that
   are live as previews but not finished: descriptions state only what already
   exists in the deployed preview. No repositories are linked yet — code goes
   public when each project ships. Screenshots are real captures (2026-08). */

export const wip = [
  {
    id: "mireya",
    name: "Mireya Rojas Fenoy, Artist Portfolio",
    category: "Bilingual portfolio",
    positioning: "A 2D artist's world, in two languages.",
    description:
      "Portfolio for a Spanish-Colombian 2D artist and animator. Fully bilingual English/Spanish with per-page language switching, a custom zero-dependency static build pipeline, and a hand-drawn visual system built around her own artwork.",
    status: "Design and build complete · final artwork and copy landing",
    tags: ["EN/ES i18n", "Custom static build", "Zero dependencies", "Netlify"],
    live: "https://mireyasportfolioworkinprogress.netlify.app/en/",
    liveLabel: "Preview Mireya's portfolio (work in progress, opens in a new tab)",
    mood: "wip-art",
  },
  {
    id: "trackeo",
    name: "Trackeo",
    category: "Sports results platform",
    positioning: "Official athletics results, from paper to rankings.",
    description:
      "A results platform for athletics leagues: competition score sheets generated as matching PDF and Excel pairs, spreadsheet import with automatic recognition, and league rankings and records. The public demo runs entirely in the browser while the backend is in development.",
    status: "Interactive demo live · backend in development",
    tags: ["React", "Vite", "IndexedDB demo", "PDF + Excel generation", "Spanish-first"],
    live: "https://juanjbarreraj.github.io/trackeo-demo/",
    liveLabel: "Preview the Trackeo demo (work in progress, opens in a new tab)",
    mood: "wip-track",
  },
  {
    id: "elglobo",
    name: "The Art of War and Peace",
    category: "Interactive art experience",
    positioning: "A sculpture you can turn in your hands.",
    description:
      "Digital companion to an installation by Pittsburgh sculptor Lorrie Anne Minicozzi: a custom WebGL globe, written from scratch with no libraries, carrying 44 hand-drawn figures you can rotate and open, each with the artist's own story for it.",
    status: "Experience built · awaiting photography of the finished sculpture",
    tags: ["WebGL from scratch", "Single-file build", "44 interactive figures", "Art direction"],
    live: "work/el-globo/",
    liveIsInternal: true,
    liveLabel: "Preview The Art of War and Peace experience (work in progress, opens in a new tab)",
    mood: "wip-globe",
  },
];
