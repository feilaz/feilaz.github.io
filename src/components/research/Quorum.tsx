"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  lineages,
  quorumIntro,
  quorumOutcome,
  rounds,
  type AgentResponse,
  type QuorumRound,
} from "@/content/quorum";
import { duration, easeOut, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useCapability";
import { cn } from "@/lib/cn";

type Phase =
  | { kind: "intro" }
  | { kind: "answering"; round: number }
  | { kind: "revealed"; round: number; trusted: boolean }
  | { kind: "outcome" };

/** Majority verdict of an ensemble, plus the agreement and confidence readouts. */
function summarise(round: QuorumRound) {
  const supported = round.agents.filter((a) => a.verdict === "supported").length;
  const majority: AgentResponse["verdict"] =
    supported > round.agents.length / 2 ? "supported" : "refuted";
  const agreeing = round.agents.filter((a) => a.verdict === majority);
  const meanConfidence =
    agreeing.reduce((s, a) => s + a.confidence, 0) / agreeing.length;
  const lineageSet = new Set(agreeing.map((a) => a.lineage));
  return {
    majority,
    agreeing: agreeing.length,
    total: round.agents.length,
    meanConfidence,
    distinctLineages: lineageSet.size,
    majorityCorrect: majority === round.truth,
  };
}

export function Quorum() {
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });
  const [scores, setScores] = useState<boolean[]>([]);
  const reduced = useReducedMotion();

  /**
   * Every phase change replaces the whole subtree, which destroys the control the
   * visitor just activated and drops focus to the body. Moving focus to the incoming
   * heading keeps keyboard and screen-reader users oriented.
   */
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const roundIndex =
    phase.kind === "answering" || phase.kind === "revealed" ? phase.round : 0;
  const round = rounds[roundIndex];
  const summary = useMemo(() => summarise(round), [round]);

  function decide(trusted: boolean) {
    const correct = trusted ? summary.majorityCorrect : !summary.majorityCorrect;
    setScores((s) => [...s, correct]);
    setPhase({ kind: "revealed", round: roundIndex, trusted });
  }

  function next() {
    if (roundIndex + 1 < rounds.length) {
      setPhase({ kind: "answering", round: roundIndex + 1 });
    } else {
      setPhase({ kind: "outcome" });
    }
  }

  function restart() {
    setScores([]);
    setPhase({ kind: "answering", round: 0 });
  }

  const status = (() => {
    switch (phase.kind) {
      case "intro":
        return "";
      case "answering":
        return `Claim ${roundIndex + 1} of ${rounds.length}. ${round.claim} ${summary.agreeing} of ${summary.total} agents say ${summary.majority}.`;
      case "revealed":
        return `${scores[scores.length - 1] ? "Your decision was correct" : "Your decision was incorrect"}. The claim was ${round.truth}. ${round.truthNote}`;
      case "outcome":
        return `Finished. ${scores.filter(Boolean).length} of ${scores.length} decisions correct. ${quorumOutcome.headline}`;
    }
  })();

  return (
    <div className="border border-rule-dark bg-void-raised">
      {/* Instrument header — always visible, so the visitor always knows where
          they are and that this is a demonstration rather than data. */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-rule-dark px-5 py-3.5 sm:px-7">
        <p className="label text-chalk-faint">
          Quorum · simulated demonstration
        </p>
        {phase.kind !== "intro" && (
          <p className="label tabular text-chalk-faint">
            {phase.kind === "outcome"
              ? `${scores.filter(Boolean).length} / ${rounds.length} correct`
              : `Claim ${roundIndex + 1} of ${rounds.length}`}
          </p>
        )}
      </div>

      <div className="px-5 py-8 sm:px-7 sm:py-10">
        <AnimatePresence mode="wait" initial={false}>
          {phase.kind === "intro" && (
            <Fade key="intro" reduced={reduced}>
              <Intro onBegin={() => setPhase({ kind: "answering", round: 0 })} />
            </Fade>
          )}

          {(phase.kind === "answering" || phase.kind === "revealed") && (
            <Fade key={`round-${roundIndex}-${phase.kind}`} reduced={reduced}>
              <RoundView
                headingRef={headingRef}
                round={round}
                summary={summary}
                revealed={phase.kind === "revealed"}
                trusted={phase.kind === "revealed" ? phase.trusted : null}
                reduced={reduced}
                onDecide={decide}
                onNext={next}
                isLast={roundIndex + 1 === rounds.length}
              />
            </Fade>
          )}

          {phase.kind === "outcome" && (
            <Fade key="outcome" reduced={reduced}>
              <Outcome headingRef={headingRef} scores={scores} onRestart={restart} />
            </Fade>
          )}
        </AnimatePresence>
      </div>

      {/* One atomic status string, covering every transition. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {status}
      </div>
    </div>
  );
}

function Fade({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  if (reduced) return <div>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: duration.base, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

function Intro({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="measure-wide">
      <p className="label text-chalk-faint">{quorumIntro.eyebrow}</p>
      <p className="mt-5 font-serif text-heading text-chalk">
        {quorumIntro.question}
      </p>
      <p className="mt-5 text-body text-chalk-muted">{quorumIntro.sub}</p>
      <p className="mt-4 font-mono text-micro text-chalk-faint">
        {quorumIntro.disclosure}
      </p>
      <button
        type="button"
        onClick={onBegin}
        className="label mt-8 inline-flex items-center gap-3 border border-chalk bg-chalk px-5 py-3 text-void transition-colors hover:border-accent-chalk hover:bg-accent-chalk hover:text-void"
      >
        {quorumIntro.cta}
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function RoundView({
  headingRef,
  round,
  summary,
  revealed,
  trusted,
  reduced,
  onDecide,
  onNext,
  isLast,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  round: QuorumRound;
  summary: ReturnType<typeof summarise>;
  revealed: boolean;
  trusted: boolean | null;
  reduced: boolean;
  onDecide: (trusted: boolean) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const correct = trusted === null ? null : trusted ? summary.majorityCorrect : !summary.majorityCorrect;

  return (
    <div>
      {/* The claim */}
      <p className="label text-chalk-faint">Claim</p>
      <h3
        ref={headingRef}
        tabIndex={-1}
        className="measure-wide mt-4 font-serif text-subheading text-chalk focus-visible:outline-2"
      >
        {round.claim}
      </h3>

      {/* The ensemble */}
      <ul className="mt-9 grid gap-2.5 sm:grid-cols-5">
        {round.agents.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            index={i}
            reduced={reduced}
            revealed={revealed}
            truth={round.truth}
            inMajority={agent.verdict === summary.majority}
          />
        ))}
      </ul>

      {/* A visible key, not a title attribute: touch users cannot hover, and a
          screen reader's exposure of `title` is inconsistent. */}
      <LineageKey round={round} />

      {/* Composition sits directly under the cards, where it explains them. */}
      {revealed && <LineageNote round={round} summary={summary} />}

      {/* Readouts — the "agreement 100% / correctness ?" moment */}
      <div className="mt-7 grid gap-x-10 gap-y-5 border-t border-rule-dark pt-6 sm:grid-cols-3">
        <Readout
          label="Agreement"
          value={`${summary.agreeing} / ${summary.total}`}
          bar={summary.agreeing / summary.total}
          reduced={reduced}
        />
        <Readout
          label="Mean confidence"
          value={`${Math.round(summary.meanConfidence * 100)}%`}
          bar={summary.meanConfidence}
          reduced={reduced}
        />
        <Readout
          label="Correctness"
          value={revealed ? (summary.majorityCorrect ? "Correct" : "Incorrect") : "?"}
          tone={revealed ? (summary.majorityCorrect ? "good" : "bad") : "unknown"}
        />
      </div>

      {/* Decision or reveal */}
      {!revealed ? (
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onDecide(true)}
            className="label inline-flex items-center border border-chalk bg-chalk px-5 py-3 text-void transition-colors hover:border-accent-chalk hover:bg-accent-chalk"
          >
            Trust the ensemble
          </button>
          <button
            type="button"
            onClick={() => onDecide(false)}
            className="label inline-flex items-center border border-chalk-faint px-5 py-3 text-chalk transition-colors hover:border-chalk"
          >
            Overrule it
          </button>
        </div>
      ) : (
        <div className="mt-9 grid gap-x-14 gap-y-8 border-t border-rule-dark pt-7 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            <p
              className={cn(
                "font-mono text-label tracking-[0.14em] uppercase",
                correct ? "text-signal-agree-chalk" : "text-accent-chalk",
              )}
            >
              {correct ? "Your decision: correct" : "Your decision: incorrect"}
            </p>

            <p className="mt-4 font-serif text-subheading text-chalk">
              {correct ? round.lesson.onCorrect : round.lesson.onWrong}
            </p>

            <p className="mt-5 text-small text-chalk-muted">
              <span className="text-chalk">The claim was {round.truth}.</span>{" "}
              {round.truthNote}
            </p>

            <button
              type="button"
              onClick={onNext}
              className="label mt-8 inline-flex items-center gap-3 border border-chalk px-5 py-3 text-chalk transition-colors hover:bg-chalk hover:text-void"
            >
              {isLast ? "What this means" : "Next claim"}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <aside className="lg:border-l lg:border-rule-dark lg:pl-8">
            <p className="label text-chalk-faint">What to take from this</p>
            <p className="mt-4 text-small text-chalk-muted italic">
              {round.lesson.structural}
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

/**
 * The key for the lineage marks. Only the lineages present in the current round are
 * listed, so it stays short, and it is always visible rather than hover-only.
 */
function LineageKey({ round }: { round: QuorumRound }) {
  const present = Array.from(new Set(round.agents.map((a) => a.lineage)));
  return (
    <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
      {present.map((l) => (
        <div key={l} className="flex items-baseline gap-2">
          <dt className="font-mono text-micro text-chalk-muted">{l}</dt>
          <dd className="text-[0.78rem] text-chalk-faint">{lineages[l].note}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Explains the correlation structure in words, not just colour. */
function LineageNote({
  round,
  summary,
}: {
  round: QuorumRound;
  summary: ReturnType<typeof summarise>;
}) {
  const counts = round.agents.reduce<Record<string, number>>((acc, a) => {
    acc[a.lineage] = (acc[a.lineage] ?? 0) + 1;
    return acc;
  }, {});
  const parts = Object.entries(counts).map(([l, n]) => `${n}×${l}`);

  return (
    <p className="mt-4 font-mono text-micro text-chalk-faint">
      Ensemble composition {parts.join("  ")} · the {summary.agreeing} agreeing agents
      span {summary.distinctLineages}{" "}
      {summary.distinctLineages === 1 ? "lineage" : "lineages"}
    </p>
  );
}

function AgentCard({
  agent,
  index,
  reduced,
  revealed,
  truth,
  inMajority,
}: {
  agent: AgentResponse;
  index: number;
  reduced: boolean;
  revealed: boolean;
  truth: AgentResponse["verdict"];
  inMajority: boolean;
}) {
  const wrong = revealed && agent.verdict !== truth;

  const className = cn(
    "border p-3.5 transition-colors duration-300",
    revealed
      ? wrong
        ? "border-accent/55 bg-accent/8"
        : "border-signal-agree/50 bg-signal-agree/8"
      : "border-rule-dark",
  );

  const inner = (
    <>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-micro text-chalk-muted">
          <span className="sr-only">Lineage </span>
          {agent.lineage}
        </span>
        <span className="tabular font-mono text-micro text-chalk-muted">
          {Math.round(agent.confidence * 100)}%
        </span>
      </div>

      <p
        className={cn(
          "mt-3 font-mono text-label tracking-[0.1em] uppercase",
          revealed
            ? wrong
              ? "text-accent-chalk"
              : "text-signal-agree-chalk"
            : inMajority
              ? "text-chalk"
              : "text-chalk-muted",
        )}
      >
        {agent.verdict}
      </p>

      {/* Confidence as a hairline bar: comparable at a glance, no chart needed. */}
      <div className="mt-3 h-px w-full bg-rule-dark" aria-hidden="true">
        <div
          className={cn(
            "h-px",
            revealed && wrong ? "bg-accent-chalk" : "bg-chalk-muted",
          )}
          style={{ width: `${agent.confidence * 100}%` }}
        />
      </div>

      <p className="mt-3 text-[0.78rem] leading-snug text-chalk-muted">
        {agent.reasoning}
      </p>
    </>
  );

  if (reduced) return <li className={className}>{inner}</li>;

  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: duration.base,
        ease: easeOut,
        delay: revealed ? 0 : stagger(index, 0.09),
      }}
    >
      {inner}
    </motion.li>
  );
}

function Readout({
  label,
  value,
  bar,
  tone = "neutral",
  reduced,
}: {
  label: string;
  value: string;
  bar?: number;
  tone?: "neutral" | "good" | "bad" | "unknown";
  reduced?: boolean;
}) {
  return (
    <div>
      <p className="label text-chalk-faint">{label}</p>
      <p
        className={cn(
          "tabular mt-2 font-serif text-subheading",
          tone === "good"
            ? "text-signal-agree-chalk"
            : tone === "bad"
              ? "text-accent-chalk"
              : tone === "unknown"
                ? "text-chalk-faint"
                : "text-chalk",
        )}
      >
        {value}
      </p>
      {bar !== undefined && (
        <div className="mt-3 h-px w-full bg-rule-dark" aria-hidden="true">
          {reduced ? (
            <div className="h-px bg-chalk-muted" style={{ width: `${bar * 100}%` }} />
          ) : (
            <motion.div
              className="h-px bg-chalk-muted"
              initial={{ width: 0 }}
              animate={{ width: `${bar * 100}%` }}
              transition={{ duration: duration.slow, ease: easeOut, delay: 0.55 }}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Outcome({
  headingRef,
  scores,
  onRestart,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  scores: boolean[];
  onRestart: () => void;
}) {
  return (
    <div className="grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-heading text-chalk focus-visible:outline-2"
        >
          {quorumOutcome.headline}
        </h3>

        <div className="mt-6 space-y-5">
          {quorumOutcome.body.map((p, i) => (
            <p key={i} className="text-body text-chalk-muted">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="/work/certified-multi-agent-verification"
            className="label inline-flex items-center gap-3 border border-chalk bg-chalk px-5 py-3 text-void transition-colors hover:border-accent-chalk hover:bg-accent-chalk"
          >
            What the paper does
            <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            onClick={onRestart}
            className="label inline-flex items-center border border-chalk-faint px-5 py-3 text-chalk transition-colors hover:border-chalk"
          >
            Run it again
          </button>
        </div>
      </div>

      <aside className="lg:border-l lg:border-rule-dark lg:pl-8">
        {/* The one place real numbers appear, clearly attributed. */}
        <p className="label text-chalk-faint">From the paper</p>
        <figure className="mt-4 border-l-2 border-accent-chalk pl-5">
          <blockquote className="font-serif text-subheading text-chalk">
            {quorumOutcome.empirical.statement}
          </blockquote>
          <figcaption className="mt-3 font-mono text-micro text-chalk-faint">
            {quorumOutcome.empirical.citation}
          </figcaption>
        </figure>

        <p className="mt-8 border-t border-rule-dark pt-5 font-mono text-micro leading-relaxed text-chalk-faint">
          {quorumOutcome.disclaimer}
        </p>
      </aside>
    </div>
  );
}
