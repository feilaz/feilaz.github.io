import { site, primaryLinks, scholarMetrics } from "@/content/site";
import { publications } from "@/content/publications";
import { ConsensusFigure } from "@/components/agents/ConsensusFigure";

/**
 * 00 / 01 — FIRST PAINT + HERO
 *
 * Everything except the figure is server-rendered HTML: name, positioning, the four
 * destinations, and the record. If the figure never loads, the hero loses a figure and
 * nothing else.
 *
 * ORDER NOTE
 * Identity → destinations → figure → record. The figure carries the site's central
 * argument, so it comes before the citation counts and sits inside the first screen on a
 * laptop. An earlier arrangement put the record above it and pushed the figure out of
 * view, which defeated the point of having it.
 */
export function Hero() {
  return (
    <section id="hero" className="relative border-b border-rule pt-20 pb-16 md:pt-24">
      <div className="shell">
        <p className="label text-ink-faint">{site.eyebrow}</p>

        <h1 className="mt-5 text-display">{site.name}</h1>

        <p className="measure-wide mt-6 font-serif text-heading text-ink">
          {site.headline}
        </p>

        <p className="measure-wide mt-5 text-body text-ink-muted">{site.subline}</p>

        <nav aria-label="Primary links" className="mt-8">
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-3">
            {primaryLinks.map((l, i) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  className={
                    i === 0
                      ? "label inline-flex min-h-11 items-center border border-ink bg-ink px-4 text-paper transition-colors hover:border-accent hover:bg-accent"
                      : "label inline-flex min-h-11 items-center border border-rule px-4 text-ink transition-colors hover:border-ink"
                  }
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Fig. 1 ─────────────────────────────────────────── */}
        <div className="mt-12">
          <ConsensusFigure />
        </div>

        {/* ── The record, as a hero footer ───────────────────── */}
        <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-5 border-t border-rule pt-6 sm:flex sm:gap-x-14">
          <Stat
            label="Peer-reviewed"
            value={String(publications.length)}
            note={`${publications.filter((p) => p.status === "published").length} published`}
          />
          <Stat
            label="Citations"
            value={String(scholarMetrics.citations)}
            note={`h-index ${scholarMetrics.hIndex}`}
          />
          <Stat label="Latest" value="UAI 2026" note="PMLR 337" />
        </dl>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div>
      <dt className="label text-ink-faint">{label}</dt>
      <dd className="mt-1.5 flex items-baseline gap-2">
        <span className="tabular font-serif text-subheading text-ink">{value}</span>
        <span className="text-micro text-ink-faint">{note}</span>
      </dd>
    </div>
  );
}
