# Third-party source and asset notices

Built with TESAIoT Platform Examples.
https://github.com/tesaiot/developer-hub
Copyright 2025 TESAIoT Platform by TESA.

The upstream Apache 2.0 license is preserved in `LICENSE`; upstream attribution/trademark notice is retained verbatim in `UPSTREAM-NOTICE`. Its list of firmware dependencies does not mean those libraries are included in this website.

## Included public-source material

| Material | Public repository | Pinned commit |
| --- | --- | --- |
| Episode metadata, brief adapted descriptions and 7 screenshots | `tesaiot/developer-hub` / `tesaiot_dev_kit_episodes` | `e48fbd2a8d786730e30aed96eb129150e2bcf66d` |
| 2 QWA309 example metadata records and adapted descriptions | `tesaiot/developer-hub` / `tesaiot_dev_kit_practise_codes` | `372d0d849578a6a49b634d3ecaab8b5958166921` |
| Training Kit product image, unmodified | `tesaiot/tesaiot-pse84-devkit-sdk` / `docs/assets/tesaiot-dev-kit.webp` | `ef72c1b658178eee8c38b1e47d28b006f80a59b5` |

Exact image, metadata, README and source URLs are recorded per example in `dist/data/catalog.json`. Product screenshots are illustrative upstream snapshots, not live hardware or independently verified test evidence. The Pot RGB/ADC examples reuse a labeled product-reference image because their selected source folders do not include screenshots.

The website code, layout, curation and Thai/English editorial summaries are new for this PoC. No existing official website code, firmware, private repository, complete NDR design document or contract is copied.

## User-selected NDR reference asset — separate rights

- File: `dist/assets/ndr-reference-concept.png` (773 × 800 PNG).
- Source: the image selected by the user from page 10 of Canva design `DAHT7gbtBEY`, reviewed on 2026-09-21. Access-bearing editor and signed image URLs are intentionally not published.
- SHA-256: `b1433433a5b7cd6d13dc2535f427cf4e1fd6b2e0c53e5e43182e1725eb5a8484`.
- The supplied image combines a block diagram and a TSOM-on-Luckfox reference composition. The website displays only the lower board region through an SVG viewport; pixels are not AI-generated or altered. Interactive diagrams are newly authored HTML/CSS/SVG and do not display the source diagram screenshot.
- The user specifically requested this source image for the PoC. It is labeled **Reference Concept**, not a finished NDR PCB, final layout or hardware validation result.
- This image is **not relicensed under the repository's Apache-2.0 code license**. Original image, product and trademark rights remain with their respective owners. Do not assume unrestricted redistribution or official endorsement; obtain the appropriate production-publication clearance and replace it with approved final photography when available.

Google Fonts supplies IBM Plex Sans Thai and Space Grotesk via its stylesheet service; fonts are not vendored in this repository. System-font fallbacks work without that service. No analytics are included.

## User-requested BENTO demo footage — separate rights

- Source: user-supplied Canva design `DAHT7gbtBEY`, page 21 as reviewed/exported 2026-09-21. On-slide media name: `BENTO Demo - Edge AI (Multi-model).mp4`. Source footage retains its visible attribution. Editor access keys and temporary signed download URLs are not published.
- A single-slide 1920 × 1080 MP4 was exported through Canva's normal download UI. The complete slide remains outside this repository.
- Published crop: `crop=1064:700:16:360`, resized to 960 × 632 at 30 fps, audio removed, duration 39.066 seconds. No time acceleration, AI modification or invented screen outputs. Adjacent stock illustrations and unrelated slide text are excluded.
- `dist/assets/bento-edge-ai-demo.mp4`: H.264 CRF 25 / fast / faststart, SHA-256 `756015d399ff383773c35392f59532347890f1c5f3e26a45948b86ed22a01be4`.
- `dist/assets/bento-edge-ai-demo.webm`: VP9 derivative, CRF 36 / zero target bitrate, SHA-256 `348cb43ff8bcffbb56b5618d8c7c9128d2b21bef3eef79eaf3b6e4ebc8d27a99`.
- `dist/assets/bento-edge-ai-poster.jpg`: frame at 15 seconds of the cropped clip, SHA-256 `cd67493bc9475366cd2e0ed539615241d54ee2443aaf2cfb800758a6c0c48252`.
- Visual-description text is editorial and does not certify classification correctness. The clip is an existing demo, not a new test, model benchmark or NDR validation. It does not imply the displayed firmware is included in the nine-example catalog.
- Footage and its poster are **excluded from the Apache-2.0 website-code license**. Original rights remain with the owners. The user requested reuse in this design PoC; obtain appropriate publication clearance before a production rollout.

## Linked upstream AI references

Three official Infineon repositories are linked, with brief original summaries in `dist/data/ai-references.json`. No upstream firmware, model weights or binaries are copied. Each reference is labeled TESA validation pending. DEEPCRAFT and PSoC marks identify Infineon's tools/products; this site is not endorsed by Infineon.

Arduino product pages, Project Hub, Featured and Dragonwing Hub informed information architecture only. No Arduino brand assets, project media, code or social counts are reused.
