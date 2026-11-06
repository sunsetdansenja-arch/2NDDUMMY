# SALT DEPARTMENT — Store & Brand Direction

## Brand assets (no SVG)
Use supplied WEBP artwork only:
- `assets/brand/Distressed Chrome S_D Lettering.webp` — loading mark and compact header identity.
- `assets/brand/Chrome Tentacle Eye Emblem.webp` — decorative illustration only.
- `assets/brand/Rugged Chrome SALT DEPT Text.webp` — intro wordmark and footer.
- `assets/brand/Ocean_wave_crashing_with_lightning_3cdf0754.webm` — muted loop background video.

Do not use SVG logo files. The clean wordmark artwork is the primary visual signature; tentacle/eye art is not the logo.

## Store
- Mobile-first, single-page public storefront.
- Filters: keyword, brand, size, min/max price.
- Items are individual one-off preloved boardshorts with SKU, condition and stock status.
- Sold items are hidden from public listing.

## Admin prototype
Open `admin.html` to add/edit/delete products and export/import JSON.
This current implementation stores data in browser localStorage only. It is not a secure multi-user CMS and does not persist products to GitHub or a server. Production use requires authentication and a database/storage backend.

## Intro sequence
1. Black loading screen with distressed S/D artwork and “WAVE INCOMING...”.
2. Preload the three WEBP artworks.
3. Tentacle artwork for one second.
4. Horizontal 3D flip transition to SALT DEPT wordmark for one second.
5. Wordmark exits upward as the sticky compact header is revealed.
