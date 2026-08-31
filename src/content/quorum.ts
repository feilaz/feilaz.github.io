/**
 * QUORUM — the site's signature research interaction.
 *
 * WHAT IT IS: a scripted, deterministic demonstration of the failure mode studied in
 * "Controlling Uncertainty and Hallucination Risk in Multi-Agent Fact Verification"
 * (Kostka & Chudziak, UAI 2026).
 *
 * WHAT IT IS NOT: experimental data. The agent responses below are authored to
 * illustrate correlated error, not sampled from models. The UI states this plainly.
 * The only empirical numbers shown anywhere are the ones from the paper itself.
 *
 * The task framing (verify a claim, accept or abstain) mirrors the paper's actual
 * setting rather than being a general-knowledge quiz.
 *
 * DESIGN OF THE ARC — deliberately three rounds:
 *   1. Majority is right.               → the visitor's intuition is rewarded.
 *   2. Unanimity is wrong.              → the intuition breaks, loudly.
 *   3. An independent minority is right. → the visitor now has to read correlation,
 *                                          not count votes.
 */

/** Abstract model families. Deliberately not real vendors: the point is shared lineage. */
export type Lineage = "α" | "β" | "γ";

export const lineages: Record<Lineage, { name: string; note: string }> = {
  α: { name: "Lineage α", note: "Shared pre-training corpus and alignment procedure" },
  β: { name: "Lineage β", note: "Independent corpus" },
  γ: { name: "Lineage γ", note: "Independent corpus, retrieval-augmented" },
};

export interface AgentResponse {
  id: string;
  lineage: Lineage;
  verdict: "supported" | "refuted";
  /** Self-reported confidence, 0–1. Shown to the visitor, as in a real system. */
  confidence: number;
  reasoning: string;
}

export interface QuorumRound {
  n: number;
  /** What the visitor is asked to adjudicate. */
  claim: string;
  /** Ground truth for the claim. */
  truth: "supported" | "refuted";
  /** Short factual justification, shown only after the decision. */
  truthNote: string;
  agents: AgentResponse[];
  /** The lesson, revealed after the decision. Two sentences maximum. */
  lesson: {
    /** Shown when the visitor's decision matched the truth. */
    onCorrect: string;
    /** Shown when it did not. */
    onWrong: string;
    /** The structural point, shown either way. */
    structural: string;
  };
}

export const rounds: QuorumRound[] = [
  {
    n: 1,
    claim:
      "The Danube flows through more countries than any other river in the world.",
    truth: "supported",
    truthNote:
      "The Danube passes through ten countries — more than any other river.",
    agents: [
      {
        id: "a1",
        lineage: "α",
        verdict: "supported",
        confidence: 0.88,
        reasoning: "Danube crosses ten states; no other river exceeds this.",
      },
      {
        id: "a2",
        lineage: "α",
        verdict: "supported",
        confidence: 0.84,
        reasoning: "Ten riparian countries, the highest of any river.",
      },
      {
        id: "a3",
        lineage: "β",
        verdict: "supported",
        confidence: 0.79,
        reasoning: "Confirmed against basin records: ten countries.",
      },
      {
        id: "a4",
        lineage: "γ",
        verdict: "supported",
        confidence: 0.81,
        reasoning: "Retrieved basin data lists ten sovereign states.",
      },
      {
        id: "a5",
        lineage: "β",
        verdict: "refuted",
        confidence: 0.44,
        reasoning: "Possibly the Nile, which has a larger basin.",
      },
    ],
    lesson: {
      onCorrect:
        "Correct. Four of five agreed, and — importantly — they came from three different lineages, so the agreement carried information.",
      onWrong:
        "The ensemble was right this time. Four of five agreed, and crucially they came from three different lineages.",
      structural:
        "This is the case that builds the intuition: agents converging is real evidence when their errors are genuinely independent. That independence is an assumption, and it has to be earned.",
    },
  },
  {
    n: 2,
    claim:
      "Mount Everest's summit is the point on Earth's surface farthest from the centre of the Earth.",
    truth: "refuted",
    truthNote:
      "Everest is the highest above sea level, but because Earth bulges at the equator, the summit of Chimborazo in Ecuador is farther from Earth's centre.",
    agents: [
      {
        id: "b1",
        lineage: "α",
        verdict: "supported",
        confidence: 0.96,
        reasoning: "Everest is the highest point on Earth at 8,849 m.",
      },
      {
        id: "b2",
        lineage: "α",
        verdict: "supported",
        confidence: 0.94,
        reasoning: "Everest holds the record for elevation; the claim follows.",
      },
      {
        id: "b3",
        lineage: "α",
        verdict: "supported",
        confidence: 0.97,
        reasoning: "Well established: Everest is Earth's highest summit.",
      },
      {
        id: "b4",
        lineage: "α",
        verdict: "supported",
        confidence: 0.93,
        reasoning: "The highest mountain, therefore the farthest point.",
      },
      {
        id: "b5",
        lineage: "α",
        verdict: "supported",
        confidence: 0.95,
        reasoning: "Consistent with all elevation records.",
      },
    ],
    lesson: {
      onCorrect:
        "You were right to doubt them. All five agents are from one lineage, so their agreement carries almost no independent information.",
      onWrong:
        "Five out of five, mean confidence 95%, and all of them wrong. Every agent made the same substitution — 'highest above sea level' for 'farthest from the centre' — which is what a common-mode error looks like from the outside.",
      structural:
        "Unanimity among correlated agents is not strong evidence. It is closer to one opinion, reported five times.",
    },
  },
  {
    n: 3,
    claim: "A day on Venus is longer than a year on Venus.",
    truth: "supported",
    truthNote:
      "Venus takes about 243 Earth days to rotate once on its axis, but only about 225 Earth days to complete an orbit of the Sun — so its sidereal day is longer than its year.",
    agents: [
      {
        id: "c1",
        lineage: "α",
        verdict: "refuted",
        confidence: 0.82,
        reasoning: "A day is a subdivision of a year; the claim inverts that.",
      },
      {
        id: "c2",
        lineage: "α",
        verdict: "refuted",
        confidence: 0.79,
        reasoning: "No planet's day exceeds its orbital period.",
      },
      {
        id: "c3",
        lineage: "α",
        verdict: "refuted",
        confidence: 0.85,
        reasoning: "Claim appears to confuse rotation with revolution.",
      },
      {
        id: "c4",
        lineage: "β",
        verdict: "supported",
        confidence: 0.71,
        reasoning: "Venus rotates in ~243 days and orbits in ~225 days.",
      },
      {
        id: "c5",
        lineage: "γ",
        verdict: "supported",
        confidence: 0.68,
        reasoning: "Retrieved planetary fact sheet: sidereal day exceeds orbital period.",
      },
    ],
    lesson: {
      onCorrect:
        "Correct — and note what you had to do to get here. You ignored the majority and read the composition of the panel instead.",
      onWrong:
        "The two dissenters were right. Three agents agreed, but they were one lineage reasoning from the same prior that the claim sounds impossible; the two that disagreed were independent of them and of each other.",
      structural:
        "Weighting by independence rather than by count lets a two-agent minority outweigh a three-agent majority. In a real system that independence has to be estimated, not assumed.",
    },
  },
];

/**
 * The closing panel.
 *
 * Written carefully after an independent academic review flagged two overclaims:
 *
 *  - "Agreement is a measurement of similarity, not of truth" contradicted round 1,
 *    where agreement *is* informative. Agreement can be evidence about the world; what
 *    it cannot do is tell you, by itself, how much of it is evidence about shared
 *    training instead.
 *  - The demo teaches a reader to inspect lineages. The paper does something different
 *    — it penalises ensemble disagreement and calibrates a decision threshold — so the
 *    text now separates the motivation (what this demo shows) from the contribution
 *    (what the paper proves), and says outright that the demo does not simulate the
 *    method.
 */
export const quorumOutcome = {
  headline: "Agreement is not, by itself, evidence of correctness.",
  body: [
    "Frontier models share pre-training corpora and alignment procedures, so their errors are correlated. When they converge, some of that convergence is evidence about the world and some of it is evidence about their shared training — and a raw consensus score cannot separate the two.",
    "That is the problem my UAI 2026 paper starts from. Its contribution is not a way of reading model lineages, which you will not have at deployment time; it is a statistical one. A penalty lowers confidence as factual disagreement inside the ensemble rises, and a Learn-Then-Test procedure converts the penalised scores into a decision threshold with a provable bound on the expected false discovery rate — a guarantee about the error rate across queries, not about any single answer.",
  ],
  /** Verbatim from the published paper. */
  empirical: {
    statement:
      "At a strict 2% risk budget, the deviation-penalised method reaches 71.7% recall against 47.4% for unpenalised baselines.",
    citation: "Kostka & Chudziak, UAI 2026 · PMLR 337:3143–3161",
  },
  disclaimer:
    "The three claims above are an authored demonstration of the failure mode, not experimental output: the agents are scripted and their shared lineage is a stand-in for correlated error. The figures in the paper are measured.",
} as const;

/** Copy for the entry prompt. Short enough to read without deciding to read it. */
export const quorumIntro = {
  eyebrow: "Interactive · about 60 seconds",
  question: "Four of five agents agree. Would you trust them?",
  sub: "Three claims, each checked by five agents. You decide whether to accept the ensemble's verdict.",
  /** Stated before the visitor begins, not only at the end. */
  disclosure:
    "The agents below are scripted, not live models — this is a demonstration of a failure mode, not an experiment.",
  cta: "Begin",
} as const;
