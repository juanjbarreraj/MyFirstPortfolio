const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const carousel = document.querySelector(".project-carousel");
const track = document.querySelector(".project-track");
const projectCards = Array.from(document.querySelectorAll(".project-card"));
const arrowButtons = document.querySelectorAll(".carousel-arrow");
const dotsContainer = document.querySelector(".carousel-dots");
let activeProject = 0;
let startX = 0;
let autoplayId;
let resumeId;

function wrapIndex(index) {
  return (index + projectCards.length) % projectCards.length;
}

function getOffset(cardIndex) {
  const rawOffset = cardIndex - activeProject;
  const half = projectCards.length / 2;
  if (rawOffset > half) return rawOffset - projectCards.length;
  if (rawOffset < -half) return rawOffset + projectCards.length;
  return rawOffset;
}

function renderDots() {
  if (!dotsContainer || projectCards.length === 0) return;
  dotsContainer.innerHTML = projectCards
    .map((card, index) => {
      const title = card.querySelector("h3")?.textContent || `Project ${index + 1}`;
      return `<button type="button" aria-label="Show ${title}" data-index="${index}"></button>`;
    })
    .join("");

  dotsContainer.querySelectorAll("button").forEach((dot) => {
    dot.addEventListener("click", () => {
      pauseAutoplay();
      setActiveProject(Number(dot.dataset.index));
      scheduleAutoplay();
    });
  });
}

function updateCarousel() {
  if (projectCards.length === 0) return;

  projectCards.forEach((card, index) => {
    const offset = getOffset(index);
    card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");
    card.setAttribute("aria-hidden", Math.abs(offset) > 1 ? "true" : "false");

    if (offset === 0) card.classList.add("is-active");
    if (offset === -1) card.classList.add("is-prev");
    if (offset === 1) card.classList.add("is-next");
    if (offset === -2) card.classList.add("is-far-prev");
    if (offset === 2) card.classList.add("is-far-next");
  });

  dotsContainer?.querySelectorAll("button").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === activeProject);
  });
}

function setActiveProject(index) {
  activeProject = wrapIndex(index);
  updateCarousel();
}

function moveCarousel(direction) {
  setActiveProject(activeProject + direction);
}

function startAutoplay() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stopAutoplay();
  autoplayId = window.setInterval(() => moveCarousel(1), 3600);
}

function stopAutoplay() {
  window.clearInterval(autoplayId);
}

function pauseAutoplay() {
  stopAutoplay();
  window.clearTimeout(resumeId);
}

function scheduleAutoplay() {
  window.clearTimeout(resumeId);
  resumeId = window.setTimeout(startAutoplay, 2800);
}

arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    pauseAutoplay();
    moveCarousel(button.dataset.direction === "next" ? 1 : -1);
    scheduleAutoplay();
  });
});

if (carousel) {
  carousel.addEventListener("mouseenter", pauseAutoplay);
  carousel.addEventListener("mouseleave", scheduleAutoplay);
  carousel.addEventListener("focusin", pauseAutoplay);
  carousel.addEventListener("focusout", scheduleAutoplay);
  carousel.addEventListener("touchstart", (event) => {
    pauseAutoplay();
    startX = event.changedTouches[0].screenX;
  });
  carousel.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].screenX - startX;
    if (Math.abs(distance) > 45) {
      moveCarousel(distance < 0 ? 1 : -1);
    }
    scheduleAutoplay();
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
renderDots();
updateCarousel();
startAutoplay();
