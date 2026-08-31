# adamkostka.com

Personal site for Adam Kostka — AI engineer and multi-agent systems researcher.

Editorial paper-and-ink design with exactly one dark "instrument" section, one controlled
agent simulation, and one interactive research artefact (QUORUM). The site is complete,
readable and indexable with JavaScript disabled.

---

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
npm run build && npm start    # production build
```

Node 22+. No environment variables, no database, no API keys — the whole site is static.

## Verify

```bash
npm run verify           # build + contrast audit + full Playwright suite
npm test                 # 47 tests, Chromium desktop + WebKit mobile
npm run test:quorum      # drives QUORUM end to end and asserts the pedagogy holds
npm run check:contrast   # WCAG AA audit of every colour pair the site uses
npm run check:fold       # asserts Fig. 1 is visible without scrolling
npm run check:overflow   # reports any element wider than the viewport at 390px
npm run shots            # screenshots at 6 viewports + reduced-motion + no-canvas
```

First run needs browsers: `npx playwright install chromium webkit`.

Lighthouse (needs a Chrome binary):

```bash
CHROME_PATH=/path/to/chrome npx lighthouse@12 http://localhost:3000/ \
  --only-categories=performance,accessibility,best-practices,seo
```

## Deploy

Vercel is the path of least resistance — the project is a stock Next.js App Router build
with no server dependencies.

```bash
npx vercel        # preview
npx vercel --prod
```

**Before the first deploy**, set the real domain in `src/content/site.ts` → `site.url`.
It feeds canonical URLs, `sitemap.xml`, `robots.txt` and the Open Graph tags; leaving the
placeholder makes all of them point at the wrong host.

Any static host works too: `next build` output is fully prerendered.

## Editing content

All content is separated from presentation. You should never need to touch a component to
change what the site says.

| File | Holds |
| --- | --- |
| `src/content/site.ts` | Name, positioning, hero copy, links, Scholar metrics, availability |
| `src/content/publications.ts` | Papers: titles, authors, venues, abstracts, links, citation data |
| `src/content/projects.ts` | Case studies, including hand-placed architecture diagrams |
| `src/content/experience.ts` | Roles, education, awards, skills |
| `src/content/quorum.ts` | The QUORUM claims, agent responses and lesson copy |

Section labels, their stated purposes and the three reader paths all live in
`src/content/site.ts`. `site.availability` is the one sentence on the site about your
intentions rather than your record — confirm it or empty it.

**The CV PDF is not the front door.** This page is the CV, so the hero's primary action is
contact and the PDF sits in the footer, where it stays useful for forwarding and for
applicant-tracking uploads. To put it back in the hero, swap `site.links.email` for
`site.links.cv` in `primaryLinks`.

`CONTENT-TODO.md` lists what still needs your input and which claims need confirming.

To replace the CV: overwrite `public/adam-kostka-cv.pdf`.

## Architecture

```
src/
  app/
    layout.tsx              fonts, metadata, JSON-LD, skip link
    page.tsx                section composition
    work/[slug]/page.tsx    prerendered case studies
    opengraph-image.tsx     generated share card, reusing the hero's still frame
    sitemap.ts, robots.ts
  components/
    agents/                 the simulation: pure logic, Canvas2D renderer, bounded plate
    research/Quorum.tsx     the interactive artefact
    work/ArchitectureDiagram.tsx   SVG diagrams with full text alternatives
    sections/               one file per page section
    chrome/                 header (inverts over dark regions) and footer
    ui/Section.tsx          the single section primitive
  content/                  all copy and data
  lib/                      motion tokens, capability detection, class helper
scripts/                    verification and generation tooling
tests/site.spec.ts          functional, resilience and accessibility tests
```

Three decisions worth knowing before changing anything:

**Fig. 1 is an argument, not an ornament.** The hero figure went through two versions.
The first was a swarm that formed and dissolved clusters: pleasant, and decorative —
viewers could not tell what it showed, it had no control, and it opened identically every
visit. The current one plots 500 agents on a one-dimensional answer space with a labelled
truth line, a consensus marker, and one control: how much the agents have in common. Drag
it right and *both* readouts rise — agreement and error together. That is the site's whole
thesis, performed. If you change this figure, keep that property; a figure on a research
site that does not say anything is a liability.

**It is Canvas2D, not WebGL.** Built with react-three-fiber first: 230 KB and ~1.8 s of
main-thread time to draw a few hundred soft dots, with seconds of LCP render delay
attributed to it. Removing it took Performance from 89 to 96 and blocking time from
290 ms to 0 ms.

**Theme variables use `@theme static`.** Tailwind v4 tree-shakes theme variables no
utility class references, and `globals.css` consumes several directly from the base layer.
Without `static`, the entire type system silently falls back to system fonts.

**The `next/font` variables are on `<html>`, not `<body>`.** Tailwind declares
`--font-serif` on `:root` as `var(--font-newsreader), …`; custom-property substitution
resolves against the declaring element, so defining the font variable lower down makes the
`:root` declaration invalid and every heading falls back silently.

## Accessibility and performance posture

- Zero axe violations (WCAG 2.0/2.1/2.2 A and AA) on the home page, on a case study, and
  inside the dark section mid-interaction, on both Chromium and WebKit.
- Every colour pair the site uses is audited by `npm run check:contrast` — 21/21 at AA.
- The interactive canvas is an enhancement: reduced motion gets a single static frame at
  full density, and no canvas at all still leaves a real (precomputed) figure.
- Lighthouse: Performance 96, Accessibility 100, Best Practices 100, SEO 100 (home);
  98/100/100/100 on a case study.
- Fig. 1 is fully inside the fold at 1440×900 and 70% visible at 1440×800, asserted by
  `scripts/foldcheck.mjs`.
