# MARKO — Official Music Website (V2)

A mobile-first one-page artist website for **MARKO** at `markomusic.art` (GitHub Pages).

## Design & content

- Full-screen cinematic portrait hero featuring the approved artist photograph.
- MARKO wordmark, Instagram link, streaming platform wordmarks for Spotify, Apple Music and SoundCloud.
- **Latest Releases** editorial section with a softly blurred artist portrait in the background.
- **BELLA** single: official cover artwork with blurred cover backdrop, release date 30.11.2026.
- **Show Off, Love**: EP card on the right on desktop, release date TBD, deliberately **no EP artwork**.
- Mobile-first responsive layout, hover/reveal animations, reduced motion accessibility.
- Artist-provided media only; no trackers, analytics, user accounts, backend or cookie banners.

## Deployment

Upload the entire folder to the repository root on `main`; deploy from **main / (root)** in GitHub Pages.

```
index.html
styles.css
script.js
assets/
  bella-cover.webp        official artwork provided by MARKO
  marko-portrait.webp     official MARKO portrait
  favicon.svg             existing icon
  bella-social.svg        existing generic social card (not needed if artwork is live)
  bella-preview.mp3       optional, add actual audio only
CNAME                      preserved, markomusic.art
.nojekyll                  preserved
```

## Links and release controls

Edit the `MARKO` object at the top of `script.js`:

- `MARKO.platforms.spotify`, `.appleMusic`, `.soundcloud`: add confirmed HTTPS URLs. The wordmarks become clickable only when the corresponding URL is present. Otherwise they're non-clickable branding with a clear "links coming soon" label.
- `MARKO.bella.preSaveUrl`: add a real pre-save URL to reveal PRE-SAVE in the BELLA card. No dead buttons.
- `MARKO.bella.status`: manually switch from `"coming-soon"` to `"out-now"` **only when confirmed on music platforms**, and add platform URLs to reveal LISTEN.
- `MARKO.bella.preview`: optional MP3 path. The entire player stays hidden until the artist's real MP3 exists; it never autoplays.

The website does not automatically mark BELLA as released on November 30; manual confirmation is required.

## Assets

The two WEBP images in the project are optimized copies of the images supplied by MARKO. The original artwork and portrait are not altered, stylized or re-created. Replace them using the exact same filenames to change images.

## Domain

The `CNAME` file points to `markomusic.art`. Keep the DNS records for this domain at the authoritative provider (currently Porkbun); do not change DNS for `onyx45.com`. See GitHub Pages settings for any pending DNS check and HTTPS activation.