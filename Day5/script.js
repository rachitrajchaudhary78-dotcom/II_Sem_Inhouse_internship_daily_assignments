/* =========================================================
   PRAVAH 2026 — Vanilla JS Enhancements (Bootstrap 5)
   Features:
   - Loader hide (prevents stuck overlay)
   - Theme toggle (dark/light)
   - Scroll progress bar + back to top
   - Reveal on scroll animations
   - Typing animation (hero)
   - Countdown timer
   - Particles background (canvas)
   - Navbar active highlight + mobile collapse on click
   - Events search + category filter + quick-select into registration form
   - Stats counters animation
   - Gallery lightbox (modal + keyboard nav)
   - Registration form validation + LocalStorage + PRAVAH registration ID
   - Toast notifications
   - Hover tilt cards + subtle parallax
   - Lazy loading support (native + fallback)
   ========================================================= */

(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const STORE_KEY = "pravah_registrations_v1";
  const STORE_SEQ_KEY = "pravah_reg_seq_v1";
  const REG_PREFIX = "PRAVAH2026-";

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function pad4(n) {
    return String(n).padStart(4, "0");
  }

  function safeJsonParse(text, fallback) {
    try {
      return JSON.parse(text);
    } catch {
      return fallback;
    }
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim());
  }

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function calcAge(dobIso) {
    if (!dobIso) return NaN;
    const dob = new Date(dobIso);
    if (Number.isNaN(dob.getTime())) return NaN;
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
    return age;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function toast({ title, message, variant = "info", delay = 3500 } = {}) {
    const stack = $("#toastStack");
    if (!stack || !window.bootstrap) return;

    const iconMap = {
      success: "bi-check2-circle",
      danger: "bi-exclamation-triangle",
      warning: "bi-exclamation-circle",
      info: "bi-info-circle",
    };

    const safeTitle = title || (variant === "success" ? "Success" : "Update");
    const safeMsg = message || "";
    const icon = iconMap[variant] || iconMap.info;

    const wrapper = document.createElement("div");
    wrapper.className = "toast";
    wrapper.setAttribute("role", "status");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.setAttribute("aria-atomic", "true");
    wrapper.innerHTML = `
      <div class="toast-header">
        <i class="bi ${icon} me-2"></i>
        <strong class="me-auto">${safeTitle}</strong>
        <small class="text-white-50">now</small>
        <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body text-white-50">${safeMsg}</div>
    `;
    stack.appendChild(wrapper);

    const t = new bootstrap.Toast(wrapper, { delay });
    wrapper.addEventListener(
      "hidden.bs.toast",
      () => {
        wrapper.remove();
      },
      { once: true }
    );
    t.show();
  }

  function setTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("pravah_theme", t);

    const btn = $("#themeToggle");
    if (btn) {
      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = t === "light" ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
      }
      btn.setAttribute("aria-label", t === "light" ? "Switch to dark mode" : "Switch to light mode");
    }
  }

  function initLoader() {
    const loader = $("#pageLoader");
    if (!loader) return;

    // Ensure the loader is visible initially (in case of fast reloads)
    loader.classList.remove("is-hidden");

    const hide = () => {
      loader.classList.add("is-hidden");
      // Remove from accessibility tree after transition
      window.setTimeout(() => {
        loader.setAttribute("aria-hidden", "true");
      }, 450);
    };

    // Hide after full load; keep a safety timeout so it never gets stuck.
    window.addEventListener("load", hide, { once: true });
    window.setTimeout(hide, 2200);
  }

  function initScrollProgress() {
    const bar = $("#scrollProgressBar");
    if (!bar) return;

    const update = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const scrollHeight = doc.scrollHeight - doc.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = `${clamp(pct, 0, 100)}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initBackToTop() {
    const btn = $("#backToTop");
    if (!btn) return;
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  function initRipple() {
    const clickable = $$("a.btn, button.btn, .btn-filter");
    clickable.forEach((el) => {
      el.addEventListener("click", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement("span");
        ripple.className = "ripple-effect";
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;

        el.appendChild(ripple);
        ripple.addEventListener(
          "animationend",
          () => {
            ripple.remove();
          },
          { once: true }
        );
      });
    });
  }

  function initCursorGlow() {
    const glow = $("#cursorGlow");
    if (!glow) return;
    let raf = 0;

    const onMove = (e) => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
  }

  function initThemeToggle() {
    const saved = localStorage.getItem("pravah_theme");
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(saved || (prefersLight ? "light" : "dark"));

    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.body.getAttribute("data-theme") || "dark";
      setTheme(current === "light" ? "dark" : "light");
    });
  }

  function initYear() {
    const el = $("#yearNow");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initRevealOnScroll() {
    const items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion()) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { root: null, threshold: 0.12 }
    );

    items.forEach((el) => io.observe(el));
  }

  function initNavbarActiveAndCollapse() {
    const nav = $("#pravaNavbar");
    if (!nav) return;

    // Collapse mobile menu after clicking a link
    const collapseEl = $("#navbarContent");
    const bsCollapse = collapseEl && window.bootstrap ? bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false }) : null;
    $$("#navbarContent .nav-link").forEach((a) => {
      a.addEventListener("click", () => {
        if (bsCollapse && window.getComputedStyle(nav.querySelector(".navbar-toggler")).display !== "none") {
          bsCollapse.hide();
        }
      });
    });
  }

  function initTyping() {
    const el = $("#typingText");
    if (!el) return;
    const full = el.textContent.trim();
    if (!full) return;
    if (prefersReducedMotion()) return;

    el.textContent = "";
    let i = 0;
    const tick = () => {
      i += 1;
      el.textContent = full.slice(0, i);
      if (i < full.length) window.setTimeout(tick, 52);
    };
    window.setTimeout(tick, 260);
  }

  function initCountdown() {
    const dEl = $("#cdDays");
    const hEl = $("#cdHours");
    const mEl = $("#cdMinutes");
    const sEl = $("#cdSeconds");
    if (!dEl || !hEl || !mEl || !sEl) return;

    // Fest start target (local time): 10 July 2026.
    const target = new Date("2026-07-10T09:00:00");

    const fmt2 = (n) => String(n).padStart(2, "0");
    const update = () => {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / 86400);
      const hours = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      dEl.textContent = fmt2(days);
      hEl.textContent = fmt2(hours);
      mEl.textContent = fmt2(minutes);
      sEl.textContent = fmt2(seconds);
    };

    update();
    window.setInterval(update, 1000);
  }

  function initParticles() {
    const canvas = $("#particlesCanvas");
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.floor(rect.width);
      h = Math.floor(rect.height);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const count = Math.floor(clamp((w * h) / 18000, 42, 110));
    const particles = Array.from({ length: count }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 2.2,
      a: 0.25 + Math.random() * 0.35,
      hue: Math.random() < 0.5 ? 255 : 195, // blue/purple-ish
    }));

    const step = () => {
      ctx.clearRect(0, 0, w, h);

      // Soft gradient wash
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(108,99,255,0.06)");
      g.addColorStop(1, "rgba(0,229,255,0.04)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Move + draw
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 70%, ${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Connect close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 95) {
            const alpha = (1 - dist / 95) * 0.14;
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  }

  function initEventsSearchAndFilter() {
    const input = $("#eventSearch");
    const filters = $$(".btn-filter");
    const items = $$(".event-item");
    if (!items.length) return;

    let activeFilter = "all";
    let q = "";

    const apply = () => {
      const query = q.trim().toLowerCase();
      items.forEach((it) => {
        const cat = (it.getAttribute("data-category") || "").toLowerCase();
        const name = (it.getAttribute("data-name") || "").toLowerCase();
        const text = it.textContent.toLowerCase();
        const inCat = activeFilter === "all" || cat === activeFilter;
        const inQuery = !query || name.includes(query) || text.includes(query);
        it.classList.toggle("is-hidden", !(inCat && inQuery));
      });
    };

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        apply();
      });
    });

    if (input) {
      input.addEventListener("input", () => {
        q = input.value || "";
        apply();
      });
    }

    // Quick-select event into the registration form
    const select = $("#selectEvent");
    $$('[data-event]').forEach((a) => {
      a.addEventListener("click", () => {
        if (!select) return;
        const ev = a.getAttribute("data-event");
        if (!ev) return;
        select.value = ev;
        toast({ variant: "info", title: "Event selected", message: `Selected: <strong>${ev}</strong>. Complete the form to register.` });
      });
    });

    apply();
  }

  function initGalleryLightbox() {
    const buttons = $$("#galleryMasonry .masonry-item");
    if (!buttons.length || !window.bootstrap) return;

    const modalEl = $("#lightboxModal");
    const imgEl = $("#lightboxImage");
    const prevBtn = $("#lightboxPrev");
    const nextBtn = $("#lightboxNext");
    if (!modalEl || !imgEl || !prevBtn || !nextBtn) return;

    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const sources = buttons.map((b) => b.getAttribute("data-src")).filter(Boolean);
    let idx = 0;

    const showAt = (i) => {
      idx = (i + sources.length) % sources.length;
      imgEl.src = sources[idx];
    };

    buttons.forEach((b, i) => {
      b.addEventListener("click", () => {
        showAt(i);
        modal.show();
      });
    });
    prevBtn.addEventListener("click", () => showAt(idx - 1));
    nextBtn.addEventListener("click", () => showAt(idx + 1));

    const onKey = (e) => {
      if (!modalEl.classList.contains("show")) return;
      if (e.key === "ArrowLeft") showAt(idx - 1);
      if (e.key === "ArrowRight") showAt(idx + 1);
      if (e.key === "Escape") modal.hide();
    };
    window.addEventListener("keydown", onKey);

    // Clear src on hide (saves memory)
    modalEl.addEventListener(
      "hidden.bs.modal",
      () => {
        imgEl.removeAttribute("src");
      },
      { once: false }
    );
  }

  function initCounters() {
    const counters = $$(".counter");
    if (!counters.length) return;
    if (prefersReducedMotion()) return;

    const animate = (el) => {
      const target = Number(el.getAttribute("data-target") || "0");
      const start = 0;
      const duration = 900;
      const t0 = performance.now();

      const step = (t) => {
        const p = clamp((t - t0) / duration, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.round(start + (target - start) * eased);
        el.textContent = String(val);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animate(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 }
    );
    counters.forEach((c) => io.observe(c));
  }

  function initTiltCards() {
    const cards = $$(".tilt-card");
    if (!cards.length) return;
    if (prefersReducedMotion()) return;

    const maxRot = 8;
    cards.forEach((card) => {
      let rect = null;
      const onEnter = () => {
        rect = card.getBoundingClientRect();
      };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - y) * maxRot;
        const ry = (x - 0.5) * maxRot;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      };
      const onLeave = () => {
        rect = null;
        card.style.transform = "";
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });
  }

  function initParallax() {
    const img = $("#heroImage");
    if (!img) return;
    if (prefersReducedMotion()) return;

    const update = () => {
      const y = window.scrollY || 0;
      img.style.transform = `translateY(${Math.min(18, y * 0.02)}px)`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function loadRegistrations() {
    const raw = localStorage.getItem(STORE_KEY);
    const list = safeJsonParse(raw || "[]", []);
    return Array.isArray(list) ? list : [];
  }

  function saveRegistrations(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }

  function nextRegId() {
    const seq = Number(localStorage.getItem(STORE_SEQ_KEY) || "0") + 1;
    localStorage.setItem(STORE_SEQ_KEY, String(seq));
    return `${REG_PREFIX}${pad4(seq)}`;
  }

  function updateRegistrationCount() {
    const el = $("#registrationCount");
    if (!el) return;
    const count = loadRegistrations().length;
    el.textContent = String(count);
  }

  function setFieldValidity(input, ok, message) {
    if (!input) return;
    if (ok) {
      input.setCustomValidity("");
    } else {
      input.setCustomValidity(message || "Invalid");
    }
  }

  function initPasswordToggle() {
    const btn = $("#togglePassword");
    const pw = $("#password");
    if (!btn || !pw) return;
    btn.addEventListener("click", () => {
      const nowType = pw.getAttribute("type") === "password" ? "text" : "password";
      pw.setAttribute("type", nowType);
      const icon = btn.querySelector("i");
      if (icon) icon.className = nowType === "password" ? "bi bi-eye" : "bi bi-eye-slash";
    });
  }

  function initRegistrationForm() {
    const form = $("#registrationForm");
    if (!form || !window.bootstrap) return;

    const successModalEl = $("#successModal");
    const regIdEl = $("#generatedRegId");
    const successModal = successModalEl ? bootstrap.Modal.getOrCreateInstance(successModalEl) : null;

    const fields = {
      fullName: $("#fullName"),
      email: $("#email"),
      phone: $("#phone"),
      collegeName: $("#collegeName"),
      university: $("#university"),
      branch: $("#branch"),
      year: $("#year"),
      gender: $("#gender"),
      dob: $("#dob"),
      city: $("#city"),
      state: $("#state"),
      address: $("#address"),
      selectEvent: $("#selectEvent"),
      emergencyContact: $("#emergencyContact"),
      foodPreference: $("#foodPreference"),
      accommodation: $("#accommodation"),
      tshirtSize: $("#tshirtSize"),
      collegeIdUpload: $("#collegeIdUpload"),
      password: $("#password"),
      confirmPassword: $("#confirmPassword"),
      terms: $("#terms"),
    };

    const validate = () => {
      // Basic required handled by Bootstrap; add extra rules via setCustomValidity
      const emailOk = isEmail(fields.email?.value);
      setFieldValidity(fields.email, emailOk, "Please enter a valid email address.");

      const phoneOk = digitsOnly(fields.phone?.value).length === 10;
      setFieldValidity(fields.phone, phoneOk, "Enter a valid phone number (10 digits).");

      const emergencyOk = digitsOnly(fields.emergencyContact?.value).length === 10;
      setFieldValidity(fields.emergencyContact, emergencyOk, "Enter a valid emergency contact number (10 digits).");

      const age = calcAge(fields.dob?.value);
      const ageOk = Number.isFinite(age) && age >= 15;
      setFieldValidity(fields.dob, ageOk, "Minimum age is 15.");

      const pw = String(fields.password?.value || "");
      const strong =
        pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
      setFieldValidity(fields.password, strong, "Password must be stronger (8+ chars incl. upper/lower/number/symbol).");

      const match = pw && String(fields.confirmPassword?.value || "") === pw;
      setFieldValidity(fields.confirmPassword, match, "Passwords do not match.");

      // File required: rely on required; also ensure something is chosen.
      const fileOk = fields.collegeIdUpload && fields.collegeIdUpload.files && fields.collegeIdUpload.files.length > 0;
      setFieldValidity(fields.collegeIdUpload, Boolean(fileOk), "Please upload your college ID.");

      return form.checkValidity();
    };

    // Live validation
    form.addEventListener("input", () => validate());
    form.addEventListener("change", () => validate());

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const ok = validate();
      form.classList.add("was-validated");

      if (!ok) {
        toast({ variant: "danger", title: "Fix the errors", message: "Please review the highlighted fields and try again." });
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid && typeof firstInvalid.scrollIntoView === "function") {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const regId = nextRegId();
      const list = loadRegistrations();

      // Save file metadata only (do not store the file in LocalStorage)
      const file = fields.collegeIdUpload?.files?.[0];
      const fileMeta = file ? { name: file.name, type: file.type, size: file.size } : null;

      const payload = {
        regId,
        createdAt: new Date().toISOString(),
        fullName: fields.fullName?.value?.trim(),
        email: fields.email?.value?.trim(),
        phone: digitsOnly(fields.phone?.value),
        collegeName: fields.collegeName?.value?.trim(),
        university: fields.university?.value?.trim(),
        branch: fields.branch?.value?.trim(),
        year: fields.year?.value,
        gender: fields.gender?.value,
        dob: fields.dob?.value,
        city: fields.city?.value?.trim(),
        state: fields.state?.value?.trim(),
        address: fields.address?.value?.trim(),
        selectEvent: fields.selectEvent?.value,
        emergencyContact: digitsOnly(fields.emergencyContact?.value),
        foodPreference: fields.foodPreference?.value,
        accommodation: fields.accommodation?.value,
        tshirtSize: fields.tshirtSize?.value,
        collegeIdUpload: fileMeta,
      };

      list.push(payload);
      saveRegistrations(list);
      updateRegistrationCount();

      if (regIdEl) regIdEl.textContent = regId;
      toast({ variant: "success", title: "Registered", message: `Welcome to PRAVAH 2026. Your ID is <strong>${regId}</strong>.` });
      if (successModal) successModal.show();

      form.reset();
      form.classList.remove("was-validated");
    });

    // Reset button behavior
    const resetBtn = $("#resetFormBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        window.setTimeout(() => form.classList.remove("was-validated"), 0);
      });
    }

    // Demo fill + clear saved
    const fillDemoBtn = $("#fillDemoBtn");
    if (fillDemoBtn) {
      fillDemoBtn.addEventListener("click", () => {
        fields.fullName.value = "Rachit Kumar";
        fields.email.value = "rachit@example.com";
        fields.phone.value = "9876543210";
        fields.collegeName.value = "Your College Name";
        fields.university.value = "Your University";
        fields.branch.value = "Computer Science";
        fields.year.value = "3rd Year";
        fields.gender.value = "Prefer not to say";
        fields.dob.value = "2005-01-01";
        fields.city.value = "Your City";
        fields.state.value = "Your State";
        fields.address.value = "Campus Road, City, State";
        fields.selectEvent.value = "Hackathon";
        fields.emergencyContact.value = "9123456780";
        fields.foodPreference.value = "Veg";
        fields.accommodation.value = "No";
        fields.tshirtSize.value = "M";
        fields.password.value = "Pravah@2026";
        fields.confirmPassword.value = "Pravah@2026";
        fields.terms.checked = true;
        toast({ variant: "info", title: "Demo filled", message: "Demo data added. Please upload a College ID file to submit." });
        validate();
      });
    }

    const clearBtn = $("#clearRegistrationsBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        localStorage.removeItem(STORE_KEY);
        localStorage.removeItem(STORE_SEQ_KEY);
        updateRegistrationCount();
        toast({ variant: "warning", title: "Cleared", message: "Saved registrations cleared from this device." });
      });
    }

    initPasswordToggle();
    updateRegistrationCount();
  }

  function initNewsletter() {
    const form = $("#newsletterForm");
    const input = $("#newsletterEmail");
    if (!form || !input) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!isEmail(v)) {
        toast({ variant: "danger", title: "Invalid email", message: "Please enter a valid email to subscribe." });
        input.focus();
        return;
      }
      input.value = "";
      toast({ variant: "success", title: "Subscribed", message: "You’re on the PRAVAH newsletter list." });
    });
  }

  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const name = $("#contactName");
    const email = $("#contactEmail");
    const msg = $("#contactMessage");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.classList.add("was-validated");

      const ok = Boolean(name?.value.trim()) && isEmail(email?.value) && Boolean(msg?.value.trim());
      if (!ok) {
        toast({ variant: "danger", title: "Check details", message: "Please fill name, a valid email, and a message." });
        return;
      }

      form.reset();
      form.classList.remove("was-validated");
      toast({ variant: "success", title: "Message sent", message: "Thanks! Our team will get back to you soon." });
    });
  }

  function initLazyLoadingFallback() {
    // Native loading="lazy" exists on modern browsers; fallback only if needed.
    const imgs = $$("img[loading='lazy']");
    if (!imgs.length) return;
    if ("loading" in HTMLImageElement.prototype) return;
    if (!("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const img = e.target;
          const src = img.getAttribute("data-src");
          if (src) img.src = src;
          io.unobserve(img);
        });
      },
      { rootMargin: "200px 0px" }
    );

    imgs.forEach((img) => io.observe(img));
  }

  onReady(() => {
    initLoader();
    initThemeToggle();
    initYear();
    initScrollProgress();
    initBackToTop();
    initRipple();
    initCursorGlow();
    initRevealOnScroll();
    initNavbarActiveAndCollapse();
    initTyping();
    initCountdown();
    initParticles();
    initEventsSearchAndFilter();
    initGalleryLightbox();
    initCounters();
    initTiltCards();
    initParallax();
    initRegistrationForm();
    initNewsletter();
    initContactForm();
    initLazyLoadingFallback();
  });
})();

