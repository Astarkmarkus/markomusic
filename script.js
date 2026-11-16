"use strict";

/** Add verified artist links when available; nothing is advertised as clickable before that. */
const MARKO = Object.freeze({
  bella: {
    status: "coming-soon", // Manually change to "out-now" after distribution is confirmed
    releaseDate: "2026-11-30",
    preSaveUrl: "",
    preview: "./assets/bella-preview.mp3"
  },
  platforms: {
    spotify: "",
    appleMusic: "",
    soundcloud: ""
  }
});

const $ = (id) => document.getElementById(id);
const allowedUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : null;
  } catch { return null; }
};

function initPlatforms() {
  let linked = 0;
  for (const [service, value] of Object.entries(MARKO.platforms)) {
    const url = allowedUrl(value);
    const element = document.querySelector(`[data-service="${service}"]`);
    if (!url || !element) continue;
    const anchor = document.createElement("a");
    anchor.className = "platform is-linked";
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.setAttribute("aria-label", `${service === "appleMusic" ? "Apple Music" : service === "soundcloud" ? "SoundCloud" : "Spotify"} — MARKO`);
    anchor.innerHTML = element.innerHTML;
    element.replaceWith(anchor);
    linked++;
  }
  const label = document.querySelector(".platform-intro");
  if (label && linked > 0) {
    label.textContent = linked === 3 ? "LISTEN TO MARKO" : "MUSIC PLATFORMS · MORE LINKS COMING SOON";
  }
}

function initReleaseStatus() {
  const label = $("bella-status");
  const action = $("bella-audio-anchor");
  if (!label || !action) return;
  if (MARKO.bella.status === "out-now") {
    label.textContent = "OUT NOW";
    const link = allowedUrl(MARKO.platforms.spotify) || allowedUrl(MARKO.platforms.appleMusic) || allowedUrl(MARKO.platforms.soundcloud);
    if (link) {
      action.hidden = false;
      action.href = link;
      action.textContent = "LISTEN ↗";
      action.target = "_blank";
      action.rel = "noopener noreferrer";
    }
  } else {
    const presave = allowedUrl(MARKO.bella.preSaveUrl);
    if (presave) {
      action.hidden = false;
      action.href = presave;
      action.textContent = "PRE-SAVE ↗";
      action.target = "_blank";
      action.rel = "noopener noreferrer";
    }
  }
}

function initReveal() {
  const targets = document.querySelectorAll(".reveal-on-scroll");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: .12, rootMargin: "0px 0px 25px 0px" });
  targets.forEach(el => observer.observe(el));
}

async function initPreview() {
  const section = $("audio-preview");
  const audio = $("bella-audio");
  const toggle = $("audio-toggle");
  if (!section || !audio || !toggle) return;

  // Check for the artist's actual file. Never show a fake player or autoplay.
  try {
    const response = await fetch(MARKO.bella.preview, { method: "HEAD" });
    if (!response.ok) return;
    const type = response.headers.get("content-type") || "";
    if (type && !/audio\/|application\/octet-stream/i.test(type)) return;
  } catch { return; }

  audio.src = MARKO.bella.preview;
  section.hidden = false;
  const action = $("bella-audio-anchor");
  if (action && !MARKO.bella.preSaveUrl && MARKO.bella.status !== "out-now") {
    action.hidden = false;
    action.href = "#audio-preview";
    action.removeAttribute("target");
    action.removeAttribute("rel");
    action.textContent = "PREVIEW ↗";
  }

  const format = seconds => Number.isFinite(seconds) && seconds >= 0
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "0:00";
  const sync = () => {
    const isPlaying = !audio.paused && !audio.ended;
    toggle.classList.toggle("playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.setAttribute("aria-label", isPlaying ? "Pause BELLA preview" : "Play BELLA preview");
    $("audio-current").textContent = format(audio.currentTime);
    $("audio-total").textContent = format(audio.duration);
    $("audio-progress-bar").style.width = Number.isFinite(audio.duration) && audio.duration > 0 ? `${Math.min(100, audio.currentTime / audio.duration * 100)}%` : "0%";
  };
  toggle.addEventListener("click", async () => {
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); } catch { audio.pause(); }
  });
  for (const eventName of ["loadedmetadata", "timeupdate", "play", "pause", "ended"]) audio.addEventListener(eventName, sync);
  audio.addEventListener("error", () => { section.hidden = true; audio.pause(); });
}

/** Remove ChatGPT's referral tag from the visible URL without reloading the page. */
function cleanReferralUrl() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("utm_source") !== "chatgpt.com") return;
  url.searchParams.delete("utm_source");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}

function init() {
  cleanReferralUrl();
  initPlatforms();
  initReleaseStatus();
  initReveal();
  initPreview();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();