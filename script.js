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


// Interface translations. Artist and release names remain unchanged.
const I18N = Object.freeze({
  en: {
    skip:"Skip to content",backToTop:"MARKO — Back to top",mainNav:"Main navigation",navReleases:"RELEASES",
    instagramLabel:"MARKO on Instagram",languageLabel:"Choose website language",
    officialWebsite:"THE OFFICIAL WEBSITE",exploreMusic:"EXPLORE MUSIC",scrollDiscover:"SCROLL TO DISCOVER ↓",
    platformIntro:"MUSIC PLATFORMS · LINKS COMING SOON",platformAll:"LISTEN TO MARKO",platformPartial:"MUSIC PLATFORMS · MORE LINKS COMING SOON",
    spotifySoon:"Spotify — coming soon",appleMusicSoon:"Apple Music — coming soon",soundcloudSoon:"SoundCloud — coming soon",
    spotifyLink:"Spotify — MARKO",appleMusicLink:"Apple Music — MARKO",soundcloudLink:"SoundCloud — MARKO",
    music:"MUSIC",latest:"LATEST",releases:"RELEASES",discography:"MARKO / DISCOGRAPHY",
    cardSingle:"01 / SINGLE",newSingle:"NEW SINGLE",comingSoon:"COMING SOON",previewArrow:"PREVIEW ↗",
    cardEp:"02 / EP",upcomingEp:"UPCOMING EP",epDate:"RELEASE DATE: TBD",inMaking:"IN THE MAKING",noArtwork:"NO ARTWORK YET",
    listenFirst:"LISTEN FIRST",preview:"PREVIEW",contact:"CONTACT",emailMarko:"Email MARKO at hello@markomusic.art",
    outNow:"OUT NOW",listenArrow:"LISTEN ↗",preSaveArrow:"PRE-SAVE ↗",
    playBella:"Play BELLA preview",pauseBella:"Pause BELLA preview"
  },
  es: {
    skip:"Ir al contenido",backToTop:"MARKO — Volver arriba",mainNav:"Navegación principal",navReleases:"LANZAMIENTOS",
    instagramLabel:"MARKO en Instagram",languageLabel:"Elegir idioma del sitio web",
    officialWebsite:"WEB OFICIAL",exploreMusic:"DESCUBRE LA MÚSICA",scrollDiscover:"BAJA PARA DESCUBRIR ↓",
    platformIntro:"PLATAFORMAS · ENLACES PRÓXIMAMENTE",platformAll:"ESCUCHA A MARKO",platformPartial:"PLATAFORMAS · MÁS ENLACES PRÓXIMAMENTE",
    spotifySoon:"Spotify — próximamente",appleMusicSoon:"Apple Music — próximamente",soundcloudSoon:"SoundCloud — próximamente",
    spotifyLink:"Spotify — MARKO",appleMusicLink:"Apple Music — MARKO",soundcloudLink:"SoundCloud — MARKO",
    music:"MÚSICA",latest:"ÚLTIMOS",releases:"LANZAMIENTOS",discography:"MARKO / DISCOGRAFÍA",
    cardSingle:"01 / SENCILLO",newSingle:"NUEVO SENCILLO",comingSoon:"MUY PRONTO",previewArrow:"ADELANTO ↗",
    cardEp:"02 / EP",upcomingEp:"PRÓXIMO EP",epDate:"FECHA: POR CONFIRMAR",inMaking:"EN PREPARACIÓN",noArtwork:"PORTADA POR REVELAR",
    listenFirst:"ESCUCHA UN ADELANTO",preview:"ADELANTO",contact:"CONTACTO",emailMarko:"Enviar un correo a MARKO: hello@markomusic.art",
    outNow:"YA DISPONIBLE",listenArrow:"ESCUCHAR ↗",preSaveArrow:"PRE-GUARDAR ↗",
    playBella:"Reproducir adelanto de BELLA",pauseBella:"Pausar adelanto de BELLA"
  },
  ca: {
    skip:"Ves al contingut",backToTop:"MARKO — Torna a dalt",mainNav:"Navegació principal",navReleases:"LLANÇAMENTS",
    instagramLabel:"MARKO a Instagram",languageLabel:"Tria l'idioma del web",
    officialWebsite:"WEB OFICIAL",exploreMusic:"DESCOBREIX LA MÚSICA",scrollDiscover:"DESPLAÇA'T PER DESCOBRIR ↓",
    platformIntro:"PLATAFORMES · ENLLAÇOS AVIAT",platformAll:"ESCOLTA MARKO",platformPartial:"PLATAFORMES · MÉS ENLLAÇOS AVIAT",
    spotifySoon:"Spotify — pròximament",appleMusicSoon:"Apple Music — pròximament",soundcloudSoon:"SoundCloud — pròximament",
    spotifyLink:"Spotify — MARKO",appleMusicLink:"Apple Music — MARKO",soundcloudLink:"SoundCloud — MARKO",
    music:"MÚSICA",latest:"ÚLTIMS",releases:"LLANÇAMENTS",discography:"MARKO / DISCOGRAFIA",
    cardSingle:"01 / SENZILL",newSingle:"NOU SENZILL",comingSoon:"AVIAT",previewArrow:"AVANÇAMENT ↗",
    cardEp:"02 / EP",upcomingEp:"PRÒXIM EP",epDate:"DATA: PER CONFIRMAR",inMaking:"EN PREPARACIÓ",noArtwork:"PORTADA ENCARA NO DISPONIBLE",
    listenFirst:"ESCOLTA'N UN AVANÇAMENT",preview:"AVANÇAMENT",contact:"CONTACTE",emailMarko:"Envia un correu a MARKO: hello@markomusic.art",
    outNow:"JA DISPONIBLE",listenArrow:"ESCOLTA ↗",preSaveArrow:"DESA ANTICIPADAMENT ↗",
    playBella:"Reprodueix l'avançament de BELLA",pauseBella:"Pausa l'avançament de BELLA"
  }
});

let activeLanguage = "en";
const translate = key => I18N[activeLanguage][key] || I18N.en[key] || key;

function applyLanguage(code = activeLanguage) {
  if (!Object.hasOwn(I18N, code)) code = "en";
  activeLanguage = code;
  document.documentElement.lang = code;

  const platformText = document.querySelector(".platform-intro");
  if (platformText) {
    const count = Number(platformText.dataset.connectedPlatforms || 0);
    platformText.dataset.i18n = count === 3 ? "platformAll" : count > 0 ? "platformPartial" : "platformIntro";
  }
  const toggle = document.getElementById("audio-toggle");
  const audio = document.getElementById("bella-audio");
  if (toggle && audio) toggle.dataset.i18nAriaLabel = !audio.paused && !audio.ended ? "pauseBella" : "playBella";

  document.querySelectorAll("[data-i18n]").forEach(element => {
    element.textContent = translate(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach(element => {
    element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll(".language-choice").forEach(button => {
    const selected = button.dataset.lang === code;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

function initLanguage() {
  let saved = null;
  try { saved = window.localStorage.getItem("marko-language"); } catch {}
  const browser = (navigator.languages || [navigator.language || "en"])
    .map(language => String(language).toLowerCase().split("-")[0])
    .find(language => language === "ca" || language === "es");
  applyLanguage(saved && Object.hasOwn(I18N,saved) ? saved : (browser || "en"));

  document.querySelectorAll(".language-choice").forEach(button => {
    button.addEventListener("click", () => {
      const code = button.dataset.lang;
      if (!Object.hasOwn(I18N,code)) return;
      try { window.localStorage.setItem("marko-language",code); } catch {}
      applyLanguage(code);
    });
  });
}

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
    anchor.dataset.i18nAriaLabel = service + "Link";
    anchor.setAttribute("aria-label", translate(anchor.dataset.i18nAriaLabel));
    anchor.innerHTML = element.innerHTML;
    element.replaceWith(anchor);
    linked++;
  }
  const label = document.querySelector(".platform-intro");
  if (label) label.dataset.connectedPlatforms = String(linked);
  applyLanguage();
}

function initReleaseStatus() {
  const label = $("bella-status");
  const action = $("bella-audio-anchor");
  if (!label || !action) return;
  if (MARKO.bella.status === "out-now") {
    label.dataset.i18n = "outNow";
    const link = allowedUrl(MARKO.platforms.spotify) || allowedUrl(MARKO.platforms.appleMusic) || allowedUrl(MARKO.platforms.soundcloud);
    if (link) {
      action.hidden = false;
      action.href = link;
      action.dataset.i18n = "listenArrow";
      action.target = "_blank";
      action.rel = "noopener noreferrer";
    }
  } else {
    const presave = allowedUrl(MARKO.bella.preSaveUrl);
    if (presave) {
      action.hidden = false;
      action.href = presave;
      action.dataset.i18n = "preSaveArrow";
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
    action.dataset.i18n = "previewArrow";
    applyLanguage();
  }

  const format = seconds => Number.isFinite(seconds) && seconds >= 0
    ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "0:00";
  const sync = () => {
    const isPlaying = !audio.paused && !audio.ended;
    toggle.classList.toggle("playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    toggle.dataset.i18nAriaLabel = isPlaying ? "pauseBella" : "playBella";
    toggle.setAttribute("aria-label", translate(toggle.dataset.i18nAriaLabel));
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
  initLanguage();
  initPlatforms();
  initReleaseStatus();
  applyLanguage();
  initReveal();
  initPreview();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
else init();