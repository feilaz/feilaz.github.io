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
  compact?: boolean;
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
    role: "First author, responsible for method design, implementation and experiments",
    org: "Warsaw University of Technology",
    period: "2026",
    status: "research code",
    kind: "research",
    featured: true,
    problem:
      "Multi-agent LLM systems can agree on the same wrong answer. Vote counts alone cannot distinguish well-supported agreement from a shared mistake. This work asks how to select factual claims under a specified error budget.",
    approach: [
      "Treat hallucination control as a statistical risk-control problem.",
      "Keep the claims from each query–response pair together as one calibration unit, accounting for their dependence within a response.",
      "Penalize the weak judge’s claim-support scores using their spread within each query–response tuple. Learn-Then-Test calibration then sets a selection threshold that bounds the expected false discovery rate.",
    ],
    contribution: [
      "At a 2% risk budget, the method achieved 71.7% recall, compared with 47.4% for unpenalized baselines in the reported evaluation.",
      "Avoided degenerate thresholds in the reported strict-risk evaluation, where naive calibration often abstained on almost everything.",
      "An ablation across scoring methods reveals a U-shaped entropy–error relationship, explaining why penalties targeting sycophancy alone are suboptimal.",
      "Published at UAI 2026 (PMLR 337:3143–3161).",
    ],
    technical: [
      {
        decision: "Risk control at the tuple level rather than per generated claim",
        rationale:
          "Claims in a long-form response share context and can have dependent errors. We calibrate at the query–response level, keeping these claims together as one unit.",
      },
      {
        decision: "A penalty on claim-score spread rather than semantic entropy",
        rationale:
          "Score Deviation uses the spread of the weak judge’s claim scores within a query–response tuple. The U-shaped entropy–error finding comes from a separate scoring ablation.",
      },
      {
        decision: "The guarantee is on expected False Discovery Rate across queries",
        rationale:
          "The bound concerns the expected false discovery rate across query–response tuples. It does not certify the correctness of each individual answer.",
      },
    ],
    stack: ["Python", "Conformal prediction", "Learn-Then-Test", "LLM ensembles"],
    architecture: {
      caption:
        "The highlighted penalty and calibration steps operate on outputs from an existing ensemble without retraining the models.",
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
          note: "Penalty based on within-tuple claim-score spread",
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
      { label: "Code", href: "https://github.com/feilaz/uai2026-score-deviation" },
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
      "The agent platform needs to answer questions about enterprise data, control inference costs and keep track of conversational context.",
    approach: [
      "Added answer caching to reduce inference costs for repeated questions.",
      "Built workflows for the agent to recommend relevant dashboards.",
      "Added follow-up handling so the agent interprets questions in the context of the conversation.",
      "Made the backend and API changes these features required across Python and OpenAPI services.",
    ],
    contribution: [
      "Three features shipped on Strategy's agentic AI platform: caching, dashboard recommendation and multi-turn follow-up handling.",
      "Changes spanned backend services and APIs.",
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
      "Strategy's business-intelligence platform needed a Gantt-chart visualization. The component had to fit into the existing visualization library and pass integration testing and QA before release.",
    approach: [
      "Owned architecture, implementation, testing, cross-repository integration and QA coordination for the component.",
      "Built it from an existing Figma design in TypeScript, JavaScript, D3.js and Node.js, then contributed to later refinements of both the design and the specification.",
      "Created a local test harness and AI-assisted development scaffolding that removed the need to rebuild and redeploy the full visualization library on every iteration.",
    ],
    contribution: [
      "Shipped as a customer-facing component of Strategy's business-intelligence platform.",
      "The local test harness let me test changes without rebuilding the full visualization library.",
    ],
    technical: [
      {
        decision: "A local harness that renders the component outside the host platform",
        rationale:
          "Rebuilding and redeploying the whole visualization library slowed each change. Running the component separately made local development faster.",
      },
    ],
    stack: ["TypeScript", "JavaScript", "D3.js", "Node.js"],
    architecture: null,
    links: [],
    source: "CV Experience section (Strategy)",
  },
  {
    id: "hermesfix",
    compact: true,
    name: "HermesFix",
    oneLiner: "AWS-hosted platform that repairs WooCommerce sites with LLM agents",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "shipped",
    kind: "product",
    featured: true,
    problem:
      "Diagnosing a broken WooCommerce site often means tracing an issue across logs, theme code and plugin interactions. HermesFix uses LLM agents to investigate and repair these issues.",
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
    compact: true,
    name: "Internal Enterprise Learning Platform",
    oneLiner: "An internal learning platform built around stakeholder requirements",
    role: "Sole developer",
    org: "Strategy (NASDAQ: MSTR)",
    period: "2026 – present",
    status: "in development",
    kind: "platform",
    problem:
      "The platform brings together requirements from internal users and stakeholders. The work starts with clarifying those requirements and reviewing the architecture before implementation.",
    approach: [
      "Used a spec-driven process: consulted users and stakeholders on requirements, and reviewed the architecture with experienced engineers before building.",
      "Building in Java, Spring Boot, React and PostgreSQL.",
    ],
    contribution: ["Sole developer. The platform is in active development."],
    stack: ["Java", "Spring Boot", "React", "PostgreSQL"],
    architecture: null,
    links: [],
    source: "CV Experience section (Strategy)",
  },
  {
    id: "polis",
    compact: true,
    name: "Polis",
    oneLiner: "Open-source environment for controlled execution of autonomous agents",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "prototype",
    kind: "platform",
    problem:
      "Autonomous agents need controls on what they can do and logs of what they have done. Without these, it is harder to limit actions and investigate failures.",
    approach: [
      "Prototyped an open-source environment for controlled execution and monitoring of autonomous agents.",
    ],
    contribution: ["Prototype environment for bounded agent execution with monitoring."],
    stack: ["Python", "LLM agents"],
    architecture: null,
    links: [{ label: "GitHub", href: "https://github.com/odralabshq/polis" }, { label: "Website", href: "https://odralabs.com/" }],
    source: "CV Experience section (Odra Labs)",
  },
  {
    id: "mergelearn",
    compact: true,
    name: "MergeLearn",
    oneLiner: "Local-first tool where coding agents author lessons and FSRS schedules review",
    role: "Co-founder and AI Engineer",
    org: "Odra Labs",
    period: "Oct 2025 – Aug 2026",
    status: "prototype",
    kind: "product",
    problem:
      "Spaced repetition can help retain concepts from unfamiliar code, but creating useful review material takes time. MergeLearn explores using coding agents to prepare that material.",
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
