import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, projectById } from "@/content/projects";
import { publications } from "@/content/publications";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectById(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.oneLiner,
    alternates: { canonical: `/work/${project.id}` },
    openGraph: {
      title: `${project.name} — Adam Kostka`,
      description: project.oneLiner,
      type: "article",
    },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectById(slug);
  if (!project) notFound();

  // Link the case study to the paper it came from, where there is one.
  const relatedPaper =
    project.id === "certified-multi-agent-verification"
      ? publications.find((p) => p.id === "uai-2026-hallucination-risk")
      : undefined;

  const index = projects.findIndex((p) => p.id === project.id);
  const nextProject = projects[(index + 1) % projects.length];

  return (
    <article>
      {/* Header */}
      <header className="border-b border-rule bg-paper pt-28 pb-16 md:pt-32">
        <div className="shell">
          <Link
            href="/#work"
            className="label inline-flex items-center gap-2 text-ink-faint transition-colors hover:text-ink"
          >
            <span aria-hidden="true">←</span>
            Selected work
          </Link>

          <p className="label mt-12 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-faint">
            <span>{project.org}</span>
            <span aria-hidden="true">·</span>
            <span>{project.period}</span>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
          </p>

          <h1 className="mt-6 max-w-[46rem] text-title">{project.name}</h1>

          <p className="measure-wide mt-6 text-lead text-ink-muted">
            {project.oneLiner}
          </p>
        </div>
      </header>

      <div className="shell py-(--spacing-section)">
        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-[minmax(0,1fr)_16rem]">
          {/* Body */}
          <div className="space-y-16">
            <Block label="Problem">
              <p className="measure-wide text-lead text-ink-muted">{project.problem}</p>
            </Block>

            <Block label="Approach">
              <ol className="measure-wide space-y-5">
                {project.approach.map((a, i) => (
                  <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-3">
                    <span className="tabular label pt-1.5 text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body text-ink-muted">{a}</span>
                  </li>
                ))}
              </ol>
            </Block>

            {project.architecture && (
              <Block label="Architecture">
                <ArchitectureDiagram architecture={project.architecture} />
              </Block>
            )}

            {project.technical && project.technical.length > 0 && (
              <Block label="Selected technical decisions">
                <dl className="space-y-8">
                  {project.technical.map((t, i) => (
                    <div key={i} className="measure-wide">
                      <dt className="font-serif text-subheading text-ink">
                        {t.decision}
                      </dt>
                      <dd className="mt-2.5 text-body text-ink-muted">{t.rationale}</dd>
                    </div>
                  ))}
                </dl>
              </Block>
            )}

            <Block label="Outcome">
              <ul className="measure-wide space-y-3.5">
                {project.contribution.map((c, i) => (
                  <li key={i} className="relative pl-5 text-body text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="absolute top-[0.7em] left-0 h-px w-2.5 bg-rule"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </Block>

            {relatedPaper && (
              <Block label="The paper">
                <div className="measure-wide border-l-2 border-accent pl-5">
                  <h3 className="font-serif text-subheading text-ink">
                    {relatedPaper.title}
                  </h3>
                  <p className="mt-2 text-small text-ink-muted">
                    {relatedPaper.authors.join(", ")} · {relatedPaper.venue}
                  </p>
                  {relatedPaper.abstract && (
                    <p className="mt-5 text-small text-ink-muted">
                      {relatedPaper.abstract}
                    </p>
                  )}
                  <Link
                    href="/#publications"
                    className="label mt-5 inline-flex items-center gap-2 text-ink transition-colors hover:text-accent"
                  >
                    All publications
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Block>
            )}
          </div>

          {/* Meta rail */}
          <aside className="space-y-9 lg:sticky lg:top-24 lg:self-start">
            <div>
              <p className="label border-t border-rule pt-4 text-ink-faint">Role</p>
              <p className="mt-3 text-small text-ink-muted">{project.role}</p>
            </div>
            <div>
              <p className="label border-t border-rule pt-4 text-ink-faint">Stack</p>
              <ul className="mt-3 space-y-1.5">
                {project.stack.map((s) => (
                  <li key={s} className="font-mono text-micro text-ink-muted">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            {project.links.length > 0 && (
              <div>
                <p className="label border-t border-rule pt-4 text-ink-faint">Links</p>
                <ul className="mt-3 space-y-2">
                  {project.links.map((l) => (
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
      </div>

      {/* Next */}
      <div className="border-t border-rule bg-paper-sunk">
        <div className="shell py-14">
          <p className="label text-ink-faint">Next</p>
          <Link
            href={`/work/${nextProject.id}`}
            className="group mt-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2"
          >
            <span className="font-serif text-heading text-ink transition-colors group-hover:text-accent">
              {nextProject.name}
            </span>
            <span className="text-small text-ink-muted">{nextProject.oneLiner}</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="label border-t border-rule pt-4 text-ink-faint">{label}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}
