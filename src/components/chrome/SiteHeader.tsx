"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { sections, site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * A single sticky bar. No mega-menu, no scroll-hijacking, no hide-on-scroll — the
 * navigation is always where the visitor left it.
 *
 * The bar inverts while a dark region is behind it, so a pale strip does not cut across
 * the one section meant to read as a continuous instrument panel.
 *
 * IMPLEMENTATION NOTE
 * Both the scrolled state and the inversion are driven by IntersectionObserver against
 * fixed sentinels. The first version listened to `scroll` and called
 * getBoundingClientRect() on every dark section per event, which forces synchronous
 * layout at scroll frequency — a passive listener prevents blocking the gesture, not the
 * layout cost.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);

  const openerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const topSentinel = useRef<HTMLDivElement>(null);

  // Scrolled state: a sentinel at the top of the document leaving the viewport.
  useEffect(() => {
    const el = topSentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setScrolled(!e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Inversion: observe dark regions against a root margin that is exactly the strip of
  // viewport the header occupies.
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-surface='void']");
    if (targets.length === 0) return;
    const active = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        }
        setOnDark(active.size > 0);
      },
      // Only the top 56px band of the viewport counts as "behind the header".
      { rootMargin: "0px 0px -100% 0px", threshold: 0 },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  // Dialog behaviour: escape to close, scroll lock, focus trap, focus restoration, and
  // closing if the viewport grows past the breakpoint that hides the sheet with CSS.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const focusables = () =>
      Array.from(
        sheetRef.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [],
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      // Without this, Tab walks straight out of an element declaring aria-modal.
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // The sheet is `md:hidden`. Resizing past the breakpoint would otherwise leave the
    // page scroll-locked with focus inside CSS-hidden content.
    const mq = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onBreakpoint);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onBreakpoint);
      document.body.style.overflow = prevOverflow;
      // Restore focus unless the visitor navigated away from the sheet deliberately.
      const target = openerRef.current ?? previouslyFocused;
      if (target && document.body.contains(target)) target.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <>
      <div ref={topSentinel} aria-hidden="true" className="absolute top-6 h-px w-px" />

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
          onDark
            ? "on-void border-rule-dark bg-void/90 backdrop-blur-md"
            : scrolled
              ? "border-rule-soft bg-paper/85 backdrop-blur-md"
              : "border-transparent",
        )}
      >
        <div className="shell flex h-14 items-center justify-between gap-6">
          <Link
            href="/"
            className={cn(
              "label transition-colors",
              onDark ? "text-chalk hover:text-accent-chalk" : "text-ink hover:text-accent",
            )}
            aria-label={`${site.name} — home`}
          >
            {site.name}
          </Link>

          <nav aria-label="Sections" className="hidden items-center gap-7 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`/#${s.id}`}
                className={cn(
                  "inline-flex min-h-6 items-center text-micro transition-colors",
                  onDark
                    ? "text-chalk-muted hover:text-chalk"
                    : "text-ink-muted hover:text-ink",
                )}
              >
                {s.label}
              </a>
            ))}
            <a
              href={site.links.email.href}
              className={cn(
                "label inline-flex min-h-8 items-center border px-3 transition-colors",
                onDark
                  ? "border-chalk-faint text-chalk hover:border-chalk hover:bg-chalk hover:text-void"
                  : "border-rule text-ink hover:border-ink hover:bg-ink hover:text-paper",
              )}
            >
              Contact
            </a>
          </nav>

          <button
            ref={openerRef}
            type="button"
            onClick={() => setOpen(true)}
            className={cn("label md:hidden", onDark ? "text-chalk" : "text-ink")}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            Index
          </button>
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        id="mobile-nav"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site index"
        hidden={!open}
        className="fixed inset-0 z-60 overflow-y-auto bg-paper md:hidden"
      >
        <div className="shell flex h-14 items-center justify-between">
          <span className="label text-ink">{site.name}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="label text-ink"
          >
            Close
          </button>
        </div>

        <nav aria-label="Sections" className="shell mt-6 pb-16">
          <ul>
            {sections.map((s) => (
              <li key={s.id} className="border-t border-rule-soft">
                <a
                  href={`/#${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="label text-ink-faint">{s.index}</span>
                  <span className="font-serif text-heading text-ink">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-rule pt-6">
            {Object.values(site.links).map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  className="link-rule text-small text-ink-muted"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
