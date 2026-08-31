/**
 * The consensus field — the hero figure's model.
 *
 * WHAT REPLACED WHAT, AND WHY
 * The first version of this figure was a swarm of agents that formed and dissolved
 * clusters. It was pleasant and it was decorative: viewers could not tell what it showed,
 * it had no control, and it began identically on every visit. A figure on a research site
 * that does not say anything is a liability.
 *
 * This version states the site's thesis in one manipulable picture. Each agent holds an
 * opinion on a one-dimensional answer space. The visitor controls one quantity — ρ, how
 * much the agents have in common — and watches two readouts move *in the same direction*:
 *
 *     ρ = 0   opinions are independent   → wide spread, low agreement,
 *                                          but the average lands on the truth
 *     ρ = 1   opinions are identical     → no spread, total agreement,
 *                                          and the consensus sits on the shared bias,
 *                                          which is not the truth
 *
 * Agreement rising while accuracy falls is the counter-intuitive fact the research is
 * about, and here it is a thing you do with your hand rather than a claim you read.
 *
 * THE MODEL, STATED PLAINLY
 *   opinion_i = ρ·b(t) + (1 − ρ)·ε_i + small live jitter
 *
 *   b(t)  a shared bias, drifting slowly. Stands in for what agents inherit from a
 *         common pre-training corpus and alignment procedure.
 *   ε_i   an agent's own idiosyncratic error, fixed per agent, independent across agents
 *         and centred on the truth.
 *
 * This is an illustration of a mechanism, not a fit to data. The site says so where it
 * appears. The measured results live in the paper.
 */

export interface ConsensusOptions {
  count: number;
  /** Sign and scale of the shared bias. Randomised per visit so the figure varies. */
  seed?: number;
}

/** Deterministic PRNG, so a given seed always produces the same field. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Spread of fully independent opinions, used to normalise the agreement readout. */
const INDEPENDENT_SPREAD = 0.85 / Math.sqrt(3);

export class ConsensusField {
  readonly count: number;
  /** Where each agent currently stands, in [-1, 1]. 0 is the truth. */
  readonly opinions: Float32Array;
  /** Stable vertical placement, so dots do not jump between frames. */
  readonly rows: Float32Array;
  /** Per-agent dot size and alpha, so the field reads as ink rather than pixels. */
  readonly variance: Float32Array;

  /** Each agent's own independent error. Fixed for the life of the field. */
  private readonly idiosyncratic: Float32Array;
  private readonly phase: Float32Array;

  /** Sign of the shared bias for this visit. */
  private readonly biasSign: number;
  private readonly biasBase: number;

  private time = 0;

  /** Live statistics, recomputed each step and read by the UI. */
  mean = 0;
  spread = 0;

  constructor({ count, seed = 1 }: ConsensusOptions) {
    this.count = count;
    this.opinions = new Float32Array(count);
    this.rows = new Float32Array(count);
    this.variance = new Float32Array(count * 2);
    this.idiosyncratic = new Float32Array(count);
    this.phase = new Float32Array(count);

    const rand = mulberry32(seed);
    // A shared bias that is reliably off-centre: a figure whose punchline only lands
    // half the time is not a punchline. Direction and magnitude vary per visit.
    this.biasSign = rand() < 0.5 ? -1 : 1;
    this.biasBase = 0.26 + rand() * 0.12;

    for (let i = 0; i < count; i++) {
      this.idiosyncratic[i] = (rand() * 2 - 1) * 0.85;
      this.rows[i] = (rand() * 2 - 1) * 0.9;
      this.phase[i] = rand() * Math.PI * 2;
      this.variance[i * 2] = 0.6 + Math.pow(rand(), 2.2) * 1.9;
      this.variance[i * 2 + 1] = 0.35 + rand() * 0.65;
    }
  }

  /** The shared bias at the current moment. */
  get bias(): number {
    return (
      this.biasSign * (this.biasBase + 0.1 * Math.sin(this.time * 0.19))
    );
  }

  /**
   * @param dt  seconds, clamped by the caller
   * @param rho 0 = fully independent agents, 1 = identical agents
   */
  step(dt: number, rho: number) {
    this.time += dt;
    const b = this.bias;
    const t = this.time;

    let sum = 0;
    for (let i = 0; i < this.count; i++) {
      // A little live jitter so the field breathes; too small to affect the readouts.
      const jitter = Math.sin(t * 0.6 + this.phase[i]) * 0.018;
      const x = rho * b + (1 - rho) * this.idiosyncratic[i] + jitter;
      this.opinions[i] = x;
      sum += x;
    }

    this.mean = sum / this.count;

    let variance = 0;
    for (let i = 0; i < this.count; i++) {
      const d = this.opinions[i] - this.mean;
      variance += d * d;
    }
    this.spread = Math.sqrt(variance / this.count);
  }

  /** 0–1. How tightly the panel agrees with itself. */
  get agreement(): number {
    return Math.max(0, Math.min(1, 1 - this.spread / INDEPENDENT_SPREAD));
  }

  /** 0–1. How far the panel's consensus sits from the truth. */
  get consensusError(): number {
    return Math.min(1, Math.abs(this.mean));
  }
}

/**
 * The two readouts at a given correlation, without running the simulation.
 * Used for the no-JavaScript rendering and for tests.
 */
export function expectedReadouts(rho: number, bias = 0.32) {
  const spread = (1 - rho) * INDEPENDENT_SPREAD;
  return {
    agreement: Math.max(0, Math.min(1, 1 - spread / INDEPENDENT_SPREAD)),
    consensusError: Math.min(1, Math.abs(rho * bias)),
  };
}
