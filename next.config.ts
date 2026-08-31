import type { NextConfig } from "next";

/**
 * Static export, for GitHub Pages.
 *
 * The site has no server dependencies — no API routes, no server actions, no
 * middleware, no runtime image optimisation — so `output: "export"` produces the whole
 * thing as files. `sitemap.ts`, `robots.ts` and `opengraph-image.tsx` are all evaluated
 * at build time and emitted as static assets.
 *
 * `trailingSlash` matters here: without it the export emits `out/work/foo.html`, and
 * while GitHub Pages will usually resolve `/work/foo` to it, relative links and any
 * future host are more predictable when every route is a real directory with an
 * `index.html` inside it.
 *
 * The deploy workflow also writes a `.nojekyll` file into the output. Without it GitHub
 * Pages runs the output through Jekyll, which silently discards any directory beginning
 * with an underscore — including `_next`, which is every script and stylesheet on the
 * site.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // No image optimisation server exists in an export.
    unoptimized: true,
  },
};

export default nextConfig;
