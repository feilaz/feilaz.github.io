/**
 * Visual QA harness.
 *
 *   node scripts/shots.mjs [outDir] [--full] [--url=http://localhost:3000]
 *
 * Captures each viewport twice where useful: a full-page shot for rhythm and
 * density, and section-scoped shots for detail. Reduced-motion and no-WebGL
 * variants are captured too, because those are real states for real visitors.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--")) ?? "shots/latest";
const base =
  args.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://localhost:3000";
const only = args.find((a) => a.startsWith("--only="))?.slice(7);

const VIEWPORTS = [
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "laptop-1280", width: 1280, height: 800 },
  { name: "tablet-834", width: 834, height: 1112 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-narrow-320", width: 320, height: 720 },
];

const SECTIONS = ["hero", "now", "research", "work", "publications", "experience", "about"];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  if (only && !vp.name.includes(only)) continue;

  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();

  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

  await page.goto(base, { waitUntil: "networkidle" });
  // Let the agent field fade in and settle.
  await page.waitForTimeout(2600);

  await page.screenshot({
    path: `${outDir}/${vp.name}-full.png`,
    fullPage: true,
  });
  await page.screenshot({ path: `${outDir}/${vp.name}-fold.png` });

  // Section-scoped shots at the two most important widths.
  if (vp.name === "desktop-1440" || vp.name === "phone-390") {
    for (const id of SECTIONS) {
      const el = await page.$(`#${id}`);
      if (!el) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(700);
      await el.screenshot({ path: `${outDir}/${vp.name}-section-${id}.png` }).catch(() => {});
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }

  results.push({ viewport: vp.name, errors });
  await context.close();
}

// Reduced motion
if (!only) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${outDir}/reduced-motion-full.png`, fullPage: true });
  await ctx.close();

  // No WebGL: the plate must still look intentional.
  const ctx2 = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await ctx2.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
      if (String(type).includes("webgl")) return null;
      return orig.call(this, type, ...rest);
    };
  });
  const page2 = await ctx2.newPage();
  await page2.goto(base, { waitUntil: "networkidle" });
  await page2.waitForTimeout(1500);
  await page2.screenshot({ path: `${outDir}/no-webgl-fold.png` });
  await ctx2.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));
console.log(`\nWrote screenshots to ${outDir}`);
