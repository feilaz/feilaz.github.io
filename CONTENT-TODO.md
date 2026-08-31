# Content that needs your input

Everything on this site is traceable to a source. This file lists the places where I had
to stop short, where a claim needs your confirmation, and where a real artefact would
make the site materially stronger.

Ordered by how much difference each would make.

---

## 1. Confirm or delete one sentence about your intentions

`src/content/site.ts` → `site.availability`

> "I am interested in research collaboration on agent reliability, and in engineering
> roles where both halves of this page are useful."

This is the **only** statement on the site about what you want rather than what you have
done. It is not in your CV, so I wrote it and isolated it in one place. Confirm it,
reword it, or set it to an empty string to remove the block.

Two independent reviewers also recommended adding, near the top:

- the role you are targeting,
- whether you are open to relocation or remote,
- your work-authorisation status,
- when you are available.

I did not invent any of that. If you want it, add fields to `site` and I can surface them
in the hero.

## 2. Screenshots or figures for the Strategy and Odra Labs work

Three of the four featured case studies have no image. A design review called this the
single weakest thing about the Selected Work section, and it is right: prose about a
visualization is much weaker than the visualization.

What would help most, in order:

1. **Gantt visualization** — one screenshot, even with data blurred or replaced by dummy
   values. This is your most concrete "shipped to customers" evidence and currently has
   no picture.
2. **Agentic AI platform** — a sanitised sequence or architecture sketch of the caching /
   recommendation / follow-up flow. I deliberately left `architecture: null` rather than
   guess at components I could not evidence.
3. **HermesFix** — a before/after of a repaired site, or the agent's diagnosis output.

Drop files into `public/work/` and add an `images: [{ src, alt, caption }]` array to the
relevant entry in `src/content/projects.ts`; I can wire the rendering.

Check what you are permitted to publish from Strategy first.

## 3. Metrics you can attribute to yourself

Recruiter review, verbatim: *"'used by thousands of organizations' is the reach of
Strategy's platform, not demonstrated usage or impact of Adam's feature."*

I rewrote that line to make the distinction explicit, but the section would be much
stronger with anything measurable that is **yours**:

- adoption or usage of the Gantt component specifically,
- latency, cost-per-query or cache-hit-rate change from the QA caching work,
- how much time the local test harness saved per iteration,
- any evaluation lift on the agentic platform features.

Approximate or relative figures are fine ("cut iteration time from ~8 minutes to under a
second"). Do not invent precision. If everything is confidential, say so on the page —
that is itself credible.

## 4. A photograph

`About` currently has no image. A single good portrait would do a lot for a section whose
job is to make you a person rather than a CV. 3:4 or 1:1, ideally natural light, not a
LinkedIn headshot crop. Put it in `public/` and tell me.

## 5. Scholar metrics have a date on them

`src/content/site.ts` → `scholarMetrics` is `55` citations, h-index `4`, marked
`asOf: "2026-08"`. The page displays that date, so the number ages honestly rather than
silently becoming false. Update both when you refresh it.

## 6. Two things I corrected — please sanity-check them

Both came out of an independent academic review and I verified each against a primary
source before changing anything.

1. **UAI 2026 is published, not just accepted.** Your CV says "accepted"; the paper is in
   PMLR 337:3143–3161, and I have linked the proceedings page, the PDF and the
   OpenReview record. Your CV should be updated too.
2. **The CV PDF said "accepted" too, and has been rebuilt.** The site and the PDF
   contradicted each other on the single most impressive fact in either. The LaTeX source
   at `~/Documents/CV/` now reads `UAI 2026 (PMLR 337:3143--3161), ICLP 2026 (accepted)`,
   the phone number has been removed from the header, and `feilaz.github.io` added in its
   place — so the PDF now points at the fuller artifact instead of competing with it. The
   originals are backed up in `~/Documents/CV/.backup/`. Rebuild with:
   `latexmk -pdf adam_kostka_ai_software_engineering_cv_final.tex`, then copy the result
   to `public/adam-kostka-cv.pdf`.

3. **A claim in the QUORUM demonstration had become false.** It used to assert that
   Iceland has no mosquito population. Mosquitoes were confirmed in Iceland in October
   2025, so I replaced that round with a claim about Venus's rotation period, which is
   stable. **Lesson worth keeping in mind: any factual claim baked into the site can
   expire.** The three current claims are the Danube's ten countries, Everest vs
   Chimborazo, and Venus's day versus its year.

## 7. Fig. 1 replaced the decorative swarm

The hero figure now demonstrates the thesis instead of decorating it: 500 agents on a
one-dimensional answer space, one slider for how alike they are, and two readouts that
rise together. It performs itself once on arrival, then hands over control, and the shared
bias changes sign and size per visit so it is not the same picture twice.

If you want to tune it, everything is in `DEFAULT`-style constants at the top of
`src/components/agents/consensusField.ts` and `ConsensusFigure.tsx`:
`DEMO_TARGET` (where the automatic sweep lands), `DEMO_DURATION`, the agent count in
`ConsensusFigure`, and the bias magnitude in the `ConsensusField` constructor.

## 8. Things I deliberately did not build

- **Any architecture diagram I could not evidence.** Only the UAI verification pipeline
  has one, because only that one is described in a source I could read. The rest render
  without a diagram rather than with a plausible invention.
- **The "Shepherd" swarm easter egg.** See the final report for the reasoning; briefly,
  three reviewers independently said the page is already too long, and a second
  interactive toy would dilute QUORUM rather than add to it.
- **Any claim about team size, seniority, or scope at Strategy.** Your CV does not state
  these, and reviewers asked for them. Tell me and I will add them.

## 9. Set the real domain

`src/content/site.ts` → `site.url` is `https://adamkostka.com`. It feeds canonical URLs,
the sitemap, `robots.txt` and Open Graph. Change it before deploying, or those will all
point at the wrong host.
