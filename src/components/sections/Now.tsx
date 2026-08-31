import type { ReactNode } from "react";
import { site } from "@/content/site";
import { roles } from "@/content/experience";
import { readerPaths, sectionPurpose } from "@/content/site";

/** Renders **emphasis** from content strings. Deliberately minimal — no markdown dep. */
export function emphasise(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-medium text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/**
 * 02 — NOW
 *
 * The impatient-recruiter section. Two sentences, both checkable, no adjectives.
 * Positioned immediately after the hero so the profile is understood before any
 * interaction is offered.
 */
export function Now() {
  const current = roles[0];

  return (
    <section id="now" className="scroll-mt-14 bg-paper py-(--spacing-section)">
      <div className="shell">
        <div className="grid gap-10 border-t border-rule pt-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="label flex items-center gap-3 text-ink-faint">
              <span aria-hidden="true">01</span>
              <span>Now</span>
            </p>
            <p className="mt-2.5 text-micro text-ink-faint">
              {sectionPurpose("now")}
            </p>
          </div>

          <div className="measure-wide">
            {site.now.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-lead text-ink-muted"
                    : "mt-6 text-lead text-ink-muted"
                }
              >
                {emphasise(para)}
              </p>
            ))}

            <nav
              aria-label="Where to go next"
              className="mt-12 border-t border-rule pt-8"
            >
              <p className="label text-ink-faint">Three ways to read this page</p>
              <ul className="mt-5 space-y-3.5">
                {readerPaths.map((r) => (
                  <li key={r.href} className="measure-wide text-small text-ink-muted">
                    <a
                      href={r.href}
                      className="link-rule font-medium text-ink hover:text-accent"
                    >
                      {r.label}
                    </a>
                    <span> — {r.reason}</span>
                  </li>
                ))}
              </ul>
            </nav>

            <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-rule-soft pt-8 sm:grid-cols-2">
              <div>
                <dt className="label text-ink-faint">Current role</dt>
                <dd className="mt-2 text-body text-ink">
                  {current.title}, {current.org}
                  <span className="block text-micro text-ink-faint">
                    {current.orgNote} · {current.start} – {current.end}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label text-ink-faint">Studying</dt>
                <dd className="mt-2 text-body text-ink">
                  MSc Computer Science
                  <span className="block text-micro text-ink-faint">
                    Warsaw University of Technology · expected 2027
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
