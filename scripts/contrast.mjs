/**
 * WCAG contrast audit for the palette.
 *
 *   node scripts/contrast.mjs
 *
 * Checks the foreground/background pairs the site actually uses, rather than the
 * whole cross product. Run this before changing any colour token — axe found 105
 * contrast failures on the first pass, all of them from two "faint" tones.
 */

const C = {
  paper: "#f6f4ef",
  paperSunk: "#efece4",
  paperRaised: "#fbfaf7",
  ink: "#191713",
  inkMuted: "#55524a",
  inkFaint: "#6a665d",
  void: "#121110",
  voidRaised: "#1b1917",
  chalk: "#ece8df",
  chalkMuted: "#9d988c",
  chalkFaint: "#8a857a",
  accent: "#b93f22",
  accentChalk: "#e0663f",
  agree: "#4a7c59",
  agreeChalk: "#7fb08d",
};

function lin(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(fg, bg) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** [foreground, background, label, isLargeText] */
const PAIRS = [
  [C.ink, C.paper, "body text on paper"],
  [C.inkMuted, C.paper, "muted prose on paper"],
  [C.inkFaint, C.paper, "labels/captions on paper"],
  [C.inkFaint, C.paperSunk, "labels on sunk paper"],
  [C.inkFaint, C.paperRaised, "captions on raised paper"],
  [C.inkMuted, C.paperSunk, "muted prose on sunk paper"],
  [C.ink, C.paperSunk, "body text on sunk paper"],
  [C.accent, C.paper, "accent link on paper"],
  [C.accent, C.paperSunk, "accent on sunk paper"],
  [C.paper, C.ink, "inverted button label"],
  [C.chalk, C.void, "body text on void"],
  [C.chalkMuted, C.void, "muted prose on void"],
  [C.chalkFaint, C.void, "labels on void"],
  [C.chalkFaint, C.voidRaised, "labels on raised void"],
  [C.chalkMuted, C.voidRaised, "muted prose on raised void"],
  [C.chalk, C.voidRaised, "body text on raised void"],
  [C.accentChalk, C.void, "accent on void"],
  [C.accentChalk, C.voidRaised, "accent on raised void"],
  [C.agreeChalk, C.void, "agree signal on void"],
  [C.agreeChalk, C.voidRaised, "agree signal on raised void"],
  [C.void, C.chalk, "inverted button label on void surface"],
];

let failures = 0;
console.log("pair".padEnd(38), "ratio", " AA(4.5)  AA-large(3.0)");
for (const [fg, bg, label] of PAIRS) {
  const r = ratio(fg, bg);
  const aa = r >= 4.5;
  const aaLarge = r >= 3;
  if (!aa) failures++;
  console.log(
    label.padEnd(38),
    r.toFixed(2).padStart(5),
    aa ? "  PASS  " : "  FAIL  ",
    aaLarge ? "PASS" : "FAIL",
  );
}

console.log(
  `\n${PAIRS.length - failures}/${PAIRS.length} pairs meet AA for normal text.`,
);
if (failures) process.exitCode = 1;
