# TESAIoT Board Explorer — Design PoC

Independent design proposal for a **board showcase** and **hardware example catalog**. This is not the official TESA website and is not a firmware release.

## Preview

- Board showcase: `dist/index.html`
- Example catalog: `dist/examples.html`
- Source transparency: `dist/sources.html`

```sh
npm run dev
# http://127.0.0.1:4173
npm test
```

Requires Node.js 22+. No package installation, backend, Docker, API key, or browser hardware permission is needed. Serve over HTTP; do not open HTML via `file://` because the catalog uses `fetch`.

## What is implemented

- Responsive Thai/English board showcase, actual public Training Kit image, keyboard-operable feature tabs.
- 9 curated hardware examples from public TESAIoT GitHub branches, including 7 original upstream screenshots and 2 explicitly labeled Hardware reference images.
- Search, category/board/difficulty filters, URL-persisted filters, example deep links, accessible native detail dialog, no-match and load-failure states.
- Original Board IDs, hardware requirements, pinned README/source links and source notices.
- New NDR board is a development preview with compatibility pending. It has **no verified example entries** in this PoC. Training examples are not automatically declared NDR-compatible.

## Boundaries

No Online Flash, firmware build, hardware validation, USB/camera access, purchasing, authentication, analytics, or production-site changes. No internal NDR documents, contracts, or private repository content are included. USB-camera feasibility requires separate Host/power/BSP/device validation.

The catalog's `board: training` is an editorial browsing family, not a validation certification. Original metadata IDs (`KIT_PSE84_AI`, `TESAIoT_PSE84_AI`, `TESAIoT_DEV_KIT`) remain visible. Always verify the exact BSP, board revision, sensors and accessories in the linked README.

## Data update

`scripts/sync-catalog.mjs` fetches only an explicit allowlist of public metadata/images. It does not execute upstream firmware or recursively copy a repository. Commits are pinned; to update, review the new source commit and the selected examples, then update the refs in the script and run:

```sh
npm run sync
npm test
```

Commit the reviewed `dist/data/catalog.json` and assets. The deployed site reads a local JSON snapshot, not the live Developer Hub API; no CORS dependency or GitHub token is exposed to visitors. External Google Fonts are optional; system fonts are the fallback.

## Deployment

GitHub Pages publishes only `dist/` through `.github/workflows/pages.yml`. Enable Pages with GitHub Actions as the source. Changes to `main` deploy after the static tests pass. The site uses relative links and works under a repository subpath.

## Design rationale / next decisions

1. One small static site with two connected experiences keeps the Board → Example → README journey consistent. The two pages can be split into separate domains later without introducing a backend now.
2. Product photography stays separate from application screenshots. Missing screenshots are labeled instead of invented.
3. Confirm Board naming, feature priority, buying/contact destination, approved NDR public assets and per-example validation labels before production.
4. Connect the existing flash service only after validating firmware manifests, supported browser/board matrix, release provenance and safety checks. This PoC intentionally cannot flash.

## Credits

Built with [TESAIoT Platform Examples](https://github.com/tesaiot/developer-hub).
Copyright 2025 TESAIoT Platform by TESA. Original metadata and screenshots are attributed to that repository; retained notices are in `UPSTREAM-NOTICE` and `THIRD_PARTY_NOTICES.md`.

Training-board image: [TESAIoT PSE84 DevKit SDK](https://github.com/tesaiot/tesaiot-pse84-devkit-sdk), `docs/assets/tesaiot-dev-kit.webp`.

TESAIoT and its marks belong to TESA. Use here describes source material in an independent design proposal, not endorsement. See `LICENSE` (Apache-2.0) and upstream per-component terms. No firmware or third-party firmware libraries are redistributed by this PoC.
