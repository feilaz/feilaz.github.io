/**
 * Site-level facts and links.
 *
 * SOURCE OF TRUTH: /Users/adam/Documents/CV/adam_kostka_ai_software_engineering_cv_final.tex
 * Every claim in this file is traceable to that CV or to a paper source file.
 * Do not add unsourced numbers, employers, awards or outcomes here.
 */

export const site = {
  name: "Adam Kostka",
  /** Kept short enough to read as a single thought in the hero. */
  role: "AI Engineer · LLM Agents & Software Engineering",
  location: "Warsaw, Poland",
  /** Set this once the real domain exists; used for canonical URLs and OG. */
  url: "https://feilaz.github.io",
  email: "adamkostka002@gmail.com",
  academicEmail: "adam.kostka.stud@pw.edu.pl",
  orcid: "0009-0004-8174-2109",

  /**
   * Hero eyebrow. Deliberately does not repeat "AI Engineer", which the subline
   * already carries — the eyebrow's job is to name the subject matter instead.
   */
  eyebrow: "Multi-agent systems · Agent reliability · Warsaw, Poland",

  /**
   * The one-line positioning. Written to work for four different readers:
   * a recruiter skimming, a professor checking rigour, an engineer looking
   * for depth, and someone who arrived from a paper.
   */
  headline: "I build multi-agent AI systems, and I study how they fail.",

  /**
   * Hero sub-line. Concrete, checkable, no adjectives.
   * Both halves are verifiable from the CV.
   */
  subline:
    "AI Engineer at Strategy (NASDAQ: MSTR), shipping LLM-agent features on an enterprise BI platform. Author of eight peer-reviewed papers on multi-agent reliability.",

  /** NOW block — two short factual statements, no marketing voice. */
  now: [
    "At **Strategy** I ship customer-facing features and LLM-agent systems on a business-intelligence platform used by thousands of organizations — across Python, TypeScript, Java and AWS.",
    "In research I work on **multi-agent LLM reliability**: what happens when several models agree, why agreement is weak evidence of correctness, and how to put statistical guarantees around it. My most recent paper was published at **UAI 2026**.",
  ],

  /**
   * NEEDS ADAM'S CONFIRMATION — this is the one statement on the site about his
   * intentions rather than his record, and it is not sourced from the CV. It lives here
   * so it can be corrected or deleted in one place. See /CONTENT-TODO.md.
   */
  availability:
    "I am interested in research collaboration on agent reliability, and in engineering roles where both halves of this page are useful.",

  links: {
    cv: {
      label: "CV",
      href: "/adam-kostka-cv.pdf",
      external: false,
    },
    github: {
      label: "GitHub",
      href: "https://github.com/feilaz",
      external: true,
    },
    scholar: {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=p_WsjpcAAAAJ&hl=en",
      external: true,
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/adam-kostka-eng/",
      external: true,
    },
    email: {
      label: "Email",
      href: "mailto:adamkostka002@gmail.com",
      external: true,
    },
  },
} as const;

/**
 * Hero destinations.
 *
 * The CV PDF is deliberately NOT here. This page is the CV — a fuller one than the PDF,
 * with the work, the papers and a working demonstration — so leading with "download a
 * worse version of what you are looking at" was the wrong first action. Contact is.
 * The PDF remains one click away in the footer, for forwarding and for ATS uploads.
 */
export const primaryLinks = [
  site.links.email,
  site.links.github,
  site.links.scholar,
  site.links.linkedin,
] as const;

/**
 * Scholar metrics. SOURCE: CV ("55 citations, h-index 4").
 * `asOf` exists so this never silently becomes a stale claim.
 */
export const scholarMetrics = {
  citations: 55,
  hIndex: 4,
  asOf: "2026-08",
  source: site.links.scholar.href,
} as const;

/**
 * Sections, each with a stated purpose.
 *
 * `purpose` is rendered under the section label. It exists because a visitor should never
 * have to infer why a section is there or what they get from reading it — the site has two
 * very different audiences and each needs to see which parts are for them.
 */
export const sections = [
  {
    id: "now",
    label: "Now",
    index: "01",
    purpose: "What I am doing at the moment, and where to go next.",
  },
  {
    id: "research",
    label: "Research",
    index: "02",
    purpose: "The problem I work on, with a 60-second demonstration of it.",
  },
  {
    id: "work",
    label: "Work",
    index: "03",
    purpose: "Four things I built, and which part of each was actually hard.",
  },
  {
    id: "publications",
    label: "Publications",
    index: "04",
    purpose: "The complete record, with a link to every paper.",
  },
  {
    id: "experience",
    label: "Experience",
    index: "05",
    purpose: "Roles, education and awards, in order.",
  },
  {
    id: "about",
    label: "About",
    index: "06",
    purpose: "The person, rather than the record.",
  },
] as const;

export type SectionId = (typeof sections)[number]["id"];

/** Look up a section's stated purpose by id. */
export function sectionPurpose(id: SectionId): string {
  return sections.find((s) => s.id === id)?.purpose ?? "";
}

/**
 * Three explicit routes through the page.
 *
 * The site has to serve a recruiter with sixty seconds and a professor with twenty
 * minutes. Rather than compromising the order for both, it states plainly which parts are
 * for whom and lets each reader skip the rest.
 */
export const readerPaths = [
  {
    label: "Hiring",
    href: "#work",
    reason:
      "four case studies, each with the problem, my part in it, and the difficult bit.",
  },
  {
    label: "Reviewing the research",
    href: "#publications",
    reason: "eight peer-reviewed papers, every one linked to its proceedings or preprint.",
  },
  {
    label: "Only got a minute",
    href: "#research",
    reason:
      "the demonstration in Research is the shortest honest account of what I work on.",
  },
] as const;
