import { chromium } from "playwright";
const URL = process.argv[2] ?? "https://feilaz.github.io/";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errors = [], failed = [];
p.on("console", m => m.type() === "error" && errors.push(m.text()));
p.on("pageerror", e => errors.push(e.message));
p.on("requestfailed", r => failed.push(r.url()));
p.on("response", r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

await p.goto(URL, { waitUntil: "networkidle" });
await p.waitForTimeout(5000);

const out = await p.evaluate(() => {
  const h1 = document.querySelector("h1");
  const canvas = document.querySelector("#consensus-plate canvas");
  const slider = document.querySelector("#rho");
  const serif = getComputedStyle(h1).fontFamily;
  return {
    h1: h1?.textContent,
    fontLoaded: serif.includes("Newsreader"),
    canvasPresent: !!canvas,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    sliderValue: slider?.value,
    quorumPresent: !!document.querySelector("#research"),
  };
});
console.log(JSON.stringify(out, null, 1));

// Drive the figure: does the readout actually respond on the live site?
const readError = async () => Number((await p.locator('dt:has-text("Consensus error") + dd').innerText()).replace(/[^0-9]/g, ""));
const before = await readError();
await p.locator("#rho").focus();
for (let i = 0; i < 40; i++) await p.keyboard.press("ArrowLeft");
await p.waitForTimeout(500);
const after = await readError();
console.log(`consensus error: ${before}% -> ${after}% (must fall)`, after < before ? "OK" : "FAIL");

await p.screenshot({ path: "shots/live-fold.png" });
console.log("console errors:", errors.length ? errors : "none");
console.log("failed requests:", failed.length ? failed.slice(0,5) : "none");
await b.close();
