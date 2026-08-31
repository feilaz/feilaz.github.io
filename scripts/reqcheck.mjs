import { chromium } from "playwright";
const b = await chromium.launch();
const p = await (await b.newContext()).newPage();
p.on("response", r => { if (r.status() >= 400) console.log("  ", r.status(), r.url()); });
p.on("requestfailed", r => console.log("   FAILED", r.url(), r.failure()?.errorText));
await p.goto("https://feilaz.github.io/", { waitUntil: "networkidle" });
await p.waitForTimeout(3000);
await b.close();
