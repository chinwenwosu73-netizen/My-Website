/* ============================================================
   Personal Website — shared interactions & motion
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Get-in-touch modal ---------- */
  var openBtn = document.getElementById("openModalBtn");
  var modal = document.getElementById("contactModal");
  var closeBtn = document.getElementById("modalClose");
  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (openBtn) openBtn.focus();
  }
  if (openBtn && modal) {
    openBtn.addEventListener("click", openModal);
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  /* ---------- Education gallery scroll arrows ---------- */
  var galleryWrap = document.querySelector(".edu-gallery-wrap");
  var galleryPrev = document.getElementById("galleryPrev");
  var galleryNext = document.getElementById("galleryNext");
  if (galleryWrap) {
    var eduGallery = galleryWrap.querySelector(".edu-gallery");

    function updateGalleryArrows() {
      if (!eduGallery) return;
      var maxScroll = eduGallery.scrollWidth - eduGallery.clientWidth;
      var canPrev = eduGallery.scrollLeft > 5;
      var canNext = eduGallery.scrollLeft < maxScroll - 5;
      if (galleryPrev) galleryPrev.style.display = canPrev ? "" : "none";
      if (galleryNext) galleryNext.style.display = canNext ? "" : "none";
    }

    if (galleryPrev) galleryPrev.addEventListener("click", function () {
      eduGallery.scrollBy({ left: -240, behavior: "smooth" });
    });
    if (galleryNext) galleryNext.addEventListener("click", function () {
      eduGallery.scrollBy({ left: 240, behavior: "smooth" });
    });
    eduGallery.addEventListener("scroll", updateGalleryArrows, { passive: true });
    window.addEventListener("resize", updateGalleryArrows);
    updateGalleryArrows();
  }

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Current year in footer ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Scroll reveal ---------- */
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal, .stagger");

  function initReveal() {
    revealEls.forEach(function (el) {
      if (el.dataset.done === "1") return;
      var rect = el.getBoundingClientRect();
      // Reveal when the element is in or above the viewport (handles fast scrolling)
      if (rect.top < window.innerHeight - 60) {
        el.classList.add("is-in");
        el.dataset.done = "1";
      }
    });
  }
  if (reduced) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); el.dataset.done = "1"; });
  } else {
    initReveal();
    var revealTimer;
    window.addEventListener("scroll", function () {
      clearTimeout(revealTimer);
      revealTimer = setTimeout(initReveal, 60);
    }, { passive: true });
    window.addEventListener("load", initReveal);
  }

  /* ---------- Hero headline underline draw-in ---------- */
  // Animation is driven by CSS (@keyframes draw-line); the delay makes the
  // stroke draw itself shortly after the hero fades in.

  /* ---------- Metrics count-up (motion graphics) ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    var dur = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = val.toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length) {
    if (reduced) {
      counters.forEach(animateCount);
    } else {
      var countersDone = false;
      function initCounters() {
        if (countersDone) return;
        var rect = counters[0].getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          countersDone = true;
          counters.forEach(animateCount);
        }
      }
      window.addEventListener("scroll", initCounters, { passive: true });
      window.addEventListener("load", initCounters);
      initCounters();
    }
  }
})();
