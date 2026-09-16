# juanjbarreraj.com

Personal portfolio of Juan Barrera, full-stack software developer in Pittsburgh, PA.

Live at **https://juanjbarreraj.com** · Vite + React + Framer Motion, deployed to GitHub Pages.

## Run it

```bash
npm ci
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## How it's put together

- `src/data/projects.js` and `src/data/wip.js` hold all project content; components stay presentational.
- `src/components/Projects.jsx` renders the shipped work as a pinned horizontal journey on desktop, with a vertical fallback on smaller screens and under `prefers-reduced-motion`.
- `src/components/InProgress.jsx` renders work-in-progress builds with explicit WIP status and preview links.
- `src/components/Reveal.jsx` centralizes the motion language: one easing curve, three reveal variants.
- `src/styles/main.css` opens with the design system (60-30-10 palette, type scale, tokens) and a table of contents.
- `public/work/` hosts two self-contained pieces served with the site: the interactive art experience at `/work/el-globo/` and the Califree Control Panel case study at `/work/califree/`.
- Screenshots in `public/assets/work/` are real captures of the live deployments.

## Deploy

Every push to `main` builds and deploys via GitHub Actions (`.github/workflows/static.yml`). The custom domain is configured in Pages settings and pinned by `public/CNAME`.
