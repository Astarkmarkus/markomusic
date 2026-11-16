# MARKO — Official Artist Website

A one-page, mobile-first website for **MARKO** and the upcoming single **BELLA** (30 November 2026).

- Royal blue / ivory identity: `#173BA4`, `#0B1E55`, `#F8F6F0`
- Plain HTML, CSS and JavaScript; no build step or backend
- No analytics, trackers, forms, accounts or cookies
- Responsive layout, semantic HTML, accessible buttons and reduced-motion support

## Files

```text
index.html
styles.css
script.js
assets/
  favicon.svg
  bella-social.svg
  bella-cover.webp        (add approved image)
  marko-portrait.webp     (add approved portrait, optional)
  bella-preview.mp3       (add approved 10–15s instrumental)
.nojekyll
```

**The final three media files are not included yet.** The website intentionally shows the artistic blue BELLA fallback when the approved cover has not been supplied. The portrait is omitted if missing, and the audio play control is hidden if the approved MP3 is missing. There is no random imagery or placeholder audio.

## GitHub Pages

1. Open [repository Settings → Pages](https://github.com/Astarkmarkus/markomusic/settings/pages).
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch **main**, folder **/(root)**, then **Save**.
4. When deployment completes, visit [astarkmarkus.github.io/markomusic](https://astarkmarkus.github.io/markomusic/).
5. Check the published site on iPhone Safari, Android Chrome and desktop.

GitHub Pages may take several minutes to publish after configuration. A repository commit does not by itself mean Pages has been activated.

## Official media

- Upload the approved cover as `assets/bella-cover.webp`, preferably at least 1200 × 1200 px, optimized for web.
- Upload an approved MARKO photograph as `assets/marko-portrait.webp` only if one is approved for use.
- Upload a 10–15-second instrumental excerpt as `assets/bella-preview.mp3`. Audio does not autoplay.

The JavaScript attempts to load media only if it exists. No broken images or fake playback controls are displayed while media is missing. To change paths, edit the `RELEASE.assets` object in `script.js`.

## Release management

Edit `RELEASE` at the top of `script.js`.

- `status: "coming-soon"` is the default.
- **Do not** set `status: "out-now"` until distribution is confirmed.
- Add confirmed URLs under `streaming.spotify` and `streaming.appleMusic` and switch to `out-now`. Buttons only appear for valid HTTPS URLs.
- The release never automatically switches status on November 30.

For a future release, update the `RELEASE` fields and approved static artwork/wording. The design remains reusable.

## Custom domain: markomusic.art

Only configure this **once the domain is owned and DNS is ready**:

1. In repository **Settings → Pages → Custom domain**, enter `markomusic.art` and save.
2. At your DNS provider, add GitHub Pages apex A records:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Optionally create a `www` CNAME pointing to `astarkmarkus.github.io`.
4. Wait for DNS checks, then enable **Enforce HTTPS** in Pages settings.
5. Once domain routing works, update `og:url` / `og:image` in `index.html` to the canonical site URLs, and preferably replace the temporary SVG social image with an approved **1200 × 630 PNG/JPG** (for widest social crawler compatibility).

No `CNAME` file is included until the domain is actually configured, avoiding unintended deployment issues.

## Final release checklist

- [ ] Upload approved BELLA cover
- [ ] Upload approved MARKO portrait (optional)
- [ ] Upload 10–15-second approved MP3 preview
- [ ] Confirm preview controls and playback on phones
- [ ] Enable GitHub Pages from `main` / root
- [ ] Test SEO/open graph sharing (PNG/JPEG recommended over SVG)
- [ ] After Nov 30 and distribution confirmation, add verified music links and manually change status
- [ ] Configure `markomusic.art` and HTTPS when DNS is available
