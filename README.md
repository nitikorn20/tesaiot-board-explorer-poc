# TESAIoT Board Explorer — Design PoC

Independent design proposal for a **board showcase** and **hardware example catalog**. This is not the official TESA website and is not a firmware release.

## Preview

- [Live board showcase](https://nitikorn20.github.io/tesaiot-board-explorer-poc/)
- [Live example catalog](https://nitikorn20.github.io/tesaiot-board-explorer-poc/examples.html)

- Board showcase: `dist/index.html`
- Example catalog: `dist/examples.html`
- Source transparency: `dist/sources.html`

```sh
npm run dev
# http://127.0.0.1:4173
npm run build
npm test
```

Requires Node.js 22+. No package installation, backend, Docker, API key, or browser hardware permission is needed. Serve over HTTP; do not open HTML via `file://` because the catalog uses `fetch`.

## Verification (2026-09-21)

Version 0.2: ten Node tests cover catalog provenance, combined filters, sanitization, local assets, absence of hardware APIs/embedded secrets, bilingual content, NDR labels and RGB threshold boundaries. CI also rebuilds the three pages and checks that the committed HTML is current.

Browser checks cover desktop, 390 × 844 mobile and 320px overflow checks; numbered hotspots with keyboard arrows; both board diagrams; TH/EN and persistent Dark/Light preferences; English search; native example details; NDR empty state; and deliberately blocked catalog loading followed by successful Retry. Reduced-motion emulation disables animations, transitions and smooth scrolling. Temporary testing overrides are removed afterward.

These are website checks only, not firmware builds, hardware validation or a comprehensive accessibility audit.

## What is implemented

- Complete TH/EN interface with persistent Dark/Light themes, responsive typography and consistent capability icons.
- Real QWA309 Training image with 8 numbered hover/tap/keyboard hotspots. NDR reference composition with 3 explicitly conceptual hotspots, not a final port map.
- Interactive, code-drawn functional block diagrams for both board paths. Optional Ethernet, shared USB PHY and revision/BSP uncertainty remain explicit.
- Browser-only Pot → RGB playground: each channel turns on above 50%, yielding eight digital colors. This is not live hardware control or continuous dimming.
- Restrained hover, entrance and signal animations with `prefers-reduced-motion` support.
- 9 curated hardware examples from public TESAIoT GitHub branches, including 7 original upstream screenshots and 2 explicitly labeled Hardware reference images.
- Search, category/board/difficulty filters, URL-persisted filters, example deep links, accessible native detail dialog, no-match and load-failure states.
- Original Board IDs, hardware requirements, pinned README/source links and source notices.
- New NDR board is a development preview with compatibility pending. It has **no verified example entries** in this PoC. Training examples are not automatically declared NDR-compatible.

## Boundaries

No Online Flash, firmware build, hardware validation, USB/camera access, purchasing, authentication, analytics, or production-site changes. No complete internal NDR documents, contracts, private repository content or slide decks are included. The specifically requested page-10 reference image is included with a clear concept label and separate rights notice. USB-camera feasibility requires separate Host/power/BSP/device validation.

The catalog's `board: training` is an editorial browsing family, not a validation certification. Original metadata IDs (`KIT_PSE84_AI`, `TESAIoT_PSE84_AI`, `TESAIoT_DEV_KIT`) remain visible. Always verify the exact BSP, board revision, sensors and accessories in the linked README.

## Data update

Edit page copy/layout in `scripts/build-pages.mjs`, then run `npm run build`. Do not edit generated `dist/*.html` alone. Board descriptions live in `dist/boards.js`; English example summaries live in `dist/example-translations.js`. The runtime is dependency-free vanilla JavaScript, CSS and SVG; no 3D model or animation framework is downloaded.

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
3. Confirm board naming, feature priority, buying/contact destination, final NDR photography/specifications and per-example validation labels before production.
4. Connect the existing flash service only after validating firmware manifests, supported browser/board matrix, release provenance and safety checks. This PoC intentionally cannot flash.

Research references, the proposed developer journey and the hotspot-versus-3D decision are recorded in [Design notes](docs/DESIGN-NOTES.md).

## Credits

Built with [TESAIoT Platform Examples](https://github.com/tesaiot/developer-hub).
Copyright 2025 TESAIoT Platform by TESA. Original metadata and screenshots are attributed to that repository; retained notices are in `UPSTREAM-NOTICE` and `THIRD_PARTY_NOTICES.md`.

Training-board image: [TESAIoT PSE84 DevKit SDK](https://github.com/tesaiot/tesaiot-pse84-devkit-sdk), `docs/assets/tesaiot-dev-kit.webp`.

NDR reference composition: user-selected Canva source slide 10, displayed through an SVG viewport. It uses a Luckfox carrier reference with TSOM overlaid, **not** an NDR prototype photograph. This supplied image is excluded from the website-code Apache-2.0 grant; original rights remain with its respective owners.

TESAIoT and its marks belong to TESA. Use here describes source material in an independent design proposal, not endorsement. See `LICENSE` (Apache-2.0) and upstream per-component terms. No firmware or third-party firmware libraries are redistributed by this PoC.
