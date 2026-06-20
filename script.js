/**
 * HARUTO. — Portfolio Site Script
 * Uses GSAP + ScrollTrigger for animations
 */

"use strict";

/* ─────────────────────────────────────────────────────────────
   GSAP SETUP
───────────────────────────────────────────────────────────── */
const gsapReady = typeof gsap !== "undefined";

if (gsapReady && typeof ScrollTrigger !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────────────────────────────
   DOM READY
───────────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMobileNav();
  initHeroAnimation();
  initProblemCards();
  initScrollAnimations();
  initFAQ();
  initContactForm();
  initSmoothScroll();
});

/* ─────────────────────────────────────────────────────────────
   HEADER — scroll state
───────────────────────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ─────────────────────────────────────────────────────────────
   MOBILE NAV
───────────────────────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const drawer    = document.getElementById("mobile-drawer");
  const overlay   = document.getElementById("drawer-overlay");
  if (!hamburger || !drawer) return;

  const open = () => {
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay?.classList.add("is-visible");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay?.classList.remove("is-visible");
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    hamburger.classList.contains("is-open") ? close() : open();
  });

  overlay?.addEventListener("click", close);

  // Close on nav link click
  drawer.querySelectorAll(".mobile-nav-link").forEach(link => {
    link.addEventListener("click", close);
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) close();
  });
}

/* ─────────────────────────────────────────────────────────────
   PROBLEM CARDS — equal row heights
───────────────────────────────────────────────────────────── */
function initProblemCards() {
  const grid = document.querySelector(".problems-grid");
  if (!grid) return;

  const equalize = () => {
    const cards = [...grid.querySelectorAll(".problem-card")];
    if (!cards.length) return;

    cards.forEach((card) => card.style.removeProperty("height"));

    const rows = new Map();
    cards.forEach((card) => {
      const top = card.offsetTop;
      if (!rows.has(top)) rows.set(top, []);
      rows.get(top).push(card);
    });

    rows.forEach((rowCards) => {
      const maxH = Math.max(...rowCards.map((card) => card.getBoundingClientRect().height));
      rowCards.forEach((card) => {
        card.style.height = `${Math.ceil(maxH)}px`;
      });
    });
  };

  const schedule = () => requestAnimationFrame(equalize);

  schedule();
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("load", schedule);
  if (document.fonts) document.fonts.ready.then(schedule);
  setTimeout(schedule, 100);
  setTimeout(schedule, 400);
}

/* ─────────────────────────────────────────────────────────────
   HERO ANIMATION
   HEROはCSSアニメーション（@keyframes）で実装済み。
   GSAPのfrom()はfile://環境でCDN遅延時に要素を非表示にするため使用しない。
───────────────────────────────────────────────────────────── */
function initHeroAnimation() {
  /* no-op — hero uses CSS @keyframes (heroFadeUp / heroImgIn) */
}

/* ─────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS — GSAP ScrollTrigger
───────────────────────────────────────────────────────────── */
function initScrollAnimations() {
  if (!gsapReady) {
    // Fallback: IntersectionObserver
    initFallbackReveal();
    return;
  }

  // Generic fade-up helper
  const fadeUp = (targets, options = {}) => {
    const defaults = {
      y: 40,
      opacity: 0,
      duration: .7,
      stagger: .12,
      ease: "power3.out",
      scrollTrigger: {
        trigger: targets,
        start: "top 88%",
        once: true,
      }
    };
    gsap.from(targets, { ...defaults, ...options });
  };

  // Section titles
  document.querySelectorAll(".section-title, .section-sub").forEach(el => {
    gsap.from(el, {
      y: 28,
      opacity: 0,
      duration: .65,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 90%", once: true }
    });
  });

  // Problem cards
  gsap.from(".problem-card", {
    y: 40, opacity: 0, duration: .65, stagger: .1, ease: "power3.out",
    scrollTrigger: { trigger: ".problems-grid", start: "top 85%", once: true }
  });

  // Solution banner
  gsap.from(".solution-text", {
    x: -30, opacity: 0, duration: .7, ease: "power3.out",
    scrollTrigger: { trigger: ".solution-banner", start: "top 85%", once: true }
  });

  // Reason cards
  gsap.from(".reason-card", {
    y: 48, opacity: 0, duration: .7, stagger: .12, ease: "power3.out",
    scrollTrigger: { trigger: ".reasons-grid", start: "top 85%", once: true }
  });

  // Work cards
  gsap.from(".work-card", {
    y: 48, opacity: 0, duration: .65, stagger: .1, ease: "power3.out",
    scrollTrigger: { trigger: ".works-grid", start: "top 85%", once: true }
  });

  // Service cards
  gsap.from(".service-card", {
    y: 48, opacity: 0, duration: .7, stagger: .15, ease: "power3.out",
    scrollTrigger: { trigger: ".service-grid", start: "top 85%", once: true }
  });

  // Price cards
  gsap.from(".price-card", {
    y: 48, scale: .96, opacity: 0, duration: .7, stagger: .15, ease: "back.out(1.2)",
    scrollTrigger: { trigger: ".price-grid", start: "top 85%", once: true }
  });

  // Flow steps
  gsap.from(".flow-item", {
    y: 40, opacity: 0, duration: .65, stagger: .15, ease: "power3.out",
    scrollTrigger: { trigger: ".flow-list", start: "top 85%", once: true }
  });

  // Recommend cards
  gsap.from(".recommend-card", {
    y: 40, opacity: 0, duration: .65, stagger: .12, ease: "power3.out",
    scrollTrigger: { trigger: ".recommend-grid", start: "top 85%", once: true }
  });

  // FAQ items
  gsap.from(".faq-item", {
    y: 24, opacity: 0, duration: .55, stagger: .08, ease: "power3.out",
    scrollTrigger: { trigger: ".faq-list", start: "top 88%", once: true }
  });

  // Contact
  gsap.from(".contact-head", {
    x: -40, opacity: 0, duration: .8, ease: "power3.out",
    scrollTrigger: { trigger: ".contact-inner", start: "top 85%", once: true }
  });
  gsap.from(".contact-form", {
    x: 40, opacity: 0, duration: .8, ease: "power3.out",
    scrollTrigger: { trigger: ".contact-inner", start: "top 85%", once: true }
  });

}

/* ─────────────────────────────────────────────────────────────
   FALLBACK REVEAL (no GSAP)
───────────────────────────────────────────────────────────── */
function initFallbackReveal() {
  const revealTargets = document.querySelectorAll(
    ".problem-card, .reason-card, .work-card, .service-card, " +
    ".price-card, .flow-item, .recommend-card, .faq-item, " +
    ".section-title, .section-sub"
  );

  revealTargets.forEach(el => el.classList.add("js-reveal"));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });

  revealTargets.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll("[data-faq]").forEach(item => {
    const btn    = item.querySelector(".faq-btn");
    const answer = item.querySelector(".faq-answer");
    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Close all others
      document.querySelectorAll("[data-faq]").forEach(other => {
        if (other !== item) {
          other.querySelector(".faq-btn")?.setAttribute("aria-expanded", "false");
          other.querySelector(".faq-answer")?.classList.remove("is-open");
        }
      });

      // Toggle this one
      btn.setAttribute("aria-expanded", String(!isOpen));
      answer.classList.toggle("is-open", !isOpen);

      // GSAP height animation if available
      if (gsapReady && !isOpen) {
        const inner = answer.querySelector(".faq-answer-inner");
        gsap.from(inner, { y: -12, opacity: .3, duration: .35, ease: "power2.out" });
      }
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   CONTACT FORM
───────────────────────────────────────────────────────────── */
const CONTACT_TO_EMAIL = "sato.web4839@gmail.com";

function initContactForm() {
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");
  if (!form) return;

  const showFeedback = (message, type) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.classList.remove("is-success", "is-error");
    feedback.classList.add(type === "success" ? "is-success" : "is-error");
  };

  const hideFeedback = () => {
    if (!feedback) return;
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.classList.remove("is-success", "is-error");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideFeedback();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector(".btn-submit");
    const original = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = "送信中...";

    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      business_type: formData.get("business_type") || "未選択",
      message: formData.get("message") || "（未入力）",
      _replyto: formData.get("email"),
      _subject: "【HARUTO.】お問い合わせ",
      _template: "table",
      _captcha: "false",
      // FormSubmit AJAX requires the page URL when Referer is stripped (GitHub Pages, etc.)
      _url: window.location.href,
    };

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_TO_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || (data.success !== "true" && data.success !== true)) {
        throw new Error(data.message || "送信に失敗しました");
      }

      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        送信しました！ありがとうございます
      `;
      submitBtn.style.background = "#10B981";
      showFeedback("お問い合わせを送信しました。24時間以内にご返信いたします。", "success");

      if (gsapReady) {
        gsap.from(submitBtn, { scale: .95, duration: .3, ease: "back.out(2)" });
      }

      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        submitBtn.style.background = "";
        hideFeedback();
      }, 5000);
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
      const detail = err instanceof Error ? err.message : "";
      const message = detail && detail !== "送信に失敗しました"
        ? detail
        : "送信に失敗しました。時間をおいて再度お試しください。";
      showFeedback(message, "error");
    }
  });

  form.querySelectorAll(".form-input").forEach(input => {
    input.addEventListener("blur", () => {
      if (input.required && !input.value.trim()) {
        input.style.borderColor = "rgba(239,68,68,.8)";
      } else {
        input.style.borderColor = "";
      }
    });
    input.addEventListener("focus", () => {
      input.style.borderColor = "";
      hideFeedback();
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   SMOOTH SCROLL
───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
  const navH = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "72",
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ─────────────────────────────────────────────────────────────
   LAZY LOAD — add loading="lazy" to below-fold images
───────────────────────────────────────────────────────────── */
document.querySelectorAll("img:not([loading])").forEach(img => {
  img.setAttribute("loading", "lazy");
});
