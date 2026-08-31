import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * One section primitive for the whole page, so vertical rhythm and the
 * numbered-heading treatment cannot drift between sections.
 */
export function Section({
  id,
  index,
  label,
  purpose,
  title,
  lede,
  children,
  tone = "paper",
  className,
  headingLevel: H = "h2",
}: {
  id?: string;
  index?: string;
  label?: string;
  /** One line saying what this section is for. Rendered under the label. */
  purpose?: string;
  title?: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
  tone?: "paper" | "sunk" | "void";
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  const toneClass =
    tone === "void"
      ? "on-void bg-void text-chalk"
      : tone === "sunk"
        ? "bg-paper-sunk text-ink"
        : "bg-paper text-ink";

  const ruleClass = tone === "void" ? "border-rule-dark" : "border-rule";
  const labelClass = tone === "void" ? "text-chalk-faint" : "text-ink-faint";
  const ledeClass = tone === "void" ? "text-chalk-muted" : "text-ink-muted";

  return (
    <section
      id={id}
      className={cn("scroll-mt-14 py-(--spacing-section)", toneClass, className)}
      aria-labelledby={title && id ? `${id}-heading` : undefined}
    >
      <div className="shell">
        {(label ?? title) && (
          <header className={cn("border-t pt-5", ruleClass)}>
            {label && (
              <p className={cn("label flex items-center gap-3", labelClass)}>
                {index && <span aria-hidden="true">{index}</span>}
                <span>{label}</span>
              </p>
            )}
            {purpose && (
              <p className={cn("mt-2.5 text-micro", labelClass)}>{purpose}</p>
            )}
            {title && (
              <H
                id={id ? `${id}-heading` : undefined}
                className="mt-6 max-w-[52rem] text-title"
              >
                {title}
              </H>
            )}
            {lede && (
              <div className={cn("measure-wide mt-6 text-lead", ledeClass)}>{lede}</div>
            )}
          </header>
        )}
        <div className={cn(label ?? title ? "mt-14" : undefined)}>{children}</div>
      </div>
    </section>
  );
}

/** A monospace caption, used under figures and diagrams. */
export function FigureCaption({
  children,
  tone = "paper",
  className,
}: {
  children: ReactNode;
  tone?: "paper" | "void";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "mt-4 font-mono text-micro leading-relaxed",
        tone === "void" ? "text-chalk-faint" : "text-ink-faint",
        className,
      )}
    >
      {children}
    </p>
  );
}
