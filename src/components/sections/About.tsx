import { site, sectionPurpose } from "@/content/site";
import { skills } from "@/content/experience";

/**
 * 06 — ABOUT
 *
 * Zero motion by design. The one place on the site that is simply a person talking.
 *
 * NEEDS ADAM'S INPUT: the two paragraphs below are drawn only from facts in the CV.
 * They are deliberately reserved rather than invented — see /CONTENT-TODO.md for
 * the personal detail that would make this section better, and for the photograph.
 */
export function About() {
  return (
    <section id="about" className="scroll-mt-14 bg-paper-sunk py-(--spacing-section)">
      <div className="shell">
        <div className="grid gap-12 border-t border-rule pt-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="label flex items-center gap-3 text-ink-faint">
              <span aria-hidden="true">06</span>
              <span>About</span>
            </p>
            <p className="mt-2.5 text-micro text-ink-faint">
              {sectionPurpose("about")}
            </p>
          </div>

          <div>
            <div className="measure-wide">
              <p className="font-serif text-heading text-ink">
                I came to research through engineering, and I have stayed in both.
              </p>

              <p className="mt-8 text-lead text-ink-muted">
                I study multi-agent LLM systems at Warsaw University of Technology, with
                eight peer-reviewed papers written alongside my supervisor, Jarosław A.
                Chudziak. In parallel I work as an AI engineer at Strategy, shipping
                features that real customers use. The two halves feed each other more
                than I expected: production systems keep supplying the failure modes
                that turn out to be worth a paper, and the research makes me sceptical
                of the confidence numbers those systems report.
              </p>

              <p className="mt-6 text-lead text-ink-muted">
                I spent a year of my undergraduate degree at Kyungpook National
                University in South Korea on a double-degree programme, and I presented
                my first paper in Tokyo in 2024. I am based in Warsaw.
              </p>
            </div>

            <div className="mt-14 grid gap-x-12 gap-y-8 border-t border-rule pt-8 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.group}>
                  <h3 className="label text-ink-faint">{group.group}</h3>
                  <p className="mt-2.5 text-small text-ink-muted">
                    {group.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-14 border-t border-rule pt-8">
              <h3 className="font-serif text-subheading text-ink">Get in touch</h3>
              <p className="measure mt-3 text-small text-ink-muted">
                {site.availability}
              </p>
              <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3">
                <li>
                  <a
                    href={site.links.email.href}
                    className="label inline-flex items-center border border-ink bg-ink px-4 py-2.5 text-paper transition-colors hover:border-accent hover:bg-accent"
                  >
                    {site.email}
                  </a>
                </li>
                {[site.links.linkedin, site.links.github, site.links.scholar].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="label inline-flex items-center border border-rule px-4 py-2.5 text-ink transition-colors hover:border-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
