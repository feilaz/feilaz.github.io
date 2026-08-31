"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  allTopics,
  publicationsByRecency,
  toBibTeX,
  venueBreakdown,
  type Publication,
  type Topic,
} from "@/content/publications";
import { site, scholarMetrics, sectionPurpose } from "@/content/site";
import { duration, easeOut } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useCapability";
import { cn } from "@/lib/cn";

/**
 * 05 — PUBLICATIONS
 *
 * This stays a publication list. Filtering reorders it with a layout transition so
 * the reader can see items move rather than blink, but the text never moves while
 * being read and the list is fully usable with filtering ignored entirely.
 */
/**
 * States the venue distribution in words. An academic reviewer noted that a single
 * "eight peer-reviewed papers" headline flattens a flagship conference paper, a
 * journal article, a technical communication and a workshop paper into one number.
 */
const venueSentence = (() => {
  const label: Record<string, [string, string]> = {
    conference: ["conference paper", "conference papers"],
    journal: ["journal article", "journal articles"],
    workshop: ["workshop paper", "workshop papers"],
    "technical communication": ["technical communication", "technical communications"],
  };
  const parts = Object.entries(venueBreakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([kind, n]) => `${n} ${label[kind][n === 1 ? 0 : 1]}`);
  const last = parts.pop();
  return `${parts.join(", ")} and ${last}.`;
})();

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label text-ink-faint">{label}</dt>
      <dd className="tabular mt-2 font-serif text-heading text-ink">{value}</dd>
    </div>
  );
}

export function Publications() {
  const [topic, setTopic] = useState<Topic | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const reduced = useReducedMotion();

  /**
   * A filter that matches every item tells the reader nothing and costs a row of
   * chips, so topics with no discriminating power are dropped. Ordered by how many
   * papers they cover, and capped, because ten chips is a wall rather than a control.
   */
  const usefulTopics = useMemo(() => {
    const total = publicationsByRecency.length;
    return allTopics
      .map((t) => ({
        t,
        n: publicationsByRecency.filter((p) => p.topics.includes(t)).length,
      }))
      .filter(({ n }) => n > 1 && n < total)
      .sort((a, b) => b.n - a.n)
      .slice(0, 6);
  }, []);

  const items = useMemo(
    () =>
      topic === "all"
        ? publicationsByRecency
        : publicationsByRecency.filter((p) => p.topics.includes(topic)),
    [topic],
  );

  return (
    <section
      id="publications"
      className="scroll-mt-14 bg-paper py-(--spacing-section)"
      aria-labelledby="publications-heading"
    >
      <div className="shell">
        {/*
          Deliberately composed differently from the other sections. Every other
          section opens with an eyebrow, a large serif title and a grey lede; an
          independent design review flagged that repeating formula as the site's
          most template-like tell. A publication list is an index, not an essay, so
          this one opens with the record itself.
        */}
        <header className="border-t border-rule pt-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
            <div>
              <p className="label flex items-center gap-3 text-ink-faint">
                <span aria-hidden="true">04</span>
                <span>Publications</span>
              </p>
              <p className="mt-2.5 text-micro text-ink-faint">
                {sectionPurpose("publications")}
              </p>
            </div>
            <p className="font-mono text-micro text-ink-faint">
              Metrics as of {scholarMetrics.asOf} ·{" "}
              <a
                href={site.links.scholar.href}
                target="_blank"
                rel="noreferrer"
                className="link-rule hover:text-ink"
              >
                Google Scholar
              </a>
            </p>
          </div>

          <h2 id="publications-heading" className="sr-only">
            Publications
          </h2>

          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 border-b border-rule pb-8 sm:grid-cols-4">
            <Stat label="Peer-reviewed" value={String(publicationsByRecency.length)} />
            <Stat label="Citations" value={String(scholarMetrics.citations)} />
            <Stat label="h-index" value={String(scholarMetrics.hIndex)} />
            <Stat
              label="First-authored"
              value={String(
                publicationsByRecency.filter((p) => p.authors[0] === site.name).length,
              )}
            />
          </dl>

          {/* The distribution, stated plainly rather than flattening venue types. */}
          <p className="mt-6 measure-wide text-small text-ink-muted">
            {venueSentence}{" "}
            All are co-authored with my supervisor, Jarosław A. Chudziak, and I am first
            author on every one.
          </p>
        </header>

        {/* Filters */}
        <div
          className="mt-12 flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter publications by topic"
        >
          <FilterChip
            active={topic === "all"}
            onClick={() => setTopic("all")}
            count={publicationsByRecency.length}
          >
            All
          </FilterChip>
          {usefulTopics.map(({ t, n }) => (
            <FilterChip
              key={t}
              active={topic === t}
              onClick={() => setTopic(topic === t ? "all" : t)}
              count={n}
            >
              {t}
            </FilterChip>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {items.length} publications shown
        </p>

        <ol className="mt-10 border-t border-rule">
          {items.map((p) => (
            <motion.li
              key={p.id}
              layout={!reduced}
              transition={{ duration: duration.base, ease: easeOut }}
              className="border-b border-rule-soft"
            >
              <PublicationRow
                publication={p}
                expanded={expanded === p.id}
                onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "label inline-flex items-center gap-2 border px-3 py-2 transition-colors",
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink-muted hover:border-ink hover:text-ink",
      )}
    >
      {children}
      <span className={cn("tabular", active ? "text-paper/60" : "text-ink-faint")}>
        {count}
      </span>
    </button>
  );
}

function PublicationRow({
  publication: p,
  expanded,
  onToggle,
}: {
  publication: Publication;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);

  async function copyBibTeX() {
    try {
      await navigator.clipboard.writeText(toBibTeX(p));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the BibTeX is also shown in the expanded panel.
      setCopied(false);
    }
  }

  return (
    <div className="py-7">
      <div className="grid gap-x-8 gap-y-3 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
        <p className="tabular label pt-1 text-ink-faint">{p.year}</p>

        <div>
          <h3 className="text-subheading text-ink">{p.title}</h3>

          <p className="mt-2 text-small text-ink-muted">
            {p.authors.map((a, i) => (
              <span key={a}>
                {i > 0 && ", "}
                <span className={a === site.name ? "text-ink" : undefined}>{a}</span>
              </span>
            ))}
          </p>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-small">
            <span className="text-ink">{p.venue}</span>
            <span className="label border border-rule px-1.5 py-0.5 text-ink-faint">
              {p.kind}
            </span>
            {p.status === "accepted" && (
              <span className="label border border-accent px-1.5 py-0.5 text-accent">
                accepted, in press
              </span>
            )}
            {p.citation?.pages && (
              <span className="tabular font-mono text-micro text-ink-faint">
                {p.citation.volume ? `${p.citation.volume}:` : ""}
                {p.citation.pages.replace("--", "–")}
              </span>
            )}
          </p>

          {/*
            Every control here is an inline text label. Left at their natural 13px
            height they fail WCAG 2.2 target size (2.5.8), which Lighthouse caught and
            my original axe tag set did not. `min-h-6` with a negative margin grows the
            hit area to 24px without disturbing the row's optical rhythm.
          */}
          <div className="mt-4 -my-1 flex flex-wrap items-center gap-x-5 gap-y-1">
            {(p.abstract ?? p.summary) && (
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="label inline-flex min-h-6 items-center text-ink-muted transition-colors hover:text-ink"
              >
                {expanded ? "Hide" : "Abstract"}
              </button>
            )}
            {p.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="link-rule label inline-flex min-h-6 items-center text-ink-muted hover:text-accent"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={copyBibTeX}
              className="label inline-flex min-h-6 items-center text-ink-muted transition-colors hover:text-ink"
            >
              {copied ? "Copied" : "BibTeX"}
            </button>
            <span className="inline-flex min-h-6 items-center font-mono text-micro text-ink-faint">
              {p.topics.join(" · ")}
            </span>
          </div>

          {expanded && (
            <div className="mt-6 border-l border-rule pl-5">
              <p className="measure-wide text-small text-ink-muted">
                {p.abstract ?? p.summary}
              </p>
              {p.abstract && (
                <p className="mt-3 font-mono text-micro text-ink-faint">
                  Abstract as published.
                </p>
              )}
              <pre className="mt-5 overflow-x-auto border border-rule-soft bg-paper-sunk p-4 font-mono text-[0.72rem] leading-relaxed text-ink-muted">
                {toBibTeX(p)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
