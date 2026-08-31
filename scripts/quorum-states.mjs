/**
 * Drives the QUORUM interaction end to end and captures every state.
 *
 *   node scripts/quorum-states.mjs [outDir] [--url=...] [--width=1440]
 *
 * Asserts the pedagogy actually works: round 1 rewards trust, round 2 punishes it,
 * round 3 rewards overruling the majority. If that arc ever breaks, the interaction
 * stops teaching anything and this script fails loudly.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith("--")) ?? "shots/quorum";
const base = args.find((a) => a.startsWith("--url="))?.slice(6) ?? "http://localhost:3111";
const width = Number(args.find((a) => a.startsWith("--width="))?.slice(8) ?? 1440);

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width, height: width < 500 ? 844 : 1000 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

const tag = width < 500 ? "phone" : "desktop";
const results = [];

await page.goto(base, { waitUntil: "networkidle" });
await page.locator("#research").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

const panel = page.locator("#research >> xpath=.//div[contains(@class,'border-rule-dark')][1]");

async function shot(name) {
  const el = await page.$("#research");
  await el.screenshot({ path: `${outDir}/${tag}-${name}.png` });
}

/**
 * innerText reflects rendered text, and the verdict label is styled
 * `text-transform: uppercase`. Matching case-sensitively silently reported every
 * round as a failure while one expectation passed by coincidence — hence /i.
 */
const saysRight = (text) => /your decision:\s*correct/i.test(text);

await shot("00-intro");

// The arc under test: trust, trust, trust. Rounds 1 and 3 differ in whether that is
// the right call, which is the entire point of the sequence.
await page.getByRole("button", { name: /begin/i }).click();
await page.waitForTimeout(1200);
await shot("01-round1-answering");

const claim1 = await page.locator("#research h3").first().innerText();

await page.getByRole("button", { name: /trust the ensemble/i }).click();
await page.waitForTimeout(900);
await shot("02-round1-revealed");
const verdict1 = await page.locator("#research").innerText();
results.push({
  round: 1,
  claim: claim1.slice(0, 60),
  rewardedTrust: saysRight(verdict1),
});

await page.getByRole("button", { name: /next claim/i }).click();
await page.waitForTimeout(1300);
await shot("03-round2-answering");

await page.getByRole("button", { name: /trust the ensemble/i }).click();
await page.waitForTimeout(900);
await shot("04-round2-revealed-the-trap");
const verdict2 = await page.locator("#research").innerText();
results.push({
  round: 2,
  rewardedTrust: saysRight(verdict2),
  showsUnanimity: /5 \/ 5/.test(verdict2),
});

await page.getByRole("button", { name: /next claim/i }).click();
await page.waitForTimeout(1300);
await shot("05-round3-answering");

await page.getByRole("button", { name: /overrule it/i }).click();
await page.waitForTimeout(900);
await shot("06-round3-revealed");
const verdict3 = await page.locator("#research").innerText();
results.push({ round: 3, rewardedOverrule: saysRight(verdict3) });

await page.getByRole("button", { name: /what this means/i }).click();
await page.waitForTimeout(900);
await shot("07-outcome");
const outcome = await page.locator("#research").innerText();

// Assertions
const checks = {
  "round 1 rewards trusting a diverse majority": results[0].rewardedTrust === true,
  "round 2 punishes trusting a unanimous single-lineage ensemble":
    results[1].rewardedTrust === false,
  "round 2 shows 5/5 agreement": results[1].showsUnanimity === true,
  "round 3 rewards overruling the majority": results[2].rewardedOverrule === true,
  "outcome cites the paper": outcome.includes("UAI 2026") && outcome.includes("PMLR 337"),
  "outcome states the real figures": outcome.includes("71.7%") && outcome.includes("47.4%"),
  "outcome labels itself a demonstration": /demonstration/i.test(outcome),
  "no console errors": errors.length === 0,
};

console.log(JSON.stringify({ results, checks, errors }, null, 2));

await browser.close();

const failed = Object.entries(checks).filter(([, ok]) => !ok);
if (failed.length) {
  console.error("\nFAILED:", failed.map(([k]) => k).join("; "));
  process.exit(1);
}
console.log("\nAll QUORUM checks passed.");
