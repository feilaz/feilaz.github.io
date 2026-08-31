"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { expectedReadouts } from "./consensusField";
import { useReducedMotion } from "@/lib/useCapability";

const ConsensusCanvas = dynamic(() => import("./ConsensusCanvas"), {
  ssr: false,
  loading: () => null,
});

/** Where the automatic demonstration ends, and the visitor's starting point. */
const DEMO_TARGET = 0.88;
const DEMO_DURATION = 2600;

/**
 * Fig. 1 — the site's opening argument, as a manipulable figure.
 *
 * THREE THINGS THIS FIXES ABOUT THE VERSION IT REPLACES
 *  1. It says what it shows. There is a labelled truth line, a labelled consensus
 *     marker, a bracketed error between them, and two named readouts.
 *  2. It is interactive, with one control and one meaning: how alike the agents are.
 *  3. It performs itself once, automatically, before asking for anything. A visitor who
 *     never touches it still sees agreement rise while accuracy falls.
 *
 * It also varies per visit — the shared bias changes sign and magnitude — because a
 * figure that opens identically every time looks like a picture rather than a system.
 */
export function ConsensusFigure() {
  const reduced = useReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);
  const [painted, setPainted] = useState(false);
  const [seed, setSeed] = useState(1);
  const [rho, setRho] = useState(0);
  const [touched, setTouched] = useState(false);
  const [demoDone, setDemoDone] = useState(false);
  const [stats, setStats] = useState(() => expectedReadouts(0));

  const onStats = useCallback(
    (s: { agreement: number; consensusError: number }) => setStats(s),
    [],
  );
  const onPaint = useCallback(() => setPainted(true), []);

  // A fresh bias per visit. Chosen after mount so server and client markup match.
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 1e9) + 1);
  }, []);

  // Mount the canvas once the figure is approached and the browser is otherwise idle.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        cancelled = true;
        io.disconnect();
        const go = () => setMounted(true);
        if (document.readyState === "complete") go();
        else window.addEventListener("load", go, { once: true });
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  /**
   * The automatic demonstration. Runs once, only after the canvas is up, and stops the
   * moment the visitor takes over. Under reduced motion it is skipped and the figure
   * simply starts at the informative end.
   */
  useEffect(() => {
    if (!mounted || demoDone) return;
    if (reduced) {
      setRho(DEMO_TARGET);
      setDemoDone(true);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DEMO_DURATION);
      // Ease so the interesting middle of the range is not rushed through.
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setRho(eased * DEMO_TARGET);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDemoDone(true);
    };
    // A beat of stillness at ρ = 0 first, so the independent case is legible.
    const delay = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, 700);
    return () => {
      clearTimeout(delay);
      cancelAnimationFrame(raf);
    };
  }, [mounted, demoDone, reduced]);

  function takeOver(value: number) {
    setDemoDone(true);
    setTouched(true);
    setRho(value);
  }

  const fallback = expectedReadouts(rho);
  const agreement = painted ? stats.agreement : fallback.agreement;
  const error = painted ? stats.consensusError : fallback.consensusError;

  return (
    <figure className="m-0">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 border-t border-rule pt-4">
        <p className="label text-ink-faint">
          Fig. 1 — A panel of five hundred agents answering one question
        </p>
        <p className="label text-ink-faint">
          Model, not measurement
        </p>
      </figcaption>

      <div
        ref={hostRef}
        id="consensus-plate"
        className="relative mt-4 h-[230px] w-full overflow-hidden border border-rule bg-paper-raised sm:h-[260px] lg:h-[300px]"
      >
        {/* Pre-hydration and no-JavaScript: a legible static statement of the same idea. */}
        {!painted && <StaticFrame />}

        {mounted && (
          <ConsensusCanvas
            // Remounting on rho change is only needed in the static path; the animated
            // path reads rho from a ref inside its own loop.
            key={reduced ? `static-${rho.toFixed(2)}-${seed}` : `live-${seed}`}
            count={500}
            seed={seed}
            rho={rho}
            animate={!reduced}
            onStats={onStats}
            onPaint={onPaint}
          />
        )}

        <Ticks />
      </div>

      {/* ── The control and the readouts ── */}
      <div className="mt-5 grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <div>
          <label
            htmlFor="rho"
            className="label flex items-baseline justify-between gap-4 text-ink"
          >
            <span>How alike are the agents?</span>
            <span className="tabular text-ink-faint">
              {rho.toFixed(2)}
            </span>
          </label>

          <input
            id="rho"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={rho}
            onChange={(e) => takeOver(Number(e.target.value))}
            className="mt-3 w-full accent-accent"
            aria-describedby="rho-help"
          />

          <div className="mt-1.5 flex justify-between">
            <span className="label text-ink-faint">independent</span>
            <span className="label text-ink-faint">identical</span>
          </div>

          <p id="rho-help" className="mt-3 text-micro text-ink-muted">
            {touched
              ? "Drag it back to the left. The spread returns, and the average finds the answer again."
              : demoDone
                ? "Now drag it yourself."
                : "Watch what happens to both numbers."}
          </p>
        </div>

        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            <Readout
              label="Agreement"
              value={agreement}
              note="How tightly the panel agrees with itself"
            />
            <Readout
              label="Consensus error"
              value={error}
              accent
              note="How far the panel's answer sits from the truth"
            />
          </dl>
          <p className="mt-6 max-w-[34rem] text-small text-ink-muted">
            Both numbers rise together. Agents that share a prior agree more{" "}
            <em className="text-ink not-italic">and</em> are wrong more — which is why a
            consensus score cannot, on its own, tell you how much to trust an answer.
          </p>
        </div>
      </div>

      {/* The figure's content, in text, for screen readers and for no-JavaScript. */}
      <p className="sr-only">
        An interactive figure. Five hundred simulated agents each answer the same question;
        their answers are plotted along a horizontal axis whose centre is the correct
        answer. A single control sets how much the agents have in common, from fully
        independent to identical. With independent agents the answers spread widely but
        their average lands on the truth. As the agents become more alike the spread
        collapses — agreement reaches one hundred per cent — while the consensus drifts
        away from the truth and onto the bias they share. Agreement currently reads{" "}
        {Math.round(agreement * 100)} per cent and the consensus error reads{" "}
        {Math.round(error * 100)} per cent of the axis. This illustrates a mechanism; the
        measured results are in the UAI 2026 paper linked below.
      </p>
    </figure>
  );
}

function Readout({
  label,
  value,
  note,
  accent = false,
}: {
  label: string;
  value: number;
  note: string;
  accent?: boolean;
}) {
  // A <dl> may only contain dt, dd, or a div wrapping them — so the explanatory note
  // lives inside the <dd> rather than as a sibling paragraph.
  return (
    <div>
      <dt className="label text-ink-faint">{label}</dt>
      <dd className="mt-1.5">
        <span
          className={`tabular font-serif text-title leading-none ${
            accent ? "text-accent" : "text-ink"
          }`}
        >
          {Math.round(value * 100)}
          <span className="ml-1 font-sans text-subheading">%</span>
        </span>
        <span className="mt-2 block max-w-[15rem] text-micro text-ink-faint">
          {note}
        </span>
      </dd>
    </div>
  );
}

/**
 * The no-JavaScript rendering. Not a picture of the simulation — a plain statement of
 * what the simulation demonstrates, which is more use than a static scatter would be.
 */
function StaticFrame() {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-6">
      <p className="measure text-center text-small text-ink-muted">
        <span className="text-ink">
          Independent agents spread out but average onto the right answer.
        </span>{" "}
        Identical agents agree completely and land on whatever bias they share. The
        interactive version of this figure needs JavaScript; the argument does not.
      </p>
    </div>
  );
}

function Ticks() {
  const common = "absolute h-2.5 w-2.5 border-ink-faint/45";
  return (
    <div aria-hidden="true">
      <span className={`${common} top-2 left-2 border-t border-l`} />
      <span className={`${common} top-2 right-2 border-t border-r`} />
      <span className={`${common} bottom-2 left-2 border-b border-l`} />
      <span className={`${common} bottom-2 right-2 border-b border-r`} />
    </div>
  );
}
