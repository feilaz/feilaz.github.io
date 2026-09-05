/**
 * Selected work.
 *
 * SOURCE OF TRUTH: the CV (adam_kostka_ai_software_engineering_cv_final.tex) and, for
 * the research system, the UAI 2026 paper.
 *
 * Architecture diagrams appear only where the components are evidenced by a source.
 * Where none could be evidenced, `architecture` is null and the case study renders
 * without a diagram rather than inventing one.
 *
 * ORDERING NOTE: the production LLM-agent work precedes the visualization work. An
 * independent recruiter review flagged that leading with a D3 Gantt chart, under a
 * headline claiming LLM-agent engineering, created a credibility gap.
 *
 * NEEDS ADAM'S INPUT — see /CONTENT-TODO.md
 */

export interface DiagramNode {
  id: string;
  label: string;
  /** Visual weight, not decoration: `primary` nodes are the contribution. */
  kind: "input" | "agent" | "process" | "primary" | "output" | "store";
  note?: string;
  /** Grid position: column, row. Hand-placed so diagrams read like figures. */
  col: number;
  row: number;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** A dashed edge marks a feedback or control path rather than data flow. */
  dashed?: boolean;
}

export interface Architecture {
  caption: string;
  cols: number;
  rows: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  source: string;
}

export interface Project {
  id: string;
  name: string;
  oneLiner: string;
  role: string;
  org: string;
  period: string;
  status: "shipped" | "in development" | "prototype" | "research code";
  kind: "product" | "research" | "platform";
  problem: string;
  approach: string[];
  contribution: string[];
  technical?: { decision: string; rationale: string }[];
  stack: string[];
  architecture: Architecture | null;
  links: { label: string; href: string }[];
  featured?: boolean;
  source: string;
}

export const projects: Project[] = [
  {
    id: "certified-multi-agent-verification",
    name: "Certified Multi-Agent Fact Verification",
    oneLiner: "Statistical guarantees for systems that use agent agreement as confidence",
    role: "First author; designed the method, implementation and experiments",
    org: "Warsaw University of Technology",
    period: "2026",
    status: "research code",
    kind: "research",
    featured: true,
    problem:
      "Multi-agent LLM systems routinely treat agreement between agents as a proxy for confidence. That proxy fails in a specific and dangerous way: because frontier models share training data and alignment procedures, their errors are correlated, so a confident consensus and a shared hallucination are indistinguishable from the outside. Deployments in high-stakes settings need more than a heuristic — they need a bound.",
    approach: [
      "Reframe hallucination control as uncertainty quantification rather than as prompt or architecture design.",
      "Establish the query–response tuple as the correct exchangeable unit for long-form multi-agent generation, so risk control applies at the right granularity.",
      "Add a Score Deviation penalty that reduces confidence as factual disagreement inside the ensemble rises, then run Learn-Then-Test calibration to turn penalised scores into a threshold with a provable bound on the expected False Discovery Rate.",
    ],
    contribution: [
      "At a strict 2% risk budget the deviation-penalised method reaches 71.7% recall, against 47.4% for unpenalised baselines — it keeps far more true claims at the same certified risk level.",
      "Avoided degenerate thresholds in the reported strict-risk evaluation, where naive calibration often abstained on almost everything.",
      "An ablation across scoring methods reveals a U-shaped entropy–error relationship, explaining why penalties targeting sycophancy alone are suboptimal.",
      "Published at UAI 2026 (PMLR 337:3143–3161).",
    ],
    technical: [
      {
        decision: "Risk control at the tuple level rather than per generated claim",
        rationale:
          "Long-form answers pack several factual assertions into one context, which violates the independence assumptions that per-claim conformal methods rely on.",
      },
      {
        decision: "A penalty on claim-score spread rather than semantic entropy",
        rationale:
          "Score Deviation uses the spread of the weak judge’s claim scores within a query–response tuple. The U-shaped entropy–error finding comes from a separate scoring ablation; it is not the definition of the deviation penalty.",
      },
      {
        decision: "The guarantee is on expected False Discovery Rate across queries",
        rationale:
          "It is not a per-answer certificate. Being explicit about what the bound does and does not cover matters more than the headline word 'certified'.",
      },
    ],
    stack: ["Python", "Conformal prediction", "Learn-Then-Test", "LLM ensembles"],
    architecture: {
      caption:
        "The verification pipeline. The contribution is the penalty and calibration layer (highlighted): it sits after generation, so it wraps an existing ensemble without retraining anything.",
      cols: 4,
      rows: 3,
      source: "artykuly/UAI26/article/main.tex (abstract and Section 1)",
      nodes: [
        { id: "query", label: "Query", kind: "input", col: 1, row: 2 },
        { id: "a1", label: "Agent", kind: "agent", col: 2, row: 1 },
        { id: "a2", label: "Agent", kind: "agent", col: 2, row: 2 },
        { id: "a3", label: "Agent", kind: "agent", col: 2, row: 3 },
        {
          id: "penalty",
          label: "Score Deviation penalty",
          kind: "primary",
          note: "Confidence falls as ensemble disagreement rises",
          col: 3,
          row: 2,
        },
        {
          id: "calibration",
          label: "Learn-Then-Test",
          kind: "primary",
          note: "Certified threshold, bounded FDR",
          col: 4,
          row: 1,
        },
        {
          id: "decision",
          label: "Accept / abstain",
          kind: "output",
          note: "Under a chosen risk budget α",
          col: 4,
          row: 3,
        },
      ],
      edges: [
        { from: "query", to: "a1" },
        { from: "query", to: "a2" },
        { from: "query", to: "a3" },
        { from: "a1", to: "penalty" },
        { from: "a2", to: "penalty", label: "scores" },
        { from: "a3", to: "penalty" },
        { from: "penalty", to: "calibration" },
        { from: "calibration", to: "decision", label: "threshold" },
      ],
    },
    links: [
      { label: "Proceedings", href: "https://proceedings.mlr.press/v337/kostka26a.html" },
      {
        label: "PDF",
        href: "https://raw.githubusercontent.com/mlresearch/v337/main/assets/kostka26a/kostka26a.pdf",
      },
      { label: "OpenReview", href: "https://openreview.net/forum?id=emSpdVic7M" },
    ],
    source: "artykuly/UAI26/article/main.tex; proceedings.mlr.press/v337/kostka26a.html",
  },
  {
    id: "strategy-agentic-platform",
    name: "Agentic AI Platform Features",
    oneLiner: "Caching, recommendation and follow-up handling for an LLM agent product",
    role: "Feature delivery across backend and API",
    org: "Strategy (NASDAQ: MSTR)",
    period: "May 2025 – present",
    status: "shipped",
    kind: "product",
    featured: true,
    problem:
      "An agentic AI layer over a business-intelligence platform has to answer questions about live enterprise data, stay affordable per query, and hold a coherent thread across a conversation. Each of those is a different engineering problem, and they interact.",
    approach: [
      "Delivered question-answer caching, so repeated questions do not repeatedly pay full inference cost.",
      "Delivered dashboard recommendation workflows, connecting the agent's output to the artefacts a user can act on.",
      "Delivered conversational follow-up handling, so a second question is interpreted in the context of the first.",
      "Made the backend and API changes these features required across Python and OpenAPI services.",
    ],
    contribution: [
      "Three features shipped on Strategy's agentic AI platform: caching, dashboard recommendation and multi-turn follow-up handling.",
      "Changes spanned backend services and public API surface rather than a single component.",
    ],
    stack: ["Python", "OpenAPI", "REST", "LLM agents"],
    architecture: null,
    links: [],
    source: "CV Experience section (Strategy)",
  },
  {
    id: "strategy-gantt-visualization",
    name: "Gantt Visualization for an Enterprise BI Platform",
    oneLiner: "Customer-facing visualization owned end to end, from Figma to release",
    role: "Owned delivery end to end",
    org: "Strategy (NASDAQ: MSTR, formerly MicroStrategy)",
    period: "May 2025 – present",
    status: "shipped",
    kind: "product",
    featured: true,
    problem:
      "Strategy's business-intelligence platform needed a Gantt-chart visualization as a first-class, customer-facing component. Delivering into a large existing visualization library means the work is as much about integration, testing and release discipline as it is about rendering.",
    approach: [
      "Owned architecture, implementation, testing, cross-repository integration and QA coordination for the component.",
      "Built it from an existing Figma design in TypeScript, JavaScript, D3.js and Node.js, then contributed to later refinements of both the design and the specification.",
      "Created a local test harness and AI-assisted development scaffolding that removed the need to rebuild and redeploy the full visualization library on every iteration.",
    ],
    contribution: [
      "Shipped as a first-class component of Strategy's business-intelligence platform. (The platform's reach — thousands of organizations — is the product's, not a measure of this component's adoption.)",
      "The local harness changed the inner development loop for the component from a full library rebuild to direct iteration.",
    ],
    technical: [
      {
        decision: "A local harness that renders the component outside the host platform",
        rationale:
          "Rebuilding and redeploying the whole visualization library per change made iteration prohibitively slow; isolating the component removed that cost from the loop.",
      },
    ],
    stack: ["TypeScript", "JavaScript", "D3.js", "Node.js"],
    architecture: null,
    links: [],
    source: "CV Experience section (Strategy)",
  },
  {
    id: "hermesfix",
    name: "HermesFix",
    oneLiner: "AWS-hosted platform that repairs WooCommerce sites with LLM agents",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "shipped",
    kind: "product",
    featured: true,
    problem:
      "Broken WooCommerce installations are a large, unglamorous and genuinely painful problem for small merchants: diagnosis means reading logs, theme code and plugin interactions, and the cost of hiring a specialist often exceeds the value of the fix.",
    approach: [
      "Co-founded a two-person AI product venture with a senior software engineer, contributing across architecture, implementation and product delivery.",
      "Built and deployed HermesFix, an AWS-hosted platform that diagnoses and repairs WooCommerce sites using LLM agents.",
      "Secured AWS and Google startup credits for the venture.",
    ],
    contribution: [
      "Built and deployed to production on AWS as a two-person team.",
    ],
    stack: ["Python", "LLM agents", "AWS"],
    architecture: null,
    links: [{ label: "hermesfix.com", href: "https://hermesfix.com/" }],
    source: "CV Experience section (Odra Labs)",
  },
  {
    id: "strategy-learning-platform",
    name: "Internal Enterprise Learning Platform",
    oneLiner: "Sole developer of a spec-driven internal platform, in active development",
    role: "Sole developer",
    org: "Strategy (NASDAQ: MSTR)",
    period: "2026 – present",
    status: "in development",
    kind: "platform",
    problem:
      "An internal learning platform for an enterprise has real stakeholders with conflicting requirements, which makes the specification the hard part rather than the implementation.",
    approach: [
      "Used a spec-driven process: consulted users and stakeholders on requirements, and reviewed the architecture with experienced engineers before building.",
      "Building in Java, Spring Boot, React and PostgreSQL.",
    ],
    contribution: ["Sole developer; in active development."],
    stack: ["Java", "Spring Boot", "React", "PostgreSQL"],
    architecture: null,
    links: [],
    source: "CV Experience section (Strategy)",
  },
  {
    id: "polis",
    name: "Polis",
    oneLiner: "Open-source environment for controlled execution of autonomous agents",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "prototype",
    kind: "platform",
    problem:
      "Running autonomous agents seriously requires somewhere to run them where their actions are bounded and observable. Without that, every experiment is either unsafe or unmeasurable.",
    approach: [
      "Prototyped an open-source environment for controlled execution and monitoring of autonomous agents.",
    ],
    contribution: ["Prototype environment for bounded agent execution with monitoring."],
    stack: ["Python", "LLM agents"],
    architecture: null,
    links: [{ label: "odralabs.com", href: "https://odralabs.com/" }],
    source: "CV Experience section (Odra Labs)",
  },
  {
    id: "mergelearn",
    name: "MergeLearn",
    oneLiner: "Local-first tool where coding agents author lessons and FSRS schedules review",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "prototype",
    kind: "product",
    problem:
      "Engineers reading unfamiliar code learn it once and then forget it. Spaced repetition solves the forgetting, but authoring the material is the bottleneck — nobody writes flashcards about the module they just read.",
    approach: [
      "Built a local-first tool in which coding agents author the lessons from real code, and FSRS schedules the review.",
    ],
    contribution: [
      "Working local-first prototype combining agent-authored lessons with FSRS scheduling.",
    ],
    stack: ["TypeScript", "LLM agents", "FSRS"],
    architecture: null,
    links: [
      { label: "GitHub", href: "https://github.com/odralabshq/mergelearn-tutor" },
    ],
    source: "CV Experience section (Odra Labs)",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const projectById = (id: string) => projects.find((p) => p.id === id);
