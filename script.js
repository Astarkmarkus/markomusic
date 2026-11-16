"use strict";

/**
 * MARKO release settings.
 *
 * Release day DOES NOT automatically publish streaming links.
 * After distribution is confirmed, set status to "out-now" and paste
 * the actual official streaming URLs below.
 *
 * To replace BELLA with a future release, update the release fields
 * and the corresponding approved page copy/visual assets.
 */
const RELEASE = Object.freeze({
  artist: "MARKO",
  title: "BELLA",
  releaseDate: "2026-11-30",
  dateShort: "30.11.2026",
  dateLong: "30 NOVEMBER 2026",
  status: "coming-soon", // "coming-soon" | "out-now"
  assets: {
    cover: "./assets/bella-cover.webp",
    portrait: "./assets/marko-portrait.webp",
    preview: "./assets/bella-preview.mp3"
  },
  streaming: {
    spotify: "",
    appleMusic: ""
  }
});

const $ = (id) => document.getElementById(id);

/** Updates repeated release labels from one configuration. */
function applyReleaseCopy() {
  const heroTitle = $("hero-title");
  if (heroTitle?.firstChild) heroTitle.firstChild.textContent = RELEASE.title;
  const heroDate = document.querySelector(".hero-release");
  if (heroDate) heroDate.textContent = RELEASE.dateShort;
  const headerDate = document.querySelector(".header-label");
  if (headerDate && headerDate.lastChild) headerDate.lastChild.textContent = " " + RELEASE.dateShort;
  const verticalDate = document.querySelector(".hero-vertical--right");
  if (verticalDate) verticalDate.textContent = RELEASE.dateShort;
  const bottomDate = document.querySelector(".hero-bottom span:last-child");
  if (bottomDate) bottomDate.textContent = RELEASE.dateShort;
  const fallbackDate = document.querySelector(".fallback-date");
  if (fallbackDate) fallbackDate.textContent = RELEASE.dateShort;
  const fallbackTitle = document.querySelector(".fallback-title");
  if (fallbackTitle) fallbackTitle.textContent = RELEASE.title;
  const releaseTitle = $("release-title");
  if (releaseTitle) releaseTitle.textContent = RELEASE.title;
  const dateLong = document.querySelector(".release-date-large");
  if (dateLong) dateLong.textContent = RELEASE.dateLong;
  const previewTitle = $("preview-title");
  if (previewTitle) previewTitle.innerHTML = "";
  if (previewTitle) {
    previewTitle.append(document.createTextNode(RELEASE.title + " "));
    const em = document.createElement("em");
    em.textContent = "—";
    previewTitle.append(em, document.createTextNode(" PREVIEW"));
  }
  const audioLabel = document.querySelector(".audio-line-one span:first-child");
  if (audioLabel) audioLabel.textContent = RELEASE.title;
  const heroStatus = $("hero-status");
  if (heroStatus) {
    heroStatus.replaceChildren(document.createTextNode(
      RELEASE.status === "out-now" ? "OUT NOW " : "COMING SOON "
    ));
    const spark = document.createElement("span");
    spark.className = "state-spark";
    spark.setAttribute("aria-hidden", "true");
    spark.textContent = "✳";
    heroStatus.append(spark);
  }
}

/** Never show broken images or unrelated stand-in portraits. */
function attachApprovedImage(src, parent, className, alt) {
  if (!parent || !src) return;
  const image = new Image();
  image.alt = alt;
  image.className = className;
  image.decoding = "async";
  image.onload = () => {
    if (image.naturalWidth === 0) return;
    parent.append(image);
    if (parent.id === "portrait-wrap") parent.hidden = false;
  };
  image.onerror = () => {};
  image.src = src;
}

/** Only provide clickable platform links once the artist confirms release. */
function populateStreamingLinks() {
  const host = $("streaming-links");
  if (!host || RELEASE.status !== "out-now") return;
  const services = [
    ["Spotify", RELEASE.streaming.spotify],
    ["Apple Music", RELEASE.streaming.appleMusic]
  ];
  for (const [label, rawUrl] of services) {
    if (!rawUrl) continue;
    let url;
    try { url = new URL(rawUrl); }
    catch { continue; }
    if (url.protocol !== "https:") continue;
    const link = document.createElement("a");
    link.className = "streaming-link";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    host.append(link);
  }
  host.hidden = host.children.length === 0;
}

/** Audio remains silent and controls hidden until a real MP3 is available. */
async function initAudio() {
  const audio = $("preview-audio");
  const play = $("play-button");
  const widget = $("audio-widget");
  const progress = $("audio-progress-fill");
  const current = $("audio-time");
  const duration = $("audio-duration");
  if (!audio || !play || !widget || !progress || !current || !duration) return;

  try {
    const result = await fetch(RELEASE.assets.preview, { method: "HEAD", cache: "no-store" });
    if (!result.ok) return;
    const contentType = result.headers.get("content-type") || "";
    // GitHub Pages should serve .mp3 as audio/mpeg; some proxies use octet-stream.
    if (contentType && !/audio\/|application\/octet-stream/i.test(contentType)) return;
  } catch {
    return;
  }

  audio.src = RELEASE.assets.preview;
  audio.preload = "metadata";
  play.hidden = false;

  const mmss = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
    const s = Math.floor(seconds);
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  };
  const sync = () => {
    const playing = !audio.paused && !audio.ended;
    widget.classList.toggle("is-playing", playing);
    play.classList.toggle("is-playing", playing);
    play.setAttribute("aria-pressed", String(playing));
    play.setAttribute("aria-label", playing ? "Pause BELLA preview" : "Play BELLA preview");
    current.textContent = mmss(audio.currentTime);
    duration.textContent = mmss(audio.duration);
    const width = Number.isFinite(audio.duration) && audio.duration > 0
      ? Math.min(100, (audio.currentTime / audio.duration) * 100) : 0;
    progress.style.width = width + "%";
  };
  play.addEventListener("click", async () => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try { await audio.play(); }
    catch { audio.pause(); sync(); }
  });
  for (const event of ["loadedmetadata","timeupdate","play","pause","ended"]) {
    audio.addEventListener(event, sync);
  }
  audio.addEventListener("error", () => {
    audio.pause();
    play.hidden = true;
    widget.classList.remove("is-playing");
  });
}

function init() {
  applyReleaseCopy();
  populateStreamingLinks();
  attachApprovedImage(
    RELEASE.assets.cover, $("cover-frame"), "cover-official",
    "Official cover artwork for BELLA by MARKO"
  );
  attachApprovedImage(
    RELEASE.assets.portrait, $("portrait-wrap"), "portrait-official",
    "Approved portrait of MARKO"
  );
  initAudio();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
