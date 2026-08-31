import Link from "next/link";
import { projects } from "@/content/projects";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { Section } from "@/components/ui/Section";
import { sectionPurpose } from "@/content/site";

/**
 * 04 — SELECTED WORK
 *
 * Back on paper, and deliberately more conventional than the section above it. Each
 * card answers the four questions a reader actually has — what, why, my part,
 * what was hard — before offering the full case study.
 */
export function Work() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      index="03"
      label="Selected work"
      purpose={sectionPurpose("work")}
      title="Things I have built"
      lede="Three shipped to real users; one is a research system. Each case study states the problem, what I did, and which part was actually hard."
    >
      <div className="space-y-20">
        {featured.map((p, i) => (
          <article key={p.id} className="border-t border-rule pt-8">
            <div className="grid min-w-0 gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
              <div className="min-w-0">
                <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-faint">
                  <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.org}</span>
                  <span aria-hidden="true">·</span>
                  <span>{p.status}</span>
                </p>

                <h3 className="mt-5 text-heading">
                  <Link
                    href={`/work/${p.id}`}
                    className="link-rule hover:text-accent"
                  >
                    {p.name}
                  </Link>
                </h3>

                <p className="measure-wide mt-4 text-lead text-ink-muted">
                  {p.problem}
                </p>

                <dl className="mt-8 space-y-6">
                  <div>
                    <dt className="label text-ink-faint">What I did</dt>
                    <dd className="measure-wide mt-2.5">
                      <ul className="space-y-2.5">
                        {p.approach.slice(0, 3).map((a, j) => (
                          <li
                            key={j}
                            className="relative pl-5 text-small text-ink-muted"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute top-[0.62em] left-0 h-px w-2.5 bg-rule"
                            />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>

                {p.architecture && (
                  <div className="mt-10 min-w-0">
                    <ArchitectureDiagram architecture={p.architecture} />
                  </div>
                )}

                <Link
                  href={`/work/${p.id}`}
                  className="label mt-8 inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                >
                  Full case study
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <aside className="space-y-7 lg:self-start lg:border-l lg:border-rule-soft lg:pl-10">
                <div>
                  <p className="label text-ink-faint">Outcome</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {p.contribution.slice(0, 2).map((c, j) => (
                      <li key={j} className="text-small text-ink">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="label text-ink-faint">Role</p>
                  <p className="mt-2.5 text-small text-ink-muted">{p.role}</p>
                </div>

                <div>
                  <p className="label text-ink-faint">Stack</p>
                  <p className="mt-2.5 font-mono text-micro text-ink-muted">
                    {p.stack.join(" · ")}
                  </p>
                </div>

                {p.links.length > 0 && (
                  <div>
                    <p className="label text-ink-faint">Links</p>
                    <ul className="mt-2.5 space-y-1.5">
                      {p.links.map((l) => (
                        <li key={l.href}>
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className="link-rule text-small text-ink-muted hover:text-accent"
                          >
                            {l.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </article>
        ))}
      </div>

      {/* Everything else, as a compact index rather than more cards. */}
      <div className="mt-20 border-t border-rule pt-8">
        <p className="label text-ink-faint">Also</p>
        <ul className="mt-6 divide-y divide-rule-soft">
          {rest.map((p) => (
            <li key={p.id}>
              <Link
                href={`/work/${p.id}`}
                className="group grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto]"
              >
                <span className="text-body text-ink transition-colors group-hover:text-accent">
                  {p.name}
                </span>
                <span className="text-small text-ink-muted">{p.oneLiner}</span>
                <span className="label self-center text-ink-faint">{p.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
