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

  // Optional: send "Book a flight" to a booking page (Calendly, Google Form…).
  // Leave "" to use email instead.
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
  const mail = (subject, body = "") =>
    `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}` +
    (body ? `&body=${encodeURIComponent(body)}` : "");

  const links = {
    book: CONFIG.bookingUrl || (CONFIG.email ? mail("Booking a flight with Happy Drones",
      "Hi! I'd like to book a flight.\n\nWhat I need filmed:\nLocation:\nPreferred date:\n") : ""),
    text: CONFIG.phone ? `sms:${CONFIG.phone}` : "",
    youtube: CONFIG.youtube,
    tiktok: CONFIG.tiktok,
    facebook: CONFIG.facebook,
    x: CONFIG.x,
  };

  document.querySelectorAll("[data-link]").forEach((el) => {
    const href = links[el.dataset.link];
    if (href) el.href = href;
    else el.hidden = true;
  });

  if (CONFIG.bookingUrl) {
    const book = document.querySelector('[data-link="book"]');
    if (book) { book.target = "_blank"; book.rel = "noopener"; }
  }

  document.querySelectorAll("[data-ask]").forEach((el) => {
    if (!CONFIG.email) { el.hidden = true; return; }
    el.href = mail(`${el.dataset.ask} — Happy Drones`,
      `Hi! I'm interested in: ${el.dataset.ask}.\n\nLocation:\nPreferred date:\n`);
  });

  document.querySelectorAll("[data-field]").forEach((el) => {
    const value = CONFIG[el.dataset.field];
    if (value) el.textContent = value;
    else el.hidden = true;
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

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
