// Oishi Food & Milktea — Premium interactions & animations v3
(function () {
  "use strict";

  // ── Loading Screen ──
  const loader = document.createElement("div");
  loader.className = "loader";
  loader.innerHTML = `<div class="loader__mark"><img src="images/logo.png" alt="Oishi" style="height:48px;width:auto;border-radius:8px" /></div><div class="loader__bar"></div>`;
  document.body.prepend(loader);

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.classList.add("loader--hidden");
      setTimeout(() => {
        document.querySelectorAll(".hero .reveal").forEach((el, i) => {
          setTimeout(() => el.classList.add("in"), i * 150);
        });
      }, 200);
      setTimeout(() => loader.remove(), 800);
    }, 800);
  });

  // ── Video Intro Overlay ──
  const videoIntro = document.getElementById("videoIntro");
  const videoEl = document.getElementById("videoIntroEl");
  const skipBtn = document.getElementById("videoIntroSkip");
  const heroVideoBg = document.getElementById("heroVideoBg");
  let introDismissed = false;

  function dismissIntro() {
    if (introDismissed || !videoIntro) return;
    introDismissed = true;
    videoIntro.classList.add("video-intro--hidden");
    if (heroVideoBg) heroVideoBg.classList.add("is-active");
    // Trigger hero reveals
    setTimeout(() => {
      document.querySelectorAll(".hero .reveal").forEach((el, i) => {
        setTimeout(() => el.classList.add("in"), i * 150);
      });
    }, 400);
    setTimeout(() => {
      if (videoIntro) videoIntro.remove();
    }, 1300);
  }

  if (videoEl) {
    videoEl.addEventListener("loadeddata", () => {
      // Video loaded — play with intro sequence
    });
    videoEl.addEventListener("ended", dismissIntro);
    videoEl.addEventListener("error", () => {
      // Video failed — skip intro immediately
      if (videoIntro) videoIntro.remove();
      if (heroVideoBg) heroVideoBg.classList.add("is-active");
      introDismissed = true;
    });
  }
  if (skipBtn) {
    skipBtn.addEventListener("click", dismissIntro);
  }
  // Auto-dismiss after 6s fallback
  setTimeout(() => {
    if (!introDismissed && videoIntro) dismissIntro();
  }, 6000);

  // ── Cursor Glow (desktop only) ──
  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);
  let glowX = 0, glowY = 0, currentGlowX = 0, currentGlowY = 0;
  document.addEventListener("mousemove", (e) => { glowX = e.clientX; glowY = e.clientY; });
  function animateGlow() {
    currentGlowX += (glowX - currentGlowX) * 0.08;
    currentGlowY += (glowY - currentGlowY) * 0.08;
    glow.style.left = currentGlowX + "px";
    glow.style.top = currentGlowY + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();

  // ── Scroll Progress ──
  const progressBar = document.getElementById("scrollProgress");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // ── Sticky Nav ──
  const nav = document.getElementById("nav");
  function onNavScroll() {
    nav.classList.toggle("nav--scrolled", window.scrollY > 60);
  }
  window.addEventListener("scroll", onNavScroll, { passive: true });
  onNavScroll();

  // ── Mobile Menu ──
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    links.classList.toggle("open");
    burger.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => { links.classList.remove("open"); burger.classList.remove("open"); })
  );
  document.addEventListener("click", (e) => {
    if (links.classList.contains("open") && !links.contains(e.target) && !burger.contains(e.target)) {
      links.classList.remove("open"); burger.classList.remove("open");
    }
  });

  // ── Reveal on Scroll ──
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const parent = entry.target.parentElement;
        if (parent && parent.classList.contains("reveal-stagger")) {
          const siblings = Array.from(parent.querySelectorAll(".reveal"));
          entry.target.style.transitionDelay = (0.05 + siblings.indexOf(entry.target) * 0.08) + "s";
        }
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal:not(.hero .reveal)").forEach((el) => revealObserver.observe(el));

  // ── Menu Tabs (desktop only) ──
  const tabs = document.querySelectorAll(".menu__tab");
  const panels = document.querySelectorAll(".menu__panel");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (window.innerWidth <= 768) return; // skip on mobile (flat list)
      const cat = tab.dataset.cat;
      tabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      panels.forEach((p) => {
        if (p.dataset.cat === cat) {
          p.classList.add("is-active");
          const dishes = p.querySelectorAll(".dish");
          dishes.forEach((d, i) => {
            d.style.opacity = "0";
            d.style.transform = "translateY(24px)";
            setTimeout(() => {
              d.style.transition = "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)";
              d.style.opacity = "1";
              d.style.transform = "translateY(0)";
            }, i * 80);
          });
        } else {
          p.classList.remove("is-active");
        }
      });
    });
  });

  // ── Language Toggle ──
  const langBtns = document.querySelectorAll(".lang-btn");
  function setLanguage(lang) {
    langBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.lang === lang));
    document.querySelectorAll("[data-en]").forEach((el) => {
      el.textContent = el.dataset[lang] || el.dataset.en;
    });
  }
  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  // ── Mobile Menu: Flat List Mode ──
  function setupMobileMenu() {
    const isMobile = window.innerWidth <= 768;
    const tabsContainer = document.getElementById("menuTabs");
    const panelsContainer = document.getElementById("menuPanels");
    if (!tabsContainer || !panelsContainer) return;

    const panels = panelsContainer.querySelectorAll(".menu__panel");
    const tabs = tabsContainer.querySelectorAll(".menu__tab");

    // Remove any existing cat headings
    panelsContainer.querySelectorAll(".menu__cat-heading").forEach(h => h.remove());

    if (isMobile) {
      // Show all panels with category headings
      panels.forEach((panel) => {
        panel.classList.add("is-active");
        panel.style.display = "block";
        // Find matching tab label
        const cat = panel.dataset.cat;
        const tab = tabsContainer.querySelector(`[data-cat="${cat}"]`);
        const label = tab ? (document.documentElement.lang === 'en' ? tab.dataset.en : tab.dataset.sv) : cat;
        // Insert heading before first dish
        const firstDish = panel.querySelector(".dish");
        if (firstDish) {
          const heading = document.createElement("div");
          heading.className = "menu__cat-heading";
          heading.textContent = label;
          panel.insertBefore(heading, firstDish);
        }
      });
    } else {
      // Desktop: tab mode
      let activeFound = false;
      panels.forEach((panel) => {
        if (!activeFound && panel.classList.contains("is-active")) {
          activeFound = true;
        } else {
          panel.classList.remove("is-active");
        }
      });
      if (!activeFound && panels.length) panels[0].classList.add("is-active");
    }
  }
  setupMobileMenu();
  window.addEventListener("resize", setupMobileMenu);

  // ── Smooth Scroll ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
      }
    });
  });

  // ── Parallax ──
  const parallaxElements = document.querySelectorAll("[data-parallax]");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxElements.forEach((el) => {
          el.style.transform = `translateY(${scrollY * parseFloat(el.dataset.parallax || 0.1)}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // ── 3D Tilt Cards ──
  const cards = document.querySelectorAll(".hero__card, .exp__card, .gallery__placeholder, .contact-btn");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  // ── Counter Animation ──
  function animateCounters() {
    document.querySelectorAll(".about__stat-num, .hero__card-meta .num").forEach((counter) => {
      if (counter.dataset.animated) return;
      const text = counter.textContent;
      const numMatch = text.match(/(\d+)/);
      if (!numMatch) return;
      const target = parseInt(numMatch[1], 10);
      const suffix = text.replace(numMatch[0], "").trim();
      const duration = 2000;
      const startTime = performance.now();
      counter.dataset.animated = "1";
      function update(t) {
        const progress = Math.min((t - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = text;
      }
      requestAnimationFrame(update);
    });
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCounters(); statsObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.3 });
  const statsSection = document.querySelector(".about__stats");
  if (statsSection) statsObserver.observe(statsSection);

  // ── Magnetic Buttons ──
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn--gold, .nav__cta, .nav__logo").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  }

  // ── Mobile Dish Accordion ──
  function isMobile() { return window.innerWidth <= 768; }

  document.querySelectorAll(".dish").forEach((dish) => {
    const header = dish.querySelector(".dish__header");
    const toggle = dish.querySelector(".dish__toggle");

    function handleToggle(e) {
      if (!isMobile()) return;
      e.stopPropagation();
      const wasOpen = dish.classList.contains("is-open");

      // Close all other dishes in same panel
      const panel = dish.closest(".menu__panel");
      if (panel) {
        panel.querySelectorAll(".dish.is-open").forEach((d) => {
          if (d !== dish) d.classList.remove("is-open");
        });
      }

      dish.classList.toggle("is-open");

      // Smooth scroll to opened dish
      if (!wasOpen) {
        setTimeout(() => {
          dish.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      }
    }

    if (header) {
      header.addEventListener("click", handleToggle);
    }
    if (toggle) {
      toggle.addEventListener("click", handleToggle);
    }
  });

  // ── Section Visibility ──
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("section-visible"); });
  }, { threshold: 0.05 });
  document.querySelectorAll("section").forEach((s) => sectionObserver.observe(s));
})();