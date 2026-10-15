const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Scrolls to the element with this id. Returns false when it isn't on the page.
export function scrollToId(id) {
  const target = id && document.getElementById(id);
  if (!target) return false;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  return true;
}
