# TESAIoT Board Explorer — Design PoC

Independent design proposal for a **board showcase**, **Project Hub** and **Edge AI discovery journey**. This is not the official TESA website and is not a firmware release.

## Preview

- [Live board showcase](https://nitikorn20.github.io/tesaiot-board-explorer-poc/)
- [Live example catalog](https://nitikorn20.github.io/tesaiot-board-explorer-poc/examples.html)
- [Featured](https://nitikorn20.github.io/tesaiot-board-explorer-poc/featured.html)
- [Edge AI Hub](https://nitikorn20.github.io/tesaiot-board-explorer-poc/edge-ai.html)

- Board showcase: `dist/index.html`
- Example catalog: `dist/examples.html`
- Source transparency: `dist/sources.html`
- Board details / hotspots: `dist/boards.html?board=training` or `?board=ndr`
- Curated stories: `dist/featured.html`
- Demo, AI references and DEEPCRAFT pathways: `dist/edge-ai.html`
- Setup journey / upstream docs: `dist/learn.html`

```sh
npm run dev
# http://127.0.0.1:4173
npm run build
npm test
```

Requires Node.js 22+. No package installation, backend, Docker, API key, or browser hardware permission is needed. Serve over HTTP; do not open HTML via `file://` because the catalog uses `fetch`.

## Verification (2026-09-21)

Version 0.3: fifteen Node tests cover catalog provenance, combined filters, sanitization, local assets/anchors, absence of hardware APIs/embedded secrets, bilingual controls, NDR labels, RGB thresholds, light-default preferences and separate AI-reference status. CI rebuilds seven pages and the AI reference manifest and verifies committed output.

V3 browser checks cover desktop, seven routes at 390px Thai/light and 320px English/dark without horizontal overflow, persistent language/theme preferences, board switching and keyboard hotspots, shared-USB-PHY details, example filtering/dialogs, NDR empty state and successful opt-in WebM playback. The native accessibility play action crashed two embedded-browser test tabs; keyboard activation successfully played the WebM source. A universal browser/codec guarantee is not implied. V2 previously covered catalog error/retry and reduced-motion behavior; both remain implemented.

These are website checks only, not firmware builds, hardware validation or a comprehensive accessibility audit.

## What is implemented

- Editorial outcome-first homepage, separate board details, Project Hub / Featured / Edge AI Hub and Learn / Docs. Featured is a curated collection, not a category or popularity ranking.
- Complete TH/EN interface with persistent Dark/Light themes (light default), responsive typography and consistent capability icons.
- Existing BENTO Edge AI footage from user-supplied Canva slide 21: a silent 39-second crop, WebM with MP4 fallback, real-frame poster, visible provenance and text description. No autoplay or background video download.
- Three official Infineon Audio / Motion / Vision references, explicitly **upstream / TESA validation pending**, with CSS concept artwork and specific filming briefs. Separate from the nine hardware examples.
- DEEPCRAFT AI Hub / Studio / Model Converter discovery paths, not local training or inference.
- Real QWA309 Training image with 8 numbered hover/tap/keyboard hotspots. NDR reference composition with 3 explicitly conceptual hotspots, not a final port map.
- Interactive, code-drawn functional block diagrams for both board paths. Optional Ethernet, shared USB PHY and revision/BSP uncertainty remain explicit.
- Browser-only Pot → RGB playground: each channel turns on above 50%, yielding eight digital colors. This is not live hardware control or continuous dimming.
- Restrained hover, entrance and signal animations with `prefers-reduced-motion` support.
- 9 curated hardware examples from public TESAIoT GitHub branches, including 7 original upstream screenshots and 2 explicitly labeled Hardware reference images.
- Search, category/board/difficulty filters, URL-persisted filters, example deep links, accessible native detail dialog, no-match and load-failure states.
- Original Board IDs, hardware requirements, pinned README/source links and source notices.
- New NDR board is a development preview with compatibility pending. It has **no verified example entries** in this PoC. Training examples are not automatically declared NDR-compatible.

## Boundaries

No Online Flash, firmware build, hardware validation, USB/camera access, purchasing, authentication, analytics, or production-site changes. No complete internal NDR documents, contracts, private repository content or slide decks are included. Only the specifically requested page-10 reference image and page-21 video crop are included with labels and separate rights notices. USB-camera feasibility requires separate Host/power/BSP/device validation. A common E84 chip family does not establish kit/carrier/BSP equivalence. Sensor graphs, Pot RGB and audio meters are not presented as AI.

The catalog's `board: training` is an editorial browsing family, not a validation certification. Original metadata IDs (`KIT_PSE84_AI`, `TESAIoT_PSE84_AI`, `TESAIoT_DEV_KIT`) remain visible. Always verify the exact BSP, board revision, sensors and accessories in the linked README.

## Data update

Edit editorial pages and AI references in `scripts/build-pages.mjs`; shared validated hardware/catalog sections are in `scripts/page-sections.mjs`. Run `npm run build`; do not edit generated `dist/*.html` alone. Board descriptions live in `dist/boards.js`; English example summaries live in `dist/example-translations.js`. The runtime is dependency-free JavaScript, CSS and SVG; no 3D model or animation framework is downloaded. Media files are checked-in derivatives, not generated by the site build; editing notes and hashes are in `THIRD_PARTY_NOTICES.md`.

`scripts/sync-catalog.mjs` fetches only an explicit allowlist of public metadata/images. It does not execute upstream firmware or recursively copy a repository. Commits are pinned; to update, review the new source commit and the selected examples, then update the refs in the script and run:

```sh
npm run sync
npm test
```

Commit the reviewed `dist/data/catalog.json` and assets. The deployed site reads a local JSON snapshot, not the live Developer Hub API; no CORS dependency or GitHub token is exposed to visitors. External Google Fonts are optional; system fonts are the fallback.

## Deployment

GitHub Pages publishes only `dist/` through `.github/workflows/pages.yml`. Enable Pages with GitHub Actions as the source. Changes to `main` deploy after the static tests pass. The site uses relative links and works under a repository subpath.

## Design rationale / next decisions

1. One static site with product storytelling and connected collections keeps Board → Project → Source / SDK consistent. Product and hub areas can move to separate domains later without requiring a backend now.
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
