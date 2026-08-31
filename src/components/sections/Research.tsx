import Link from "next/link";
import { Quorum } from "@/components/research/Quorum";
import { publications, featuredPublication } from "@/content/publications";
import { sectionPurpose } from "@/content/site";

/**
 * 03 — RESEARCH
 *
 * The one dark region on the site. Everything else is paper; this reads as an
 * instrument panel, which is what earns the interaction its weight. If every section
 * looked like this the effect would be worth nothing.
 */
export function Research() {
  const supporting = publications
    .filter((p) => p.id !== featuredPublication.id && p.findings)
    .slice(0, 1);

  return (
    <section
      id="research"
      data-surface="void"
      className="on-void scroll-mt-14 bg-void py-(--spacing-section) text-chalk"
      aria-labelledby="research-heading"
    >
      <div className="shell">
        <header className="border-t border-rule-dark pt-5">
          <p className="label flex items-center gap-3 text-chalk-faint">
            <span aria-hidden="true">02</span>
            <span>Research</span>
          </p>
          <p className="mt-2.5 text-micro text-chalk-faint">
            {sectionPurpose("research")}
          </p>
          <h2 id="research-heading" className="mt-6 max-w-[46rem] text-title">
            Multi-agent systems fail together, and they look confident doing it.
          </h2>
          <p className="measure-wide mt-6 text-lead text-chalk-muted">
            The quickest way to see why is to run into it yourself. Below is the failure
            mode my UAI 2026 paper addresses, in three claims.
          </p>
        </header>

        <div className="mt-14">
          <Quorum />
        </div>

        {/* Selected research, kept deliberately short. The full list lives below. */}
        <div className="mt-20 grid gap-10 border-t border-rule-dark pt-10 lg:grid-cols-2 lg:gap-14">
          <ResearchCard
            eyebrow={`${featuredPublication.venueShort} · ${featuredPublication.kind}`}
            title={featuredPublication.title}
            body={featuredPublication.summary}
            findings={featuredPublication.findings}
            href="/work/certified-multi-agent-verification"
            cta="Read the case study"
          />
          {supporting.map((p) => (
            <ResearchCard
              key={p.id}
              eyebrow={`${p.venueShort} · ${p.kind}`}
              title={p.title}
              body={p.summary}
              findings={p.findings}
              href="/#publications"
              cta="See in publications"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchCard({
  eyebrow,
  title,
  body,
  findings,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  findings?: string[];
  href: string;
  cta: string;
}) {
  return (
    <article className="group">
      <p className="label text-chalk-faint">{eyebrow}</p>
      <h3 className="mt-4 font-serif text-heading text-chalk">
        <Link href={href} className="link-rule hover:text-accent-chalk">
          {title}
        </Link>
      </h3>
      <p className="mt-5 text-body text-chalk-muted">{body}</p>

      {findings && (
        <ul className="mt-6 space-y-3 border-t border-rule-dark pt-5">
          {findings.slice(0, 2).map((f, i) => (
            <li key={i} className="relative pl-5 text-small text-chalk-muted">
              <span
                aria-hidden="true"
                className="absolute top-[0.62em] left-0 h-px w-2.5 bg-chalk-faint"
              />
              {f}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={href}
        className="label mt-6 inline-flex items-center gap-2 text-chalk transition-colors hover:text-accent-chalk"
      >
        {cta}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
