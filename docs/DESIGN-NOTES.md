# Board Explorer — design rationale

## V3 — approved editorial / Project Hub direction (2026-09-21)

The new story is **see a real outcome → choose a board → choose an application → inspect a project → open source / SDK**. Home introduces the product rather than opening with dense technical exploration. Hardware hotspots, functional diagrams and RGB simulation remain on `boards.html`.

Seven small static routes share one visual and navigation system: Home, Board Details, Project Hub, Featured, Edge AI Hub, Learn / Docs, and Sources. Light is the first-visit default; explicit dark preference persists. Warm off-white, deep forest green, modest rounded cards, larger editorial type and original outline icons distinguish the PoC from its references.

### Reference patterns, not copied presentation

- [Arduino](https://www.arduino.cc/): product benefits and visible making lead into products.
- [Project Hub](https://projecthub.arduino.cc/): browse by the thing you want to build, then inspect requirements.
- [Featured](https://projecthub.arduino.cc/sections/featured): editorial selection, not a technical filter or fabricated popularity score.
- [Dragonwing Hub](https://projecthub.arduino.cc/sections/dragonwing-hub): a themed destination connects platform, applications and tooling. The PoC uses an Edge AI destination with its own board-boundary labels.

No claim of measured conversion improvement is made. The current goal is a reviewable presentation PoC, not a commerce or community backend.

### Content boundaries

The three featured stories are Pot → RGB (hardware + browser interaction), Sensor Hub (source screenshot + README), and the existing BENTO Edge AI clip. The nine-example hardware catalog is unchanged. Audio levels, threshold RGB and IMU graphs are not relabeled as AI.

Three **official Infineon upstream references** link to audio classification, human-activity recognition and USB-camera vision. Each explicitly says **TESA validation pending**. Their original CSS/icon placeholders contain filming briefs, not generated photos of functioning TESA hardware. Training / KIT_PSE84_AI and TSOM + NDR retain distinct base/BSP/validation paths.

[DEEPCRAFT](https://www.infineon.com/design-resources/embedded-software/deepcraft-edge-ai-solutions) links split by starting point: find existing models (AI Hub), build/train a model (Studio), or bring a model to supported hardware (Model Converter). Compatibility, licenses and tool versions stay with the vendor's current documentation.

### Real footage and remaining production media

The user explicitly requested reuse of source Canva videos. Page 21 contains the BENTO Edge AI demonstration. Only its video region is published, without audio or surrounding slide imagery. A native opt-in player uses WebM with MP4 fallback; a true frame is used as its poster. Captions distinguish the old demonstration from fresh validation and the new NDR carrier. See asset hashes and transformation details in `THIRD_PARTY_NOTICES.md`.

Still needed for production: a clean Training-board hero shot; one clearly framed clip per selected AI use case with model/version/test conditions; actual final NDR top/angled photos; and NDR application footage after carrier validation. Do not substitute a fabricated PCB photograph.

## V2 — retained interaction rationale

Date: 2026-09-21. This is an independent design proposal, not an approved TESA brand system or new hardware specification.

## Developer journey

The proposed story is **an idea → a board → the hardware behind it → a small experiment → a source example → SDK setup**. Show a tangible result before asking a visitor to read a specification list. Keep requirements and provenance one click away from every example. This is a design hypothesis, not a measured conversion improvement.

1. Hero: “From first signal. To your next idea.” Real hardware and two clear destinations.
2. Board lineup: Training for an existing learning path; TSOM + NDR as a separately labeled development concept.
3. Hardware explorer: numbered photo hotspots, capability icons and selectable functional diagrams.
4. Small experiment: a browser-only Pot → RGB demonstration tied to the source example’s digital threshold behavior.
5. Example cards: visible output, concise purpose, hardware requirements, original Board IDs and pinned source.
6. Get started: choose a board, inspect an example, open the SDK documentation.

There is no fabricated Buy button, stock claim or NDR compatibility promise. Production needs an approved purchase/contact destination.

## Reference research

Reviewed the following primary websites for experience patterns, not for copying their code, visual assets or hardware claims:

- [Espressif ESP32-S31](https://esp32-s31.espressif.com/en): product capabilities connected to projects and a developer journey. Applied as a clear board-to-example-to-documentation progression.
- [Arduino Project Hub](https://projecthub.arduino.cc/): making-focused project discovery with filters. Applied as outcome-led cards and hardware/category/difficulty browsing.
- [NXP Application Code Hub](https://mcuxpresso.nxp.com/appcodehub): a dedicated application/example destination. Applied as a separate but visually connected catalog page.
- [Arduino UNO Q](https://www.arduino.cc/product-uno-q/): product storytelling connected to applications and the development experience. Applied as an idea-first opening rather than an exhaustive specification table.

## Why hotspots first, not a 3D model

Actual photography preserves the recognizable board, loads without a 3D engine and works with mouse, touch and keyboard. A numbered point links a physical area to a capability and a next action. The NDR image is a concept reference, so accurately modeling it as a final PCB would be misleading.

3D can be a later optional “Inspect in 3D” mode once an accurate, approved model exists for the exact board revision. Retain the 2D tour as the default and accessible fallback; measure load cost before adding it. No claim is made that 3D always improves engagement.

## Visual and interaction system

- Dark engineering-workbench theme: navy surfaces, lime highlights and outline capability icons. Light theme: off-white surfaces, dark ink and forest-green accents.
- IBM Plex Sans Thai for readable Thai/English body copy, Space Grotesk for product labels and technical details, system fallbacks if the font service is unavailable.
- TH/EN and theme preferences persist locally across pages. Original part numbers, Board IDs and source file names are preserved.
- Hover/tap/keyboard photo hotspots; selectable architecture blocks; short signal pulses; subtle card movement; an eight-color RGB simulation.
- No auto-rotating hero, looping video or mandatory motion. Reduced-motion preference disables animations/transitions and smooth scrolling.
- Static HTML/CSS/JavaScript on GitHub Pages. No backend, Docker, API token, runtime GitHub API or online-flash implementation is needed for this PoC.

## Truth and production gates

The Training assembly is QWA309 + KIT_PSE84_AI, not automatically the same SOM/carrier combination as NDR. Training examples are not certified on the new base. The NDR source image uses a Luckfox reference composition, labeled as such on the page. Its functional diagram is a draft: shared USB Host/Device PHY, optional Ethernet, external display and USB-camera prerequisites remain visible.

Before production, confirm final board naming/revision and approved photos, audience and priority applications, a purchase/contact path, public-asset rights, BSP support and per-example validation evidence. Evaluate the story with developers: can they identify a suitable board and reach a relevant README without explanation?
