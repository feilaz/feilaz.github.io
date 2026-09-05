# Adam Kostka — portfolio v2

The public portfolio at https://feilaz.github.io. This repository now hosts the reviewed second design; the previous implementation remains in Git history at `2470ff42727e9160501d799c94cd717e0c335dd2`.

## Run

Node 22+. Install the existing lockfile with `npm ci`, then `npm run dev -- --port 3100`.

`npm run verify` runs lint, focused model/lesson tests, the static production build, and a generated-output link/structure audit.

## Design

Neutral surfaces, ink typography and restrained cobalt accents. Square geometry, a shared alignment grid and deliberate spacing replace the first draft’s rounded cards. The header appearance switch remembers an explicit choice; first-time visitors follow their device theme. Both themes cover diagrams, filters and interactive content. A concise homepage leads with production engineering, follows with the research contribution, and links to dedicated publications, background and interactive research pages. Seven complete case-study routes preserve the original project record. Existing structured content is retained in `src/content/`.

Project visuals are authored feature maps, schedules and product concepts. They are labeled as illustrations rather than presented as screenshots of proprietary software. The research figure is an inexpensive, deterministic SVG model that changes only in response to the visitor. It stays still at rest; a brief, reduced-motion-aware transition follows slider input. The figure labels truth and the group estimate and uses qualitative shared-error levels instead of an empirical-looking percentage. QUORUM uses scripted responses and identifies that limitation before interaction.

All fonts are served locally. There is no model API, database, form backend, analytics or secret required. Motion is limited to small CSS hover transitions and respects reduced-motion preferences. The public deployment uses GitHub Pages canonical URLs and allows search indexing.

## Routes

- `/`: selected work, research, recent papers, introduction
- `/publications/`: eight papers, year/topic filters, abstracts and citation copying
- `/about/`: background, roles, education and skills
- `/lab/`: three-round Consensus Lab
- `/work/[slug]/`: seven individual case studies

## Hosting

GitHub Actions verifies the project, exports Next.js to `out/`, and deploys GitHub Pages whenever `main` changes. The `.nojekyll` file preserves Next’s underscore-prefixed assets. The separate private Sites review copy is not the source for this public deployment.

## Content still to confirm

The source record comes from the existing portfolio. Career dates and project status are retained; publication status for ICLP remains author-confirmed with a preprint link. Add a proceedings link when available. Real publishable product screenshots and a portrait can replace the authored visual summaries later. The CV is the existing public, phone-free copy; it is not regenerated automatically. Dynamic citation counters have been omitted from the redesign.

## Validation

The refinement passed lint, four focused model/lesson/theme tests, the static production build and a link/structure audit across 13 generated HTML documents. Browser inspection covered desktop at 1440px and mobile at 390px, both appearances, mobile navigation, publication year filtering and theme persistence after reload. The subsequent sweep checked the hero figure and slider endpoints, consistent SVG feature icons, the research case-study diagram, about page, publication controls, and the lab evidence reveal at 320px/390px. No horizontal overflow was observed on the inspected homepage and publication views. This is focused browser QA, not a comprehensive cross-browser or accessibility certification.

## Design references

Reviewed the current public sites of [Paco Coursey](https://paco.me/), [Rauno Freiberg](https://rauno.me/) and [Brittany Chiang](https://brittanychiang.com/), plus [Linear’s account of its UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui). The useful principles were clear hierarchy, consistent alignment, limited surface treatments, restrained motion and meaningful whitespace. The implementation is original and uses no copied third-party assets.


## Research precision sweep

Checked the published PMLR abstract and the retained camera-ready source against the website. Score Deviation uses within-tuple claim-score spread; semantic entropy and U-shaped penalties are separate ablations. The research figure separates offline calibration from scoring new queries. The case study states label-relative expected tuple-level FDR, exchangeability, and recalibration after model or domain changes. The opening swarm remains a conceptual counterexample, not a visualization of the scoring formula or experimental data.
