(function () {
  "use strict";

  // --- Header scroll effect ---
  const header = document.getElementById("siteHeader");
  if (header) {
    const onScroll = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile nav toggle ---
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primaryNav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__link").forEach((link) =>
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      })
    );
  }

  // --- Reveal on scroll (IntersectionObserver) ---
  const reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // --- Project filter ---
  const filterBtns = document.querySelectorAll(".filter-btn[data-filter]");
  const cards = document.querySelectorAll("#projectGrid > [data-status]");
  const emptyState = document.getElementById("emptyState");

  if (filterBtns.length && cards.length) {
    const applyFilter = (filter) => {
      let visible = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.status === filter;
        card.style.display = match ? "" : "none";
        if (match) visible++;
      });
      if (emptyState) emptyState.style.display = visible ? "none" : "block";
    };

    filterBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        applyFilter(btn.dataset.filter);
      })
    );

    // URL param support: ?status=devam
    const urlStatus = new URLSearchParams(window.location.search).get("status");
    if (urlStatus) {
      const target = document.querySelector(
        `.filter-btn[data-filter="${urlStatus}"]`
      );
      if (target) target.click();
    }
  }

  // --- Contact form success ---
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (form && success) {
    form.addEventListener("submit", function (e) {
      const action = form.getAttribute("action");
      if (!action || action.includes("YOUR_FORM_ID")) {
        e.preventDefault();
        alert("Formspree endpoint henüz ayarlanmamış. iletisim.html dosyasında action URL'sini güncelleyin.");
        return;
      }
      // Formspree handles redirect; for AJAX:
      e.preventDefault();
      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
        .then((res) => {
          if (res.ok) {
            form.style.display = "none";
            success.style.display = "block";
            form.reset();
          } else {
            alert("Gönderim sırasında bir hata oluştu. Lütfen tekrar deneyin.");
          }
        })
        .catch(() =>
          alert("Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.")
        );
    });
  }

  // --- Footer year ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
