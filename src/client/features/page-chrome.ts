/** Small page-wide touches: header shadow on scroll, reveal-on-scroll, footer year, decorative flags. */
export const initPageChrome = () => {
  document.body.classList.add("reveal-ready");
  document.querySelectorAll("#current-year").forEach((year) => { year.textContent = String(new Date().getFullYear()); });

  // The pride flags are decoration: no context menu, dragging or copying.
  document.querySelectorAll(".pride-flags").forEach((flags) => {
    (["contextmenu", "dragstart", "copy"] as const).forEach((name) => flags.addEventListener(name, (event) => event.preventDefault()));
  });

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const revealItems = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  }), { threshold: 0.1, rootMargin: "0px 0px -32px" });
  revealItems.forEach((item) => observer.observe(item));
};
