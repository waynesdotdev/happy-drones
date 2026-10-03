/* =========================================================
   Happy Drones — EDIT YOUR SETTINGS HERE
   Everything on the page reads from this one block.
   Leave a link as "" (or null) to hide that button.
   ========================================================= */
const CONFIG = {
  // Background: "light" (white), "dark" (black), or "auto" (follows the visitor's phone setting)
  theme: "light",

  // Featured YouTube video. Paste a full link or just the video ID.
  // Works with youtube.com/watch?v=…, youtu.be/…, and /shorts/… links.
  // Set to null to hide the video section completely.
  video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  videoTitle: "Latest flight",

  email: "hello@happydrones.com",        // "Book a flight" and "Ask about…" go here
  phone: "+15555550123",                 // "Text me a question" (digits with country code)

  youtube:  "https://www.youtube.com/@happydrones",
  tiktok:   "https://www.tiktok.com/@happydrones",
  facebook: "https://www.facebook.com/happydrones",
  x:        "https://x.com/happydrones",

  // Where customers leave reviews (your Google Business or Facebook reviews link).
  reviewsUrl: "https://www.facebook.com/happydrones/reviews",

  // Optional: send "Book a flight" to a booking page (Calendly, etc.).
  // Leave "" to use the contact form on the page (or email if you deleted the form).
  bookingUrl: "",

  area: "Serving your city and nearby",             // e.g. "Serving Teesside and North Yorkshire"
  credentials: "Certified and insured drone pilot", // e.g. "CAA Flyer & Operator ID · Insured"
};

/* ---------- Theme ---------- */
(function applyTheme() {
  const root = document.documentElement;
  const pick = () => {
    const dark = CONFIG.theme === "dark" ||
      (CONFIG.theme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    root.dataset.theme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", dark ? "#000000" : "#003366");
  };
  pick();
  if (CONFIG.theme === "auto") {
    matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", pick);
  }
})();

/* ---------- Links ---------- */
(function applyLinks() {
  const form = document.querySelector("form.contact");
  const serviceSelect = document.getElementById("service-select");

  const mail = (subject, body = "") =>
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}` +
    (body ? `&body=${encodeURIComponent(body)}` : "");

  // "Book a flight": booking page → contact form on this page → email
  const bookHref = CONFIG.bookingUrl || (form ? "#contact" :
    (CONFIG.email ? mail("Booking a flight with Happy Drones",
      "Hi! I'd like to book a flight.\n\nWhat I need filmed:\nLocation:\nPreferred date:\n") : ""));

  const links = {
    book: bookHref,
    text: CONFIG.phone ? `sms:${CONFIG.phone}` : "",
    call: CONFIG.phone ? `tel:${CONFIG.phone}` : "",
    email: CONFIG.email ? `mailto:${CONFIG.email}` : "",
    youtube: CONFIG.youtube,
    tiktok: CONFIG.tiktok,
    facebook: CONFIG.facebook,
    x: CONFIG.x,
    reviews: CONFIG.reviewsUrl,
  };

  document.querySelectorAll("[data-link]").forEach((el) => {
    const href = links[el.dataset.link];
    if (href) el.href = href;
    else el.hidden = true;
  });

  // Footer: show the email address and phone number as text
  document.querySelectorAll("[data-show]").forEach((el) => {
    const value = CONFIG[el.dataset.show];
    if (value) el.textContent = value;
    else el.hidden = true;
  });

  if (CONFIG.bookingUrl) {
    const book = document.querySelector('[data-link="book"]');
    if (book) { book.target = "_blank"; book.rel = "noopener"; }
  }

  // "Ask about…" and package buttons: jump to the form and pre-pick the service,
  // or open an email if the form section was deleted.
  document.querySelectorAll("[data-ask]").forEach((el) => {
    const topic = el.dataset.ask;
    if (form) {
      el.href = "#contact";
      el.addEventListener("click", () => {
        if (!serviceSelect) return;
        const match = [...serviceSelect.options].find((o) => o.text === topic);
        serviceSelect.value = match ? match.value : "Something else";
      });
    } else if (CONFIG.email) {
      el.href = mail(`${topic} — Happy Drones`,
        `Hi! I'm interested in: ${topic}.\n\nLocation:\nPreferred date:\n`);
    } else {
      el.hidden = true;
    }
  });

  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = CONFIG[el.dataset.field];
    if (value) el.textContent = value;
    else el.hidden = true;
  });

  document.querySelectorAll(".year, #year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Don't let people pick a date in the past
  const date = document.getElementById("date-input");
  if (date) date.min = new Date().toISOString().split("T")[0];
})();

/* ---------- Photos you haven't added yet show a placeholder ---------- */
const PILOT_PLACEHOLDER = "data:image/svg+xml," + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#003366"/>' +
  '<circle cx="48" cy="38" r="17" fill="#FF6B35"/><path d="M16 92c3-20 16-30 32-30s29 10 32 30z" fill="#FF6B35"/></svg>');

document.querySelectorAll(".work img, .pilot").forEach((img) => {
  const mark = () => {
    if (img.classList.contains("pilot")) {
      if (img.src !== PILOT_PLACEHOLDER) img.src = PILOT_PLACEHOLDER;
      return;
    }
    img.closest(".work").classList.add("missing");
  };
  if (img.complete && img.naturalWidth === 0) mark();
  else img.addEventListener("error", mark);
});

/* ---------- YouTube video ----------
   Shows a thumbnail first and only loads the YouTube player when tapped,
   so the page stays fast on phones. */
function getYouTubeId(input) {
  if (!input) return null;
  const value = String(input).trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1, 12) || null;
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const match = url.pathname.match(/\/(shorts|embed|live)\/([\w-]{11})/);
    return match ? match[2] : null;
  } catch (_) {
    return null;
  }
}

(function setupVideo() {
  const section = document.getElementById("video");
  const id = getYouTubeId(CONFIG.video);
  if (!section || !id) return; // stays hidden

  section.hidden = false;
  const title = section.querySelector("h2");
  if (title && CONFIG.videoTitle) title.textContent = CONFIG.videoTitle;

  const button = section.querySelector(".video");
  const thumb = section.querySelector(".video-thumb");
  thumb.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  button.addEventListener("click", () => {
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
    frame.title = CONFIG.videoTitle || "Happy Drones video";
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    button.replaceChildren(frame);
    button.removeAttribute("aria-label");
  }, { once: true });
})();

/* ---------- Toast ---------- */
const toastEl = document.querySelector(".toast");
let toastTimer;
function toast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

/* ---------- Share ---------- */
document.querySelector(".share")?.addEventListener("click", async () => {
  const data = { title: "Happy Drones", text: "Aerial photo, video and FPV fly-throughs", url: location.href };
  if (navigator.share) {
    try { await navigator.share(data); } catch (_) { /* sheet closed */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(location.href);
    toast("Link copied");
  } catch (_) {
    toast("Copy the address bar to share");
  }
});

/* ---------- Services: one open at a time ---------- */
const services = document.querySelectorAll(".service");
services.forEach((d) => {
  d.addEventListener("toggle", () => {
    if (d.open) services.forEach((o) => { if (o !== d) o.open = false; });
  });
});
