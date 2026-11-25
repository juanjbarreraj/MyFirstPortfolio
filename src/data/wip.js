/* Work currently in progress. These are real client and product builds that
   are live as previews but not finished: descriptions state only what already
   exists in the deployed preview. Repositories are linked as they go public. Screenshots are real captures (2026-08). */

export const wip = [
  {
    id: "mireya",
    name: "Mireya Rojas Fenoy, Artist Portfolio",
    category: "Bilingual portfolio",
    positioning: "A 2D artist's world, in two languages.",
    description:
      "Portfolio for a Spanish-Colombian 2D artist and animator. Fully bilingual English/Spanish with per-page language switching, a custom zero-dependency static build pipeline, and a hand-drawn visual system built around her own artwork.",
    status: "Design and build complete, final artwork and copy landing",
    tags: ["EN/ES i18n", "Custom static build", "Zero dependencies", "Netlify"],
    live: "https://mireyasportfolioworkinprogress.netlify.app/en/",
    liveLabel: "Preview Mireya's portfolio (work in progress, opens in a new tab)",
    repo: "https://github.com/juanjbarreraj/Mireya-sPortfolio",
    repoLabel: "View the Mireya portfolio repository on GitHub",
    mood: "wip-art",
  },
  {
    id: "elglobo",
    name: "The Art of War and Peace",
    category: "Interactive art experience",
    positioning: "A sculpture you can turn in your hands.",
    description:
      "Digital companion to an installation by Pittsburgh sculptor Lorrie Anne Minicozzi: a custom WebGL globe, written from scratch with no libraries, carrying 44 hand-drawn figures you can rotate and open, each with the artist's own story for it.",
    status: "Experience built, awaiting photography of the finished sculpture",
    tags: ["WebGL from scratch", "Single-file build", "44 interactive figures", "Art direction"],
    live: "work/lorrie-minicozzi/",
    liveIsInternal: true,
    liveLabel: "Preview The Art of War and Peace experience (work in progress, opens in a new tab)",
    repo: "https://github.com/juanjbarreraj/MyFirstPortfolio/blob/main/public/work/el-globo/index.html",
    repoLabel: "View the single-file source on GitHub",
    mood: "wip-globe",
  },
];
