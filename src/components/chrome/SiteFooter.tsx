import { site } from "@/content/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper-sunk">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="label text-ink-faint">Elsewhere</p>
            <p className="measure mt-3 font-serif text-subheading text-ink">
              {site.location}
            </p>
          </div>

          <nav aria-label="Elsewhere">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
              {[site.links.github, site.links.scholar, site.links.linkedin, site.links.cv].map(
                (l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      rel={l.external ? "noreferrer" : undefined}
                      className="link-rule text-small text-ink-muted hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-4 border-t border-rule pt-6">
          <p className="label text-ink-faint">
            {site.name} · {year}
          </p>
          <p className="label text-ink-faint">
            ORCID{" "}
            <a
              href={`https://orcid.org/${site.orcid}`}
              target="_blank"
              rel="noreferrer"
              className="link-rule hover:text-ink"
            >
              {site.orcid}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
