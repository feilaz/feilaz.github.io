"use client";

import { useEffect, useState } from "react";

/**
 * Reduced motion, read from the OS. Defaults to `true` on first render so that
 * nothing animates before we know the answer — the safe default is stillness.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export type Tier = "off" | "low" | "high";

/**
 * Device capability tier for the agent field.
 *
 * Deliberately conservative and cheap: no benchmarking, no user-agent sniffing, no
 * layout reads. We would rather run 700 agents smoothly on a mid-range phone than
 * 1,800 badly.
 *
 * The renderer is Canvas2D, so there is no WebGL requirement — an earlier version
 * gated on a WebGL probe and would have needlessly shown the static frame to any
 * device without it.
 *
 *   off   reduced motion, no 2D context, or a very low-core device
 *   low   touch and small-viewport devices
 *   high  everything else
 */
export function useQualityTier(): Tier {
  const reduced = useReducedMotion();
  const [tier, setTier] = useState<Tier>("off");

  useEffect(() => {
    if (reduced) {
      setTier("off");
      return;
    }

    // Feature detection, not user-agent sniffing.
    let canvas2d = false;
    try {
      canvas2d = Boolean(document.createElement("canvas").getContext("2d"));
    } catch {
      canvas2d = false;
    }
    if (!canvas2d) {
      setTier("off");
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 900;

    if (cores <= 2) setTier("off");
    else if (coarse || narrow) setTier("low");
    else setTier("high");
  }, [reduced]);

  return tier;
}

/** Agent counts per tier. Tuned by eye against frame time, not chosen for a headline. */
export const agentCount: Record<Tier, number> = {
  off: 0,
  low: 700,
  high: 1800,
};

/**
 * Activation and visibility, kept separate on purpose.
 *
 *  activated  latches true the first time the element approaches the viewport. The
 *             expensive thing (building and prewarming the simulation) happens once.
 *  visible    continues to track the element, so the render loop can idle while the
 *             plate is off-screen without discarding its state.
 *
 * An earlier version conflated the two: scrolling away unmounted the canvas and
 * scrolling back rebuilt and re-prewarmed the whole field.
 */
export function useActivation<T extends Element>(
  ref: React.RefObject<T | null>,
  margin = "200px",
) {
  const [activated, setActivated] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setActivated(true);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);

  return { activated, visible };
}
