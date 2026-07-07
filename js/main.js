// Verdant — interactions
(function () {
  "use strict";

  // Sticky nav background on scroll
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("nav--scrolled");
    else nav.classList.remove("nav--scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu toggle
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => links.classList.remove("open"))
  );

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Reservation form (demo — no backend)
  const form = document.getElementById("reserveForm");
  const ok = document.getElementById("reserveOk");
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    ok.hidden = false;
    form.reset();
    setTimeout(() => (ok.hidden = true), 6000);
  });

  // Default reservation date = today
  const dateInput = document.getElementById("rDate");
  if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
})();
