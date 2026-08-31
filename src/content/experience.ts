/**
 * Experience, education, awards, skills.
 * SOURCE OF TRUTH: adam_kostka_ai_software_engineering_cv_final.tex — verbatim or
 * lightly condensed. No outcome, metric or date appears here that is not in the CV.
 */

export interface Role {
  org: string;
  orgNote?: string;
  title: string;
  location: string;
  start: string;
  end: string;
  /** Machine-readable for the JSON-LD and for sorting. */
  startISO: string;
  endISO: string | null;
  points: string[];
  stack?: string[];
  href?: string;
}

export const roles: Role[] = [
  {
    org: "Strategy",
    orgNote: "NASDAQ: MSTR, formerly MicroStrategy",
    title: "AI Engineer",
    location: "Warsaw, Poland",
    start: "May 2025",
    end: "Present",
    startISO: "2025-05",
    endISO: null,
    points: [
      "Owned delivery of a customer-facing Gantt-chart visualization now shipping in Strategy's business-intelligence platform: architecture, implementation, testing, cross-repository integration and QA coordination.",
      "Built it in TypeScript, JavaScript, D3.js and Node.js from an existing Figma design, then contributed to later refinements of both the design and the specification.",
      "Created a local test harness and AI-assisted development scaffolding that removed the need to rebuild and redeploy the full visualization library on every iteration.",
      "Delivered features on Strategy's agentic AI platform, including question-answer caching, dashboard recommendation workflows and conversational follow-up handling, with backend and API changes across Python and OpenAPI services.",
      "Sole developer of a new internal enterprise learning platform, in active development: spec-driven process, consulting users and stakeholders on requirements, and reviewing the architecture with experienced engineers; building in Java, Spring Boot, React and PostgreSQL.",
    ],
    stack: ["TypeScript", "D3.js", "Python", "Java", "Spring Boot", "React", "PostgreSQL"],
  },
  {
    org: "Odra Labs",
    title: "Co-founder and AI Engineer",
    orgNote: "independent venture",
    location: "Warsaw, Poland / Remote",
    start: "Oct 2025",
    end: "Aug 2026",
    startISO: "2025-10",
    endISO: "2026-08",
    points: [
      "Co-founded a two-person AI product venture with a senior software engineer, contributing across architecture, implementation and product delivery; secured AWS and Google startup credits.",
      "Built and deployed HermesFix, an AWS-hosted platform repairing WooCommerce sites with LLM agents.",
      "Prototyped Polis, an open-source environment for controlled execution and monitoring of autonomous agents, and MergeLearn, a local-first tool where coding agents author lessons and FSRS schedules the review.",
    ],
    stack: ["Python", "AWS", "LLM agents", "TypeScript"],
    href: "https://odralabs.com/",
  },
  {
    org: "Bank Gospodarstwa Krajowego",
    title: "Software Engineering Intern",
    location: "Warsaw, Poland",
    start: "Jul 2023",
    end: "Sep 2023",
    startISO: "2023-07",
    endISO: "2023-09",
    points: [
      "Tested banking-platform APIs and workflows with SoapUI and Jira, reproducing and documenting defects.",
    ],
    stack: ["SoapUI", "Jira"],
  },
];

export interface Education {
  institution: string;
  location: string;
  degree: string;
  detail?: string;
  start: string;
  end: string;
  note?: string;
}

export const education: Education[] = [
  {
    institution: "Warsaw University of Technology",
    location: "Warsaw, Poland",
    degree: "MSc, Computer Science",
    detail: "Weighted average 4.75 / 5.00",
    start: "Oct 2025",
    end: "Expected Jun 2027",
  },
  {
    institution: "Warsaw University of Technology",
    location: "Warsaw, Poland",
    degree: "BSc, Computer Science",
    detail: "Weighted average 4.56 / 5.00 · Diploma grade: Very Good",
    start: "Oct 2022",
    end: "Jun 2025",
  },
  {
    institution: "Kyungpook National University",
    location: "Daegu, South Korea",
    degree: "BSc, Computer Science and Engineering",
    detail: "Double-degree programme",
    start: "Mar 2024",
    end: "Dec 2024",
  },
];

export const awards = [
  {
    title: "Senate Scholarship, Warsaw University of Technology",
    year: "2026",
    detail: "One of five recipients selected university-wide.",
  },
  {
    title: "Rector's Scholarship, Warsaw University of Technology",
    year: "awarded three times",
    detail: null,
  },
];

export const skills = [
  { group: "Core languages", items: ["Python", "TypeScript", "JavaScript", "SQL"] },
  { group: "Additional", items: ["Java", "C++"] },
  {
    group: "AI and agents",
    items: [
      "LLM agents",
      "Multi-agent systems",
      "LangGraph",
      "LangChain",
      "RAG / GraphRAG",
      "Tool orchestration",
      "Agent evaluation",
    ],
  },
  {
    group: "Application and data",
    items: [
      "FastAPI",
      "Spring Boot",
      "React",
      "Node.js",
      "REST / OpenAPI",
      "PostgreSQL",
      "Neo4j",
    ],
  },
  { group: "Cloud and delivery", items: ["AWS", "Git", "CI/CD", "Software testing"] },
  {
    group: "Languages",
    items: ["Polish (native)", "English (full professional)"],
  },
];
