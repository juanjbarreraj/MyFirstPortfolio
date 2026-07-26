/* Resolves a public/ path against the Vite base so assets work both in dev
   and on the GitHub Pages project path. */
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, "");
