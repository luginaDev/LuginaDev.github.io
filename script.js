/* =========================================================
   Muhamad Lugina Nurhuda — Portfolio
   Vanilla JS · no dependencies
   ========================================================= */

/* ---------- Contact links ----------
   Fill these in. Any link left empty is shown as disabled. */
const CONTACT = {
  email: "muhamadluginanurhuda@gmail.com",
  linkedin: "https://www.linkedin.com/in/lugina-nurhuda",
  github: "https://github.com/luginaDev",
};

/* ---------- Project case studies (modal content) ---------- */
const PROJECTS = {
  promdi: {
    kicker: "Project 01 · Manufacturing Digital Platform",
    title: "PROMDI — Manufacturing Digital Platform",
    summary:
      "A digital platform — not a single web application — that connects and digitizes processes across Engineering, Planning, Warehouse, Manufacturing, Quality, and Finished Goods.",
    problem:
      "Processes across departments were handled separately, making it hard to follow a product's engineering, production, and finished-goods information end to end.",
    solution: [
      "Part Number Database & Tool Database",
      "NPI Dashboard",
      "WIP Aging & Production Tracking",
      "RTPR / Hourly Production",
      "RFID Finished Goods & AutoGR",
      "Engineering information & manufacturing data in one place",
    ],
    tech: ["ASP.NET Core", "C#", "SQL Server", "Dapper", "JavaScript / jQuery", "REST API"],
    flow: ["Engineering", "Part Number / Documents", "Planning", "Warehouse", "Manufacturing", "Quality", "Finished Goods"],
    impact: "90K+ platform accesses in 2025 — used across departments as a shared manufacturing platform.",
  },
  visibility: {
    kicker: "Project 02 · Production",
    title: "Real-time Production Visibility & Problem Resolution",
    summary:
      "Digitalizing the production reporting workflow so problems become visible — and get resolved — while the shift is still running.",
    problem:
      "Production information was handled through manual files, printed hourly RTPR sheets, handwritten information, and manual reporting.",
    solution: [
      "Digital RTPR",
      "Digital Andon / turnback",
      "Production tracking & shopfloor reporting",
      "Skill-matrix poka-yoke",
      "RFID exploration",
      "MWO integration",
    ],
    techLabel: "Methodology",
    tech: ["DMAIC", "Kaizen", "Continuous Improvement"],
    flow: ["Process", "Problem", "Digital Solution", "Visibility"],
    impact: "Target: 0% entry / transcription errors by removing manual re-entry from the reporting flow.",
  },
  engineering: {
    kicker: "Project 03 · Engineering",
    title: "Engineering Digitalization",
    summary:
      "Creating a connected engineering information flow rather than a collection of isolated applications.",
    problem:
      "Engineering processes were manual, and engineering information lived in separate places — disconnected from the teams downstream that rely on it.",
    solution: [
      "Engineering Documents",
      "Part Number & Tool Database",
      "PFMEA",
      "Drawing / PFD Database",
      "NPI",
      "BOM & Routing",
    ],
    tech: ["C#", "ASP.NET MVC / Core", "SQL Server"],
    flow: ["Engineering Documents", "Part Number", "Tool Database", "PFMEA", "Drawing / PFD", "NPI", "BOM", "Routing"],
    impact: "Goal: one connected engineering information flow that Planning, Warehouse, and Manufacturing can build on.",
  },
  rfid: {
    kicker: "Project 04 · RFID / Finished Goods",
    title: "RFID — Connecting Physical Goods to Digital Systems",
    summary:
      "Linking what physically happens to finished goods with what the system knows about them.",
    problem:
      "Physical manufacturing information — which product it is and where it is — does not reach digital systems on its own, so finding goods relied on manual search.",
    solution: [
      "RFID tagging for identification",
      "Automatic data capture",
      "Integration into the manufacturing system",
      "Visibility of finished goods in the warehouse",
    ],
    tech: ["RFID", "System Integration", "PROMDI · RFID Finished Goods"],
    flow: ["RFID", "Identification", "Data Capture", "System", "Visibility"],
    impact: "Warehouse search time reduced from 15 to 3 minutes in the RFID pilot.",
  },
};

/* ========================================================= */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

document.documentElement.classList.add("js");

/* ---------- Navigation: solidify on scroll, mobile menu, active link ---------- */
function initNav() {
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $$(".nav__link");

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  $$("#navMenu a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) setOpen(false);
  });
  window.matchMedia("(min-width: 961px)").addEventListener("change", (e) => e.matches && setOpen(false));

  // Active section indicator. Sections without a nav entry map to the closest one.
  const alias = { approach: "projects", education: "impact" };
  const setActive = (id) => {
    const target = `#${alias[id] || id}`;
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === target));
  };

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("section[id]").forEach((s) => observer.observe(s));
}

/* ---------- Scroll reveal ---------- */
function initReveal() {
  const items = $$(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  // Small stagger for siblings revealed together
  items.forEach((el) => {
    const siblings = $$(":scope > .reveal", el.parentElement);
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = `${Math.min(index, 6) * 60}ms`;
    observer.observe(el);
  });
}

/* ---------- Hero dashboard ---------- */
function initConsole() {
  const barsEl = $("#heroBars");
  const clock = $("#consoleClock");
  const andon = $("#andonText");
  const TARGET = 72; // plan line height, in % — matches .bars__target
  const HOURS = 12;

  // Illustrative values only
  const values = [64, 70, 75, 58, 73, 78, 74, 69, 76, 60, 71, 38];
  const bars = values.map((v, i) => {
    const bar = document.createElement("div");
    bar.className = "bars__bar";
    bar.style.height = `${v}%`;
    if (v < TARGET - 6 && i !== HOURS - 1) bar.classList.add("is-under");
    barsEl.appendChild(bar);
    return bar;
  });
  bars[HOURS - 1].classList.add("is-current");

  const tickClock = () => {
    clock.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });
  };
  tickClock();

  if (prefersReducedMotion) return;

  // Update only while the hero is on screen
  let timer = null;
  let current = values[HOURS - 1];
  let tick = 0;

  const step = () => {
    tickClock();
    tick++;
    if (tick % 2) return;

    // current hour fills up, then rolls over
    current += 4 + Math.random() * 6;
    if (current > 80) {
      bars.forEach((bar, i) => {
        const next = bars[i + 1];
        if (next) {
          bar.style.height = next.style.height;
          bar.classList.toggle("is-under", parseFloat(next.style.height) < TARGET - 6);
        }
      });
      current = 12;
    }
    bars[HOURS - 1].style.height = `${current}%`;

    const states = ["Line running", "Line running", "Line running", "Call · resolved"];
    andon.textContent = states[Math.floor(Math.random() * states.length)];
  };

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !timer) timer = setInterval(step, 1000);
    else if (!entry.isIntersecting && timer) {
      clearInterval(timer);
      timer = null;
    }
  });
  observer.observe($(".console"));
}

/* ---------- Journey timeline ---------- */
function initJourney() {
  const tabs = $$(".journey__tab");
  const panels = $$(".stage");
  const progress = $("#journeyProgress");
  const count = $("#journeyCount");
  let active = 0;

  const select = (index, focus = false) => {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const on = i === active;
      tab.classList.toggle("is-active", on);
      tab.classList.toggle("is-done", i < active);
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    progress.style.height = `${(active / (tabs.length - 1)) * 100}%`;
    count.textContent = `${String(active + 1).padStart(2, "0")} / ${String(tabs.length).padStart(2, "0")}`;

    const tab = tabs[active];
    if (focus) tab.focus();
    // keep the active chip visible in the horizontal mobile rail
    const rail = tab.parentElement;
    if (rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: tab.offsetLeft - 16, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i));
    tab.addEventListener("keydown", (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        select(active + keys[e.key], true);
      } else if (e.key === "Home") {
        e.preventDefault();
        select(0, true);
      } else if (e.key === "End") {
        e.preventDefault();
        select(tabs.length - 1, true);
      }
    });
  });

  $("#journeyPrev").addEventListener("click", () => select(active - 1));
  $("#journeyNext").addEventListener("click", () => select(active + 1));
  select(0);
}

/* ---------- Project filtering ---------- */
function initFilters() {
  const buttons = $$(".filter");
  const cards = $$(".project");
  const empty = $("#projectsEmpty");

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      buttons.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });

      let shown = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.tags.split(" ").includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) {
          shown++;
          card.classList.add("is-visible");
          if (!prefersReducedMotion) {
            card.animate(
              [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
              { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" }
            );
          }
        }
      });
      empty.hidden = shown > 0;
    });
  });
}

/* ---------- Project visuals: sequential highlight on hover ---------- */
function initProjectVisuals() {
  const sequence = (items, root) => {
    let timer = null;
    const start = () => {
      if (prefersReducedMotion || timer) return;
      let i = 0;
      timer = setInterval(() => {
        items.forEach((el, n) => el.classList.toggle("is-lit", n === i));
        i = (i + 1) % (items.length + 1);
      }, 380);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
      items.forEach((el) => el.classList.remove("is-lit"));
    };
    root.addEventListener("mouseenter", start);
    root.addEventListener("mouseleave", stop);
  };

  $$(".project").forEach((card) => {
    const arch = $$(".arch li", card);
    const pipe = $$(".pipeline li:not(.is-hot)", card);
    if (arch.length) sequence(arch, card);
    if (pipe.length) sequence(pipe, card);
  });
}

/* ---------- Project modal ---------- */
function initModal() {
  const modal = $("#projectModal");
  const grid = $("#modalGrid");
  let lastTrigger = null;

  const escape = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const list = (items) => `<ul>${items.map((i) => `<li>${escape(i)}</li>`).join("")}</ul>`;

  const open = (key, trigger) => {
    const p = PROJECTS[key];
    if (!p) return;
    lastTrigger = trigger;

    $("#modalKicker").textContent = p.kicker;
    $("#modalTitle").textContent = p.title;
    $("#modalSummary").textContent = p.summary;

    grid.innerHTML = `
      <div class="case case--flow">
        <p class="case__label mono">Flow</p>
        <div class="case__flow">${p.flow.map((f) => `<span>${escape(f)}</span>`).join("<i>→</i>")}</div>
      </div>
      <div class="case">
        <p class="case__label mono"><b>01</b> Problem</p>
        <p>${escape(p.problem)}</p>
      </div>
      <div class="case">
        <p class="case__label mono"><b>02</b> Solution</p>
        ${list(p.solution)}
      </div>
      <div class="case case--flow">
        <p class="case__label mono"><b>03</b> ${escape(p.techLabel || "Technology")}</p>
        <ul class="chips chips--tech">${p.tech.map((t) => `<li>${escape(t)}</li>`).join("")}</ul>
      </div>
      <div class="case case--impact">
        <p class="case__label mono"><b>04</b> Impact</p>
        <p>${escape(p.impact)}</p>
      </div>`;

    if (typeof modal.showModal === "function") modal.showModal();
    else modal.setAttribute("open", "");
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    if (typeof modal.close === "function") modal.close();
    else modal.removeAttribute("open");
  };

  modal.addEventListener("close", () => {
    document.body.style.overflow = "";
    if (lastTrigger) lastTrigger.focus();
  });

  $$("[data-open]").forEach((btn) => btn.addEventListener("click", () => open(btn.dataset.open, btn)));
  $("#modalClose").addEventListener("click", close);
  // click on backdrop closes
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
}

/* ---------- Process: steps light up in sequence ---------- */
function initProcess() {
  const process = $("#process");
  const steps = $$(".process__step", process);

  const lightAll = () => {
    steps.forEach((s) => s.classList.add("is-on"));
    process.style.setProperty("--progress", 1);
  };

  if (prefersReducedMotion) return lightAll();

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      steps.forEach((step, i) => {
        setTimeout(() => {
          step.classList.add("is-on");
          process.style.setProperty("--progress", i / (steps.length - 1));
        }, 250 + i * 260);
      });
    },
    { threshold: 0.35 }
  );
  observer.observe(process);
}

/* ---------- Animated counters ---------- */
function initCounters() {
  // Final values are in the HTML, so the page reads correctly without JS
  // or with reduced motion. Otherwise rewind to the start value and count up.
  if (prefersReducedMotion || !("IntersectionObserver" in window)) return;
  $$("[data-count]").forEach((el) => (el.textContent = el.dataset.from || 0));

  const run = (el) => {
    const to = Number(el.dataset.count);
    const from = Number(el.dataset.from || 0);
    const duration = 1300;
    const t0 = performance.now();
    const frame = (now) => {
      const t = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$("[data-count]", entry.target).forEach(run);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );
  $$(".metric").forEach((m) => observer.observe(m));
}

/* ---------- Contact links ---------- */
function initContact() {
  $$("[data-link]").forEach((a) => {
    const key = a.dataset.link;
    const value = CONTACT[key];
    if (!value) {
      a.classList.add("is-disabled");
      a.removeAttribute("href");
      a.setAttribute("aria-disabled", "true");
      return;
    }
    a.href = key === "email" ? `mailto:${value}` : value;
  });
  const emailLabel = $('[data-link-label="email"]');
  if (emailLabel && CONTACT.email) emailLabel.textContent = CONTACT.email;
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  initNav();
  initReveal();
  initConsole();
  initJourney();
  initFilters();
  initProjectVisuals();
  initModal();
  initProcess();
  initCounters();
  initContact();
});
