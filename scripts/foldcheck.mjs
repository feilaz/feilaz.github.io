import { chromium } from "playwright";
const b = await chromium.launch();
for (const h of [900, 800, 1080]) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: h } });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3111/", { waitUntil: "networkidle" });
  await p.waitForTimeout(4500);
  const r = await p.evaluate((vh) => {
    const plate = document.getElementById("consensus-plate");
    const box = plate.getBoundingClientRect();
    const visible = Math.max(0, Math.min(box.bottom, vh) - Math.max(box.top, 0));
    return { top: Math.round(box.top), height: Math.round(box.height), visiblePx: Math.round(visible), pct: Math.round((visible / box.height) * 100) };
  }, h);
  console.log(`viewport ${1440}x${h}: plate top ${r.top}px, ${r.pct}% of the figure visible`);
  await ctx.close();
}
await b.close();
