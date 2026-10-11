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
 *   3. An evidence-backed minority is right. → the visitor now has to read reasoning,
 *                                          not count votes.
 */

/** Abstract model families. Deliberately not real vendors: the point is shared lineage. */
export type Lineage = "α" | "β" | "γ";

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
  source: { label: string; href: string };
}

export const rounds: QuorumRound[] = [
  {
    n: 1,
    source: { label: "ICPDR · Danube river and basin", href: "https://www.icpdr.org/danube-basin/danube-river-basin/danube-river-basin-overview-map" },
    claim:
      "The Danube flows through or forms borders with ten countries.",
    truth: "supported",
    truthNote:
      "The Danube flows through or forms borders with ten countries. Its wider drainage basin extends into nineteen countries.",
    agents: [
      {
        id: "a1",
        lineage: "α",
        verdict: "supported",
        confidence: 0.88,
        reasoning: "The river passes through or forms borders with ten states.",
      },
      {
        id: "a2",
        lineage: "α",
        verdict: "supported",
        confidence: 0.84,
        reasoning: "Ten countries lie along the Danube’s course.",
      },
      {
        id: "a3",
        lineage: "β",
        verdict: "supported",
        confidence: 0.79,
        reasoning: "River-course records list ten countries along the Danube.",
      },
      {
        id: "a4",
        lineage: "γ",
        verdict: "supported",
        confidence: 0.81,
        reasoning: "The river’s course touches ten countries, while its basin is wider.",
      },
      {
        id: "a5",
        lineage: "β",
        verdict: "refuted",
        confidence: 0.44,
        reasoning: "Basin records list nineteen countries, so ten seems too few.",
      },
    ],
  },
  {
    n: 2,
    source: { label: "NOAA · The highest point on Earth", href: "https://oceanservice.noaa.gov/facts/highestpoint.html" },
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
        reasoning: "Everest holds the record for elevation. The claim follows.",
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
  },
  {
    n: 3,
    source: { label: "NASA · Venus facts", href: "https://science.nasa.gov/venus/venus-facts/" },
    claim: "Venus takes longer to rotate once on its axis than to complete an orbit of the Sun.",
    truth: "supported",
    truthNote:
      "Venus takes about 243 Earth days to rotate once on its axis, but only about 225 Earth days to complete an orbit of the Sun. Its sidereal day is longer than its year.",
    agents: [
      {
        id: "c1",
        lineage: "α",
        verdict: "refuted",
        confidence: 0.82,
        reasoning: "A day is a subdivision of a year. The claim inverts that.",
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
  },
];
