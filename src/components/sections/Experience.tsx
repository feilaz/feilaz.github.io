import { roles, education, awards } from "@/content/experience";
import { Section } from "@/components/ui/Section";
import { sectionPurpose } from "@/content/site";

/**
 * 05 — EXPERIENCE
 *
 * The canvas is off here and nothing animates. The contrast is the point: after the
 * research instrument, the site goes quiet and simply tells you the facts. A visitor
 * should come away with the sense that it knows when to stop performing.
 */
export function Experience() {
  return (
    <Section id="experience" index="05" label="Experience"
      purpose={sectionPurpose("experience")} title="Where I’ve worked">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
        <div>
          <ol className="space-y-14">
            {roles.map((role) => (
              <li key={`${role.org}-${role.start}`}>
                <div className="grid gap-x-8 gap-y-3 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                  <div className="sm:pt-1.5">
                    <p className="tabular label text-ink-faint">
                      <time dateTime={role.startISO}>{role.start}</time>
                      <span className="mx-1" aria-hidden="true">
                        –
                      </span>
                      {role.endISO ? (
                        <time dateTime={role.endISO}>{role.end}</time>
                      ) : (
                        role.end
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-subheading text-ink">
                      {role.title}
                      <span className="text-ink-faint"> · </span>
                      {role.href ? (
                        <a
                          href={role.href}
                          target="_blank"
                          rel="noreferrer"
                          className="link-rule hover:text-accent"
                        >
                          {role.org}
                        </a>
                      ) : (
                        role.org
                      )}
                    </h3>
                    <p className="mt-1.5 text-micro text-ink-faint">
                      {role.orgNote ? `${role.orgNote} · ` : ""}
                      {role.location}
                    </p>

                    <ul className="mt-5 space-y-3">
                      {role.points.map((point, i) => (
                        <li
                          key={i}
                          className="measure-wide relative pl-5 text-small text-ink-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="absolute top-[0.62em] left-0 h-px w-2.5 bg-rule"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>

                    {role.stack && (
                      <p className="mt-5 font-mono text-micro text-ink-faint">
                        {role.stack.join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="space-y-12">
          <div>
            <h3 className="label border-t border-rule pt-4 text-ink-faint">Education</h3>
            <ul className="mt-5 space-y-6">
              {education.map((e) => (
                <li key={`${e.institution}-${e.start}`}>
                  <p className="text-small text-ink">{e.degree}</p>
                  <p className="mt-1 text-micro text-ink-muted">{e.institution}</p>
                  <p className="tabular mt-1 font-mono text-micro text-ink-faint">
                    {e.start} – {e.end}
                  </p>
                  {e.detail && (
                    <p className="mt-1.5 text-micro text-ink-faint">{e.detail}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="label border-t border-rule pt-4 text-ink-faint">Awards</h3>
            <ul className="mt-5 space-y-5">
              {awards.map((a) => (
                <li key={a.title}>
                  <p className="text-small text-ink">{a.title}</p>
                  <p className="mt-1 font-mono text-micro text-ink-faint">{a.year}</p>
                  {a.detail && (
                    <p className="mt-1.5 text-micro text-ink-muted">{a.detail}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
