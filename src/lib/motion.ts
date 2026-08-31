/**
 * The site's entire motion vocabulary, in one file.
 *
 * Rule: components import from here. Nobody invents a duration or an easing curve
 * locally. If a motion doesn't fit one of these, the motion is probably wrong.
 */

/** Matches --ease-out-quint in globals.css. Used for anything entering. */
export const easeOut = [0.22, 1, 0.36, 1] as const;
/** Matches --ease-in-out-quart. Used for anything that moves and settles. */
export const easeInOut = [0.76, 0, 0.24, 1] as const;

export const duration = {
  fast: 0.18,
  base: 0.32,
  slow: 0.62,
} as const;

/** The one spring used for physical-feeling interactions. */
export const spring = {
  type: "spring" as const,
  stiffness: 220,
  damping: 30,
  mass: 0.9,
};

/** A softer spring for larger elements, so big things feel heavier. */
export const springSoft = {
  type: "spring" as const,
  stiffness: 120,
  damping: 24,
  mass: 1.1,
};

/**
 * Section reveal. Deliberately small: 12px and a fade. Content is never hidden
 * for long, and never waits on an animation to become readable.
 */
export const revealUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: duration.slow, ease: easeOut },
};

/** For lists: a short stagger, capped so long lists don't crawl. */
export function stagger(index: number, step = 0.055, cap = 6) {
  return Math.min(index, cap) * step;
}

/** Viewport config used by every scroll-triggered reveal on the site. */
export const inView = { once: true, margin: "-12% 0px -12% 0px" } as const;
