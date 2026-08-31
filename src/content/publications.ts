/**
 * Publications.
 *
 * Every entry is traceable to a primary source:
 *   - titles/authors/abstracts: the paper's own LaTeX source, or the publisher page
 *   - venues/links: the publisher's own record, verified individually
 *
 * `abstract` is verbatim where marked. `summary` is a plain-language gloss that
 * introduces no finding or number absent from the paper.
 *
 * CORRECTION LOG — kept because a portfolio that cites research has to be auditable:
 *   2026-08  UAI 2026 was listed as "accepted". It appeared in PMLR 337:3143–3161 in
 *            August 2026 and is now marked published, with the proceedings page, the
 *            PDF and the OpenReview record linked. Stale status on a flagship paper is
 *            exactly the kind of error an academic reader notices first.
 *   2026-08  ICLP 2026 was also listed as "accepted"; it is published. No proceedings
 *            landing page was indexed when this was corrected, so the arXiv preprint
 *            remains the linked artifact — add the proceedings URL when it appears.
 */

export type Topic =
  | "multi-agent systems"
  | "uncertainty"
  | "verification"
  | "theory of mind"
  | "belief revision"
  | "logic"
  | "retrieval"
  | "education"
  | "evaluation";

/** Venue class, shown explicitly so eight papers are not presented as interchangeable. */
export type VenueKind =
  | "conference"
  | "journal"
  | "workshop"
  | "technical communication";

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  venueShort: string;
  year: number;
  kind: VenueKind;
  status: "published" | "accepted";
  /** Verbatim abstract from the paper or publisher record. */
  abstract?: string;
  /** Plain-language gloss. Faithful to the abstract, no invented findings. */
  summary: string;
  /** Short factual statements. Numbers appear only if they appear in the paper. */
  findings?: string[];
  topics: Topic[];
  links: { label: string; href: string }[];
  /** Citation detail, where the publisher provides it. */
  citation?: {
    volume?: string;
    pages?: string;
    series?: string;
    publisher?: string;
    editor?: string;
    note?: string;
  };
  featured?: boolean;
  source: string;
}

export const publications: Publication[] = [
  {
    id: "uai-2026-hallucination-risk",
    title:
      "Controlling Uncertainty and Hallucination Risk in Multi-Agent Fact Verification",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "Proceedings of the 42nd Conference on Uncertainty in Artificial Intelligence",
    venueShort: "UAI 2026",
    year: 2026,
    kind: "conference",
    status: "published",
    abstract:
      "Multi-agent language systems are increasingly relied upon for high-stakes decision support. Many systems use consensus among agents as a measure of confidence. However, such a model is prone to failure if aligned agents have the same biases and propagate the same error. Under sycophantic consensus, correlated errors resemble strong agreement, and hallucination manifests as a consequence of uncalibrated uncertainty. While current measures provide useful heuristics, they lack statistical safety bounds at deployment time. This work reinterprets hallucination control as an uncertainty quantification problem. We contribute a Score Deviation penalty that directly lowers confidence when the factual disagreement within the ensemble rises. A Learn-Then-Test calibration procedure converts these penalized scores into a certified decision threshold that provably bounds the expected False Discovery Rate. The results show that this deviation-penalized method reduces the conservatism of the calibration process, achieving 71.7% recall compared to 47.4% for naive baselines at a strict 2% risk budget.",
    summary:
      "Multi-agent systems often treat agreement between agents as evidence that an answer is correct. This paper shows why that breaks — models trained similarly make the same mistakes, so confident agreement and correlated error look identical — and replaces the heuristic with a calibrated procedure carrying a provable bound on the expected false discovery rate.",
    findings: [
      "Adding more agents can increase confidence in false outputs without improving accuracy, because LLM errors are not independent.",
      "A Score Deviation penalty lowers confidence as factual disagreement inside the ensemble rises; Learn-Then-Test converts the penalised scores into a certified threshold that bounds the expected False Discovery Rate.",
      "At a strict 2% risk budget the method reaches 71.7% recall, against 47.4% for unpenalised baselines.",
    ],
    topics: ["multi-agent systems", "uncertainty", "verification"],
    links: [
      { label: "Proceedings", href: "https://proceedings.mlr.press/v337/kostka26a.html" },
      {
        label: "PDF",
        href: "https://raw.githubusercontent.com/mlresearch/v337/main/assets/kostka26a/kostka26a.pdf",
      },
      { label: "OpenReview", href: "https://openreview.net/forum?id=emSpdVic7M" },
    ],
    citation: {
      volume: "337",
      pages: "3143--3161",
      series: "Proceedings of Machine Learning Research",
      publisher: "PMLR",
      editor: "Emilija Perković and Daniel Malinsky",
    },
    featured: true,
    source: "proceedings.mlr.press/v337/kostka26a.html (verified 2026-08-27)",
  },
  {
    id: "iclp-2026-belief-harmonization",
    title: "Explainable Belief Harmonization under Dynamic Epistemic Partitions",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "International Conference on Logic Programming",
    venueShort: "ICLP 2026",
    year: 2026,
    kind: "technical communication",
    status: "published",
    summary:
      "When several reasoners disagree, some of that disagreement is noise and some is structural — they simply cannot represent the same distinctions. This work builds an aggregation rule that tells the two apart, reconciling beliefs where reconciliation is meaningful and leaving principled disagreement intact where it is not.",
    findings: [
      "Provides formal guarantees of admissibility preservation under refinement, unique mass-preserving repair under coarsening, and explanation completeness.",
    ],
    topics: ["belief revision", "logic", "multi-agent systems"],
    links: [{ label: "arXiv", href: "https://arxiv.org/abs/2607.21210" }],
    citation: { note: "Technical Communication" },
    source:
      "arxiv.org/abs/2607.21210; venue and published status per the author. No proceedings\n" +
      "      landing page was indexed at the time of writing, so the preprint is the linked artifact.",
  },
  {
    id: "knowledge-tom-logic-retrieval",
    title:
      "Exploring the Interplay of Theory of Mind, Logic Validation, and Advanced Retrieval in LLM-Based Multi-Agent Systems",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "Knowledge",
    venueShort: "Knowledge (MDPI)",
    year: 2026,
    kind: "journal",
    status: "published",
    summary:
      "A study of what three capabilities contribute when combined inside one multi-agent system: a retrieval-augmented pipeline that grounds agents in source material, a Theory of Mind module that makes agent beliefs explicit, and an LLM-based logic auditor that checks outputs against an explicit rule set.",
    topics: ["multi-agent systems", "theory of mind", "logic", "retrieval"],
    links: [{ label: "MDPI", href: "https://www.mdpi.com/2673-9585/6/3/17" }],
    citation: { volume: "6", pages: "17", publisher: "MDPI" },
    source: "mdpi.com/2673-9585/6/3/17 (verified 2026-08-27)",
  },
  {
    id: "skilled-llms-2026-epistemic-harmonization",
    title:
      "Epistemically-Constrained Belief Harmonization: Integrating Symbolic Structure with Probabilistic Consensus",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue:
      "Workshop on Logic, Learning, Ethical Decisions and LLMs (SKILLED-LLMs), co-located with FLoC 2026",
    venueShort: "SKILLED-LLMs @ FLoC 2026",
    year: 2026,
    kind: "workshop",
    status: "published",
    abstract:
      "Aggregating inconsistent judgments from multiple reasoners is a long-standing problem in artificial intelligence, with mature foundations in consensus theory, belief pooling, and epistemic logic. The topic has gained renewed significance with the rise of LLM ensembles, where the judgments of specialist LLMs, retrieval-augmented agents, and judge models often diverge even on factual matters. The core problem is that such divergent judgments usually reflect differences in the information sources accessed, not random noise. How can an aggregation rule recognize this distinction and reconcile beliefs without forcing agents that cannot represent the same fine-grained truth to converge? In this paper, we propose a symbolic-probabilistic framework that unites symbolic epistemic structure with probabilistic belief dynamics. Agents maintain probability distributions constrained by their epistemic partitions, while a critic agent computes a dynamic target belief and specialists shift only toward epistemic projections of that target. The framework supports a convergence guarantee and provides a diagnostic interpretation of the remaining disagreement.",
    summary:
      "A symbolic-probabilistic framework in which each agent holds a probability distribution constrained by what it is actually able to represent. A critic agent computes a moving target belief, and specialists move only toward the part of that target they can express — which yields a convergence guarantee and makes leftover disagreement diagnostic rather than noise.",
    findings: [
      "Divergent judgments between LLM reasoners usually reflect differences in the information each can access, not random noise.",
      "Constraining belief updates to each agent's epistemic partition supports a convergence guarantee while preserving irreducible disagreement.",
    ],
    topics: ["belief revision", "logic", "multi-agent systems"],
    links: [{ label: "CEUR-WS", href: "https://ceur-ws.org/Vol-4229/paper16.pdf" }],
    citation: { volume: "4229", series: "CEUR Workshop Proceedings", publisher: "CEUR-WS" },
    source: "ceur-ws.org/Vol-4229/paper16.pdf (verified 2026-08-27)",
  },
  {
    id: "cogsci-2025-cognitive-synergy",
    title:
      "Towards Cognitive Synergy in LLM-Based Multi-Agent Systems: Integrating Theory of Mind and Critical Evaluation",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "Annual Meeting of the Cognitive Science Society",
    venueShort: "CogSci 2025",
    year: 2025,
    kind: "conference",
    status: "published",
    summary:
      "Examines the cognitive processes that make collaboration work in a multi-agent LLM system, focusing on adaptive theory of mind and systematic critical evaluation — in particular whether modelling other agents' perspectives improves coordination and reduces redundant reasoning.",
    topics: ["multi-agent systems", "theory of mind", "evaluation"],
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2507.21969" },
      {
        label: "Semantic Scholar",
        href: "https://www.semanticscholar.org/paper/Towards-Cognitive-Synergy-in-LLM-Based-Multi-Agent-Kostka-Chudziak/b010b21dd14feac2997b5f68cb21f83611df10ad",
      },
    ],
    source: "arxiv.org/abs/2507.21969; venue per stypendium PW/publikacje.txt",
  },
  {
    id: "aied-2025-math-tutoring",
    title:
      "AI-Powered Math Tutoring: Platform for Personalized and Adaptive Education",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "International Conference on Artificial Intelligence in Education",
    venueShort: "AIED 2025",
    year: 2025,
    kind: "conference",
    status: "published",
    summary:
      "A tutoring platform that adapts to the individual learner rather than serving a fixed curriculum. The work is about the system design needed to make personalisation and adaptivity operate together in practice.",
    topics: ["education", "multi-agent systems"],
    links: [
      {
        label: "Springer",
        href: "https://link.springer.com/chapter/10.1007/978-3-031-98465-5_58",
      },
    ],
    source: "stypendium PW/publikacje.txt",
  },
  {
    id: "iccci-2025-tom-internal-beliefs",
    title:
      "Evaluating Theory of Mind and Internal Beliefs in LLM-Based Multi-Agent Systems",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue: "International Conference on Computational Collective Intelligence",
    venueShort: "ICCCI 2025",
    year: 2025,
    kind: "conference",
    status: "published",
    summary:
      "Introduces a multi-agent architecture combining theory of mind, BDI-style internal beliefs and symbolic solvers for logical verification, then evaluates it on a resource-allocation problem across several LLMs to see how model capability and cognitive mechanism interact.",
    topics: ["multi-agent systems", "theory of mind", "evaluation"],
    links: [
      { label: "arXiv", href: "https://arxiv.org/abs/2603.00142" },
      {
        label: "Springer",
        href: "https://link.springer.com/chapter/10.1007/978-3-032-09318-9_2",
      },
    ],
    source: "arxiv.org/abs/2603.00142; venue per stypendium PW/publikacje.txt",
  },
  {
    id: "paclic-38-synergymas",
    title:
      "Synergizing Logical Reasoning, Knowledge Management and Collaboration in Multi-Agent LLM System",
    authors: ["Adam Kostka", "Jarosław A. Chudziak"],
    venue:
      "Pacific Asia Conference on Language, Information and Computation (PACLIC 38)",
    venueShort: "PACLIC 38",
    year: 2024,
    kind: "conference",
    status: "published",
    summary:
      "The first system in this line of work: a multi-agent LLM architecture bringing a logical reasoning layer, long-term knowledge retention and explicit collaboration into one pipeline. Presented in Tokyo in December 2024.",
    topics: ["multi-agent systems", "logic", "retrieval"],
    links: [
      { label: "ACL Anthology", href: "https://aclanthology.org/2024.paclic-1.19/" },
      { label: "arXiv", href: "https://arxiv.org/abs/2507.02170" },
    ],
    source: "aclanthology.org/2024.paclic-1.19; stypendium PW/publikacje.txt",
  },
];

export const publicationsByRecency = [...publications].sort(
  (a, b) => b.year - a.year,
);

export const allTopics: Topic[] = Array.from(
  new Set(publications.flatMap((p) => p.topics)),
).sort() as Topic[];

export const featuredPublication = publications.find((p) => p.featured)!;

/** Counts by venue class, so the page can state the distribution rather than a total. */
export const venueBreakdown = publications.reduce<Record<VenueKind, number>>(
  (acc, p) => {
    acc[p.kind] = (acc[p.kind] ?? 0) + 1;
    return acc;
  },
  {} as Record<VenueKind, number>,
);

/** BibTeX built from the recorded fields. Nothing is invented; absent fields are omitted. */
export function toBibTeX(p: Publication): string {
  const key = `kostka${p.year}${p.id.split("-").pop()}`;
  const journal = p.kind === "journal";
  const rows: [string, string | undefined][] = [
    ["title", `{${p.title}}`],
    ["author", `{${p.authors.join(" and ")}}`],
    [journal ? "journal" : "booktitle", `{${p.venue}}`],
    ["year", `{${p.year}}`],
    ["volume", p.citation?.volume ? `{${p.citation.volume}}` : undefined],
    ["pages", p.citation?.pages ? `{${p.citation.pages}}` : undefined],
    ["series", p.citation?.series ? `{${p.citation.series}}` : undefined],
    ["editor", p.citation?.editor ? `{${p.citation.editor}}` : undefined],
    ["publisher", p.citation?.publisher ? `{${p.citation.publisher}}` : undefined],
    ["url", p.links[0] ? `{${p.links[0].href}}` : undefined],
    ["note", p.citation?.note ? `{${p.citation.note}}` : undefined],
  ];
  const width = Math.max(
    ...rows.filter(([, v]) => v !== undefined).map(([k]) => k.length),
  );
  const body = rows
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `  ${k.padEnd(width)} = ${v},`)
    .join("\n");
  return `@${journal ? "article" : "inproceedings"}{${key},\n${body}\n}`;
}
