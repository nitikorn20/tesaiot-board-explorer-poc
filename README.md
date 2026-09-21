# TESAIoT Board Explorer — Design PoC

Independent design proposal for a **board showcase**, **Project Hub** and **Edge AI discovery journey**. This is not the official TESA website and is not a firmware release.

## Preview

- [Live board showcase](https://nitikorn20.github.io/tesaiot-board-explorer-poc/)
- [Live example catalog](https://nitikorn20.github.io/tesaiot-board-explorer-poc/examples.html)
- [Featured](https://nitikorn20.github.io/tesaiot-board-explorer-poc/featured.html)
- [Edge AI Hub](https://nitikorn20.github.io/tesaiot-board-explorer-poc/edge-ai.html)

- Board showcase: `dist/index.html`
- Example catalog: `dist/examples.html`
- TESA / Infineon resources and collapsed media credits: `dist/sources.html`
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

Version 0.5: 28 tests pass. Adds bilingual board-selection guidance and a single Photo / 3D explorer with shared feature details. Browser checks: desktop and 320px Thai/light / 390px English/dark board pages, all seven routes at 390px, keyboard Home/End navigation, selection retention across views, the photo-only Trust M point, NDR concept/exploded view, language changes with 3D loaded, and blocked-GLB fallback + successful Retry. Temporary viewport/network overrides were restored. This supersedes the separate v4 model/photo sections below; the hero, examples and getting-started flow are unchanged.

Version 0.4: 22 Node tests cover catalog provenance, filters, sanitization, local assets/anchors, hardware/API boundaries, bilingual controls, NDR labels, RGB thresholds, preferences, AI-reference status, homepage structure, motion/data guards, opt-in 3D, the pinned GLB hash and self-contained assets, vendor imports/licenses and relevant public resources. CI rebuilds seven pages and the AI reference manifest and verifies committed output.

V4 browser checks cover desktop, all seven pages at 320px Thai/light and 390px English/dark without horizontal overflow; a playing 16-second WebM hero, pause and mobile opt-in; reduced-motion poster-only behavior; actual Training GLB loading, feature selection and camera buttons; NDR switching/exploded view; and a deliberately blocked GLB request that retains the still image and succeeds after Retry. Earlier catalog/filter/dialog, RGB and hardware-tour checks remain covered by the retained tests. These checks are not a universal browser/codec guarantee.

These are website checks only, not firmware builds, hardware validation or a comprehensive accessibility audit.

## What is implemented

- Full-width film hero → two product tiles + Developer Hub → three selected stories → compact SDK / Edge AI next step. Separate board details, Project Hub / Featured / Edge AI Hub and Learn / Docs. Featured is curation, not a popularity ranking.
- Complete TH/EN interface with persistent Dark/Light themes (light default), responsive typography and consistent capability icons.
- Board-selection guidance: audience / use cases, hardware in the shown assembly or draft, and external / optional devices. Not a sales BOM; NDR revision, BSP, package contents and validation remain pending. Homepage product tiles add only a short audience line.
- One default Photo / optional 3D area and one shared feature panel. Selection survives view and language changes; failed 3D returns to the usable photo. Training Trust M remains in the feature list, explicitly photo-only; NDR labels the views Concept / 3D Concept. The old `#explore-3d` anchor still resolves.
- Existing BENTO Edge AI footage from user-supplied Canva slide 21: a silent 16-second hero excerpt, WebM + MP4, poster and pause control. Desktop autoplay is guarded by reduced-motion and Save-Data; phones are opt-in. Playback pauses when hidden/offscreen. The full 39-second clip remains opt-in on Edge AI Hub.
- Three official Infineon Audio / Motion / Vision references, explicitly **upstream / TESA validation pending**, with CSS concept artwork and specific filming briefs. Separate from the nine hardware examples.
- DEEPCRAFT AI Hub / Studio / Model Converter discovery paths, not local training or inference.
- Real QWA309 Training image with 8 numbered hover/tap/keyboard hotspots. An on-demand TESA GLB viewer has 7 measured points; the optional OPTIGA Trust M module is absent from that GLB and not fabricated. All feature buttons are available without dragging.
- NDR uses an original code-drawn concept image and a procedural 3D SOM/carrier with assembled/exploded views and 2 conceptual points. Shape, size, placement and interfaces are not confirmed PCB geometry or a pin map. The old Luckfox-based reference asset is retained only as an unlinked historical asset.
- Interactive, code-drawn functional block diagrams for both board paths. Optional Ethernet, shared USB PHY and revision/BSP uncertainty remain explicit.
- Browser-only Pot → RGB playground: each channel turns on above 50%, yielding eight digital colors. This is not live hardware control or continuous dimming.
- Restrained hover, entrance and signal animations with `prefers-reduced-motion` support.
- 9 curated hardware examples from public TESAIoT GitHub branches, including 7 original upstream screenshots and 2 explicitly labeled Hardware reference images.
- Search, category/board/difficulty filters, URL-persisted filters, example deep links, accessible native detail dialog, no-match and load-failure states.
- Original Board IDs, hardware requirements, pinned README/source links and source notices.
- New NDR board is a development preview with compatibility pending. It has **no verified example entries** in this PoC. Training examples are not automatically declared NDR-compatible.

## Boundaries

No Online Flash, firmware build, hardware validation, USB/camera access, purchasing, authentication, analytics, or production-site changes. No complete internal NDR documents, contracts, private repository content or slide decks are included. The user-requested TESA GLB and page-21 video crop have source attribution and separate rights notices. The former page-10 reference image is retained as an unlinked historical asset; current NDR imagery is explicitly conceptual. USB-camera feasibility requires separate Host/power/BSP/device validation. A common E84 chip family does not establish kit/carrier/BSP equivalence. Sensor graphs, Pot RGB and audio meters are not presented as AI.

The catalog's `board: training` is an editorial browsing family, not a validation certification. Original metadata IDs (`KIT_PSE84_AI`, `TESAIoT_PSE84_AI`, `TESAIoT_DEV_KIT`) remain visible. Always verify the exact BSP, board revision, sensors and accessories in the linked README.

## Data update

Edit the homepage and Resources in `scripts/product-layout.mjs`; board overview / unified explorer markup in `scripts/board-layout.mjs`; other editorial pages and AI references in `scripts/build-pages.mjs`; retained diagrams / simulation / catalog in `scripts/page-sections.mjs`. Run `npm run build`; do not edit generated `dist/*.html` alone. Board facts live in `dist/boards.js`, audience/add-on guidance in `dist/board-guides.js`, and English example summaries in `dist/example-translations.js`. `model-interface.js` owns both image/model feature interactions; `ui.js` handles board selection, overview, architecture and simulation. The 3D interface dynamically loads `board-viewer.js`, locally vendored Three.js r169 / Draco, and the Training GLB only after a click. No CDN is needed for 3D; media files are checked-in derivatives. Source pins, credits and editing notes are in `THIRD_PARTY_NOTICES.md`.

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
