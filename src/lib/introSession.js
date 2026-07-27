/* Intro playback policy: the intro plays on EVERY page load, including
   refreshes within the same session (Juan's request, 2026-07). The decision
   is memoized per load so IntroTransition and Hero always agree. */

let decision;

export function introWillPlay() {
  if (decision !== undefined) return decision;
  decision = typeof window !== "undefined";
  return decision;
}

/* Kept as the completion hook for IntroTransition. Nothing needs persisting
   while the intro replays on every load; restore sessionStorage gating here
   if once-per-session behavior is ever wanted again. */
export function markIntroPlayed() {}
