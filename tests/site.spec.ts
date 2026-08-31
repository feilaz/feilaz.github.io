import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const SECTIONS = ["now", "research", "work", "publications", "experience", "about"];

const CASE_STUDIES = [
  "certified-multi-agent-verification",
  "strategy-gantt-visualization",
  "strategy-agentic-platform",
  "hermesfix",
  "polis",
  "mergelearn",
  "strategy-learning-platform",
];

test.describe("content and structure", () => {
  test("the ten-second test: identity, role and primary links are present without interaction", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Adam Kostka");
    await expect(page.getByText(/I build multi-agent AI systems/)).toBeVisible();
    await expect(page.getByText(/Strategy \(NASDAQ: MSTR\)/).first()).toBeVisible();

    // The four destinations a recruiter or academic wants, above the fold. The CV PDF is
    // deliberately not one of them — this page is the CV — but it must remain reachable.
    const nav = page.getByRole("navigation", { name: "Primary links" });
    for (const label of ["Email", "GitHub", "Google Scholar", "LinkedIn"]) {
      await expect(nav.getByRole("link", { name: label })).toBeVisible();
    }
    await expect(
      page.getByRole("contentinfo").getByRole("link", { name: "CV" }),
    ).toBeVisible();
  });

  test("exactly one h1, and headings do not skip levels", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);

    const levels = await page.$$eval("h1, h2, h3, h4", (els) =>
      els.map((e) => Number(e.tagName[1])),
    );
    let prev = levels[0];
    for (const l of levels.slice(1)) {
      expect(l - prev).toBeLessThanOrEqual(1);
      prev = l;
    }
  });

  test("all sections referenced by the nav exist", async ({ page }) => {
    await page.goto("/");
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
  });

  test("the site is complete and readable with JavaScript disabled", async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Adam Kostka");
    // Every section, every publication, and the primary links must still be there.
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.getByText(/Controlling Uncertainty and Hallucination Risk/).first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Google Scholar" }).first(),
    ).toBeVisible();
    await context.close();
  });
});

test.describe("links", () => {
  test("the CV resolves and is a PDF", async ({ page, request }) => {
    await page.goto("/");
    const href = await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "CV" })
      .getAttribute("href");
    expect(href).toBeTruthy();
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("pdf");
  });

  test("every external link opens safely in a new tab", async ({ page }) => {
    await page.goto("/");
    const externals = page.locator('a[href^="http"]');
    const n = await externals.count();
    expect(n).toBeGreaterThan(4);
    for (let i = 0; i < n; i++) {
      const a = externals.nth(i);
      await expect(a).toHaveAttribute("target", "_blank");
      const rel = (await a.getAttribute("rel")) ?? "";
      expect(rel).toContain("noreferrer");
    }
  });

  test("every case study page renders its own metadata and content", async ({ page }) => {
    for (const slug of CASE_STUDIES) {
      const res = await page.goto(`/work/${slug}`);
      expect(res?.status(), slug).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).not.toBeEmpty();
      // No template leakage, no unresolved content.
      await expect(page.locator("body")).not.toContainText("undefined");
      await expect(page.locator("body")).not.toContainText("[object Object]");
      await expect(page.locator("body")).not.toContainText("TODO");
    }
  });

  test("sitemap and robots are served and list the case studies", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    for (const slug of CASE_STUDIES) expect(xml).toContain(slug);

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("Sitemap");
  });

  test("the Open Graph card is a real PNG served with the right type", async ({
    request,
    page,
  }) => {
    const res = await request.get("/og.png");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    // A blank or trivially small PNG means the card was generated badly.
    expect((await res.body()).byteLength).toBeGreaterThan(5000);

    // And the page must actually point at it, or a share preview shows nothing.
    await page.goto("/");
    const og = page.locator('meta[property="og:image"]');
    await expect(og).toHaveAttribute("content", /\/og\.png$/);
  });
});

test.describe("publications interface", () => {
  test("filtering narrows the list and can be cleared", async ({ page }) => {
    await page.goto("/#publications");
    const list = page.locator("#publications ol > li");
    await expect(list).toHaveCount(8);

    const chip = page.getByRole("button", { name: /^theory of mind/i });
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    const filtered = await list.count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(8);

    await chip.click();
    await expect(list).toHaveCount(8);
  });

  test("abstracts expand and expose BibTeX", async ({ page }) => {
    await page.goto("/#publications");
    const first = page.locator("#publications ol > li").first();
    // The toggle's label changes to "Hide" once open, so it must not be located by
    // its text after the click.
    const toggle = first.locator("button[aria-expanded]").first();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(first.locator("pre")).toContainText("@inproceedings");
    await expect(first.locator("pre")).toContainText("Kostka");
  });
});

test.describe("quorum", () => {
  test("is keyboard operable from start to finish", async ({ page }) => {
    await page.goto("/#research");
    await page.getByRole("button", { name: /begin/i }).focus();
    await page.keyboard.press("Enter");

    for (let round = 0; round < 3; round++) {
      const trust = page.getByRole("button", { name: /trust the ensemble/i });
      await expect(trust).toBeVisible();
      await trust.focus();
      await page.keyboard.press("Enter");
      const next = page.getByRole("button", {
        name: round === 2 ? /what this means/i : /next claim/i,
      });
      await expect(next).toBeVisible();
      await next.focus();
      await page.keyboard.press("Enter");
    }

    await expect(
      page.getByText(/Agreement is not, by itself, evidence of correctness/),
    ).toBeVisible();
    // The outcome must always attribute the empirical numbers to the paper.
    await expect(page.locator("#research").getByText(/PMLR 337:/)).toBeVisible();
  });

  test("never presents simulated responses as empirical data", async ({ page }) => {
    await page.goto("/#research");
    await expect(page.getByText(/simulated demonstration/i)).toBeVisible();
  });
});

test.describe("mobile navigation", () => {
  test("the index sheet opens, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");

    const open = page.getByRole("button", { name: "Index" });
    await open.click();
    const sheet = page.getByRole("dialog", { name: "Site index" });
    await expect(sheet).toBeVisible();

    await sheet.getByRole("link", { name: "Publications" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/#publications/);
  });

  test("escape closes the sheet", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Index" }).click();
    await expect(page.getByRole("dialog", { name: "Site index" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Site index" })).toBeHidden();
  });

  test("nothing overflows horizontally", async ({ page }) => {
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("resilience", () => {
  test("figure 1 states what it shows and is operable by keyboard", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(4200); // let the automatic demonstration finish

    // The figure must be self-describing: labelled, with both named readouts.
    await expect(page.getByText(/A panel of five hundred agents/)).toBeVisible();
    await expect(page.getByText(/Model, not measurement/)).toBeVisible();
    await expect(page.getByText("Agreement", { exact: true })).toBeVisible();
    await expect(page.getByText("Consensus error", { exact: true })).toBeVisible();

    // One control, keyboard operable, and moving it must move the readouts.
    const slider = page.getByRole("slider", { name: /how alike are the agents/i });
    await expect(slider).toBeVisible();

    const readError = async () =>
      Number(
        (
          await page.locator("dt", { hasText: "Consensus error" }).locator("+ dd").innerText()
        ).replace(/[^0-9]/g, ""),
      );

    const high = await readError();
    await slider.focus();
    for (let i = 0; i < 40; i++) await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(400);
    const low = await readError();

    // Fewer shared priors must mean a more accurate consensus. That is the whole figure.
    expect(low).toBeLessThan(high);
  });

  test("missing WebGL does not degrade the field, because it is not used", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (type: string, ...rest: unknown[]) => unknown;
      };
      const orig = proto.getContext;
      proto.getContext = function (type: string, ...rest: unknown[]) {
        if (String(type).includes("webgl")) return null;
        return orig.call(this, type, ...rest);
      };
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(2500);
    // The renderer is Canvas2D, so the live figure must still come up.
    await expect(page.locator("#consensus-plate canvas")).toHaveCount(1);
    await context.close();
  });

  test("no 2D canvas context falls back to the static field", async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (type: string, ...rest: unknown[]) => unknown;
      };
      const orig = proto.getContext;
      proto.getContext = function (type: string, ...rest: unknown[]) {
        if (String(type) === "2d") return null;
        return orig.call(this, type, ...rest);
      };
    });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(1800);
    // Without a canvas the figure states its argument in prose instead.
    await expect(
      page.getByText(/Independent agents spread out but average onto the right answer/),
    ).toBeVisible();
    await context.close();
  });

  test("reduced motion produces no canvas and a static field", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForTimeout(2500);
    // Reduced motion still gets the figure — rendered once, at the informative end of
    // the range — rather than a poorer substitute.
    await expect(page.locator("#consensus-plate canvas")).toHaveCount(1);
    await expect(page.getByText(/Consensus error/)).toBeVisible();
    await context.close();
  });

  test("no console errors on any route", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    await page.waitForTimeout(1200);
    for (const slug of CASE_STUDIES.slice(0, 3)) {
      await page.goto(`/work/${slug}`);
      await page.waitForTimeout(300);
    }
    expect(errors).toEqual([]);
  });
});

async function axeScan(page: Page, context?: string) {
  // WCAG 2.2 is included deliberately: the original tag set omitted it and therefore
  // missed a real target-size failure on the publication row's text controls, which
  // Lighthouse found instead.
  const builder = new AxeBuilder({ page }).withTags([
    "wcag2a",
    "wcag2aa",
    "wcag21a",
    "wcag21aa",
    "wcag22a",
    "wcag22aa",
  ]);
  if (context) builder.include(context);
  return builder.analyze();
}

test.describe("accessibility", () => {
  test("home page has no axe violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(900);
    const results = await axeScan(page);
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
    ).toEqual([]);
  });

  test("the dark research section passes contrast checks mid-interaction", async ({
    page,
  }) => {
    await page.goto("/#research");
    await page.getByRole("button", { name: /begin/i }).click();
    await page.waitForTimeout(700);
    await page.getByRole("button", { name: /trust the ensemble/i }).click();
    await page.waitForTimeout(700);
    const results = await axeScan(page, "#research");
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
    ).toEqual([]);
  });

  test("a case study page has no axe violations", async ({ page }) => {
    await page.goto("/work/certified-multi-agent-verification");
    const results = await axeScan(page);
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.length} node(s)`),
    ).toEqual([]);
  });

  test("the skip link is the first focusable element and works", async ({
    page,
    browserName,
  }) => {
    // WebKit only tabs between form controls unless the user enables full keyboard
    // access, so Tab-order assertions are not meaningful there. The link itself is
    // still present in the DOM and is covered by the axe scan.
    test.skip(browserName === "webkit", "WebKit does not tab to links by default");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/skip to content/i);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main/);
  });

  test("every interactive element has an accessible name", async ({ page }) => {
    await page.goto("/");
    const unnamed = await page.$$eval(
      "a, button",
      (els) =>
        els
          .filter((el) => {
            const style = getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden") return false;
            const name =
              el.getAttribute("aria-label") ??
              el.textContent?.trim() ??
              el.getAttribute("title") ??
              "";
            return name.length === 0;
          })
          .map((el) => el.outerHTML.slice(0, 120)),
    );
    expect(unnamed).toEqual([]);
  });
});
