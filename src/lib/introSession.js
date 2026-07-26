/* Once-per-session playback for the intro transition.
   – sessionStorage only (new browser session ⇒ plays again; refresh ⇒ doesn't)
   – ?playIntro=true forces a replay for development testing
   – if storage is unavailable (private mode edge cases) we DON'T play, so a
     broken environment never loops the intro on every refresh */

const KEY = "portfolioIntroPlayed";

let decision; // memoized so IntroTransition and Hero agree on one answer

export function introWillPlay() {
  if (decision !== undefined) return decision;
  if (typeof window === "undefined") return (decision = false);
  try {
    if (new URLSearchParams(window.location.search).has("playIntro")) {
      return (decision = true);
    }
    decision = sessionStorage.getItem(KEY) !== "1";
  } catch {
    decision = false;
  }
  return decision;
}

/* called only after the transition completed or safely fell back */
export function markIntroPlayed() {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage unavailable — nothing to persist */
  }
}
