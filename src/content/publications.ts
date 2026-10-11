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
 *   2026-10  ICLP proceedings metadata and UAI implementation links added.
 *            Custom summaries now distinguish within-tuple scoring from agent votes.
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
  abstract: string;
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
    doi?: string;
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
      "A method for selecting factual claims from LLM-based multi-agent systems under a chosen error budget. It penalizes variation in a weak judge’s claim-support scores within each query–response tuple, then uses Learn-Then-Test to calibrate the selection threshold.",
    findings: [
      "Score Deviation penalizes within-tuple variation in weak-judge claim-support scores. Learn-Then-Test calibrates a threshold that bounds the expected false discovery rate.",
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
      { label: "Code", href: "https://github.com/feilaz/uai2026-score-deviation" },
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
    // Abstract: https://arxiv.org/abs/2607.21210 (verified 2026-10-11).
    abstract:
      "Existing approaches to multi-agent belief combination have established mature foundations for combining uncertain beliefs under common assumptions: consensus methods use iterative averaging, logic-based methods resolve conflicting knowledge bases, and epistemic logic analyzes agents' information states. Typically, these approaches assume that the structure determining what each agent can represent remains fixed. However, in many scenarios, agents gain or lose observational capacity during execution, and what was once admissible may become structurally impossible. This paper presents a formal framework for handling such runtime changes in epistemic partitions over continuous belief profiles. A hybrid approach exploits the advantages of answer set programming in elaboration tolerance, declarative integrity constraints, and explanations, with the numerical flexibility of Python. The framework applies to domains where agents operate at heterogeneous and possibly changing levels of resolution, and provides formal guarantees of admissibility preservation under refinement, unique mass-preserving repair under coarsening, and explanation completeness. Evaluation across 100 randomly generated topology changes confirms complete violation detection and explanation coverage.",
    summary:
      "A hybrid ASP–Python framework for maintaining and repairing beliefs when agents gain or lose the ability to distinguish states. It provides formal guarantees for these updates and explanations of constraint violations.",
    findings: [
      "Provides formal guarantees of admissibility preservation under refinement, unique mass-preserving repair under coarsening, and explanation completeness.",
    ],
    topics: ["belief revision", "logic", "multi-agent systems"],
    links: [{ label: "Proceedings", href: "https://doi.org/10.4204/EPTCS.450.39" }, { label: "arXiv", href: "https://arxiv.org/abs/2607.21210" }],
    citation: { volume: "450", pages: "529--543", series: "Electronic Proceedings in Theoretical Computer Science", doi: "10.4204/EPTCS.450.39", note: "Technical Communication" },
    source: "arxiv.org/abs/2607.21210; doi.org/10.4204/EPTCS.450.39",
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
    // Abstract: https://api.crossref.org/works/10.3390/knowledge6030017 (verified 2026-10-11).
    abstract:
      "Large Language Models have rapidly advanced, enabling composite multi-agent systems capable of sophisticated text-based collaboration. In domains that demand coordinated reasoning, teams of agents can combine complementary strengths to produce better results than a single model. In practice, multi-agent decision making faces recurring shortcomings: agents frequently operate with poorly grounded or outdated knowledge, they seldom represent peers’ beliefs and intentions in a disciplined manner, and their conclusions are rarely checked against explicit logical constraints. These gaps reduce coherence, hinder dependable cooperation, and make the reasoning chain difficult to explore, often manifesting their black-box nature. How can a practical MAS architecture be designed to ground agents with relevant information, support explicit modelling of collaborators’ beliefs, and validate outputs against formal rules? How can the individual and synergized contributions of these mechanisms be measured across multiple case studies? To explore these questions, we present a purpose-built experimental platform. The system integrates a retrieval-augmented generation pipeline to ground agents in relevant materials, a Theory of Mind module that makes agent beliefs explicit, and an LLM-based logic auditor that evaluates outputs against an explicit rule set. Applied to diverse text-based decision-support and coordination case studies, the platform and protocol provide a reproducible blueprint for investigating how grounding, social reasoning, and logic validation together improve multi-agent collaboration. In doing so, this study contributes to the field of artificial intelligence by offering a structured approach to building, testing, and refining multi-agent architectures that balance knowledge grounding, perspective modelling, and reasoning validation.",
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
    // Abstract: https://arxiv.org/abs/2507.21969 (verified 2026-10-11).
    abstract:
      "Recently, the field of Multi-Agent Systems (MAS) has gained popularity as researchers are trying to develop artificial intelligence capable of efficient collective reasoning. Agents based on Large Language Models (LLMs) perform well in isolated tasks, yet struggle with higher-order cognition required for adaptive collaboration. Human teams achieve synergy not only through knowledge sharing, but also through recursive reasoning, structured critique, and the ability to infer others' mental states. Current artificial systems lack these essential mechanisms, limiting their ability to engage in sophisticated collective reasoning. This work explores cognitive processes that enable effective collaboration, focusing on adaptive theory of mind (ToM) and systematic critical evaluation. We investigate three key questions. First, how does the ability to model others' perspectives enhance coordination and reduce redundant reasoning? Second, to what extent does structured critique improve reasoning quality by identifying logical gaps and mitigating biases? Third, the interplay of these mechanisms can lead to emergent cognitive synergy, where the collective intelligence of the system exceeds the sum of its parts. Through an empirical case study on complex decision making, we show that the integration of these cognitive mechanisms leads to more coherent, adaptive, and rigorous agent interactions. This article contributes to the field of cognitive science and AI research by presenting a structured framework that emulates human-like collaborative reasoning MAS. It highlights the significance of dynamic ToM and critical evaluation in advancing multi-agent systems' ability to tackle complex, real-world challenges.",
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
    authors: ["Jarosław A. Chudziak", "Adam Kostka"],
    venue: "Artificial Intelligence in Education",
    venueShort: "AIED 2025",
    year: 2025,
    kind: "conference",
    status: "published",
    // Abstract: https://link.springer.com/chapter/10.1007/978-3-031-98465-5_58 (verified 2026-10-11).
    abstract:
      "The growing ubiquity of artificial intelligence (AI), in particular large language models (LLMs), has profoundly altered the way in which learners gain knowledge and interact with learning material, with many claiming that AI positively influences their learning achievements. Despite this advancement, current AI tutoring systems face limitations associated with their reactive nature, often providing direct answers without encouraging deep reflection or incorporating structured pedagogical tools and strategies. This limitation is most apparent in the field of mathematics, in which AI tutoring systems remain underdeveloped. This research addresses the question: How can AI tutoring systems move beyond providing reactive assistance to enable structured, individualized, and tool-assisted learning experiences? We introduce a novel multi-agent AI tutoring platform that combines adaptive and personalized feedback, structured course generation, and textbook knowledge retrieval to enable modular, tool-assisted learning processes. This system allows students to learn new topics while identifying and targeting their weaknesses, revise for exams effectively, and practice on an unlimited number of personalized exercises. This article contributes to the field of artificial intelligence in education by introducing a novel platform that brings together pedagogical agents and AI-driven components, augmenting the field with modular and effective systems for teaching mathematics.",
    summary:
      "A tutoring platform that adapts to the individual learner rather than serving a fixed curriculum. The work is about the system design needed to make personalisation and adaptivity operate together in practice.",
    topics: ["education", "multi-agent systems"],
    citation: {
      volume: "15882",
      pages: "462--469",
      series: "Lecture Notes in Computer Science",
      publisher: "Springer Nature Switzerland",
      doi: "10.1007/978-3-031-98465-5_58",
      note: "AIED 2025, short paper",
    },
    links: [
      {
        label: "Springer",
        href: "https://link.springer.com/chapter/10.1007/978-3-031-98465-5_58",
      },
      {
        label: "Code",
        href: "https://github.com/feilaz/AI_Powered_Math_Tutoring",
      },
      {
        label: "arXiv",
        href: "https://arxiv.org/abs/2507.12484",
      },
    ],
    source: "Springer DOI 10.1007/978-3-031-98465-5_58; author order and metadata verified 2026-10-04",
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
    // Abstract: https://link.springer.com/chapter/10.1007/978-3-032-09318-9_2 (verified 2026-10-11).
    abstract:
      "LLM-based MAS are gaining popularity due to their potential for collaborative problem-solving enhanced by advances in natural language comprehension, reasoning, and planning. Research in Theory of Mind (ToM) and Belief-Desire-Intention (BDI) models has the potential to further improve the agent’s interaction and decision-making in such systems. However, collaborative intelligence in dynamic worlds remains difficult to accomplish since LLM performance in multi-agent worlds is extremely variable. Simply adding cognitive mechanisms like ToM and internal beliefs does not automatically result in improved coordination. The interplay between these mechanisms, particularly in relation to formal logic verification, remains largely underexplored in different LLMs. This work investigates: How do internal belief mechanisms, including symbolic solvers and Theory of Mind, influence collaborative decision-making in LLM-based multi-agent systems, and how does the interplay of those components influence system accuracy? We introduce a novel multi-agent architecture integrating ToM, BDI-style internal beliefs, and symbolic solvers for logical verification. We evaluate this architecture in a resource allocation problem with various LLMs and find an intricate interaction between LLM capabilities, cognitive mechanisms, and performance. This work contributes to the area of AI by proposing a novel multi-agent system with ToM, internal beliefs, and symbolic solvers for augmenting collaborative intelligence in multi-agent systems and evaluating its performance under different LLM settings.",
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
    // Abstract: https://aclanthology.org/2024.paclic-1.19.pdf (verified 2026-10-11).
    abstract:
      "This paper explores the integration of advanced Multi-Agent Systems (MAS) techniques to develop a team of agents with enhanced logical reasoning, long-term knowledge retention, and Theory of Mind (ToM) capabilities. By uniting these core components with optimized communication protocols, we create a novel framework called SynergyMAS, which fosters collaborative teamwork and superior problem-solving skills. The system’s effectiveness is demonstrated through a product development team case study, where our approach significantly enhances performance and adaptability. These findings highlight SynergyMAS’s potential to tackle complex, real-world challenges.",
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
  const key = `kostka${p.year}${p.id.replaceAll("-", "")}`;
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
    ["doi", p.citation?.doi ? `{${p.citation.doi}}` : undefined],
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
