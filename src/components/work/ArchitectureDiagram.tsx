"use client";

import { useId, useState } from "react";
import type { Architecture, DiagramNode } from "@/content/projects";
import { cn } from "@/lib/cn";
import { useReducedMotion } from "@/lib/useCapability";

/**
 * Architecture diagrams as SVG, not particles.
 *
 * These have to be readable at a glance, printable, selectable by a screen reader,
 * and legible at 320px. A particle system does none of those things. The only motion
 * is a packet travelling an edge on hover, and it is suppressed under reduced motion.
 *
 * Node positions are hand-placed in the content file so each diagram reads like a
 * figure rather than like the output of a layout algorithm.
 */

const NODE_W = 148;
const NODE_H = 62;
const GAP_X = 56;
const GAP_Y = 34;

function nodeBox(n: DiagramNode) {
  return {
    x: (n.col - 1) * (NODE_W + GAP_X),
    y: (n.row - 1) * (NODE_H + GAP_Y),
    w: NODE_W,
    h: NODE_H,
  };
}

export function ArchitectureDiagram({ architecture }: { architecture: Architecture }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const width = architecture.cols * NODE_W + (architecture.cols - 1) * GAP_X;
  const height = architecture.rows * NODE_H + (architecture.rows - 1) * GAP_Y;
  const pad = 14;

  const byId = new Map(architecture.nodes.map((n) => [n.id, n]));

  return (
    <figure className="m-0 min-w-0">
      <div
        // A scroll container is useless to a keyboard-only visitor unless it can hold
        // focus; the SVG has a 34rem minimum width and will clip on small screens.
        tabIndex={0}
        role="group"
        aria-label={`${architecture.caption} Scrollable diagram.`}
        className="overflow-x-auto border border-rule bg-paper-raised p-5 sm:p-7"
      >
        <svg
          viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
          className="h-auto w-full min-w-[30rem]"
          role="img"
          aria-labelledby={`${uid}-title`}
        >
          <title id={`${uid}-title`}>{architecture.caption}</title>

          <defs>
            <marker
              id={`${uid}-arrow`}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--color-ink-faint)" />
            </marker>
          </defs>

          {/* Edges first, so nodes always sit on top of them. */}
          {architecture.edges.map((e, i) => {
            const from = byId.get(e.from);
            const to = byId.get(e.to);
            if (!from || !to) return null;
            const a = nodeBox(from);
            const b = nodeBox(to);
            const x1 = a.x + a.w;
            const y1 = a.y + a.h / 2;
            const x2 = b.x;
            const y2 = b.y + b.h / 2;
            const midX = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;
            const active = hovered === e.from || hovered === e.to;

            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={
                    active ? "var(--color-accent)" : "var(--color-rule)"
                  }
                  strokeWidth={active ? 1.4 : 1}
                  strokeDasharray={e.dashed ? "4 4" : undefined}
                  markerEnd={`url(#${uid}-arrow)`}
                  className="transition-[stroke,stroke-width] duration-200"
                />
                {e.label && (
                  <text
                    x={midX}
                    y={(y1 + y2) / 2 - 7}
                    textAnchor="middle"
                    className="fill-ink-faint font-mono"
                    style={{ fontSize: 10 }}
                  >
                    {e.label}
                  </text>
                )}
                {/* A packet travelling the edge on hover. Decoration, and the first
                    thing to go under reduced motion. */}
                {active && !reduced && (
                  <circle r="3" fill="var(--color-accent)">
                    <animateMotion dur="1.1s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}

          {architecture.nodes.map((n) => {
            const b = nodeBox(n);
            const primary = n.kind === "primary";
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <rect
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  rx="1"
                  fill={primary ? "var(--color-ink)" : "var(--color-paper)"}
                  stroke={primary ? "var(--color-ink)" : "var(--color-rule)"}
                  strokeWidth="1"
                />
                <text
                  x={b.x + 11}
                  y={b.y + (n.note ? 24 : b.h / 2 + 4)}
                  className={cn(
                    "font-sans",
                    primary ? "fill-paper" : "fill-ink",
                  )}
                  style={{ fontSize: 12.5, fontWeight: 500 }}
                >
                  {n.label}
                </text>
                {n.note && (
                  <foreignObject
                    x={b.x + 10}
                    y={b.y + 30}
                    width={b.w - 20}
                    height={b.h - 34}
                  >
                    <p
                      className={cn(
                        "m-0 font-mono leading-tight",
                        primary ? "text-paper/70" : "text-ink-faint",
                      )}
                      style={{ fontSize: 8.6 }}
                    >
                      {n.note}
                    </p>
                  </foreignObject>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <figcaption className="mt-4 max-w-[46rem] font-mono text-micro leading-relaxed text-ink-faint">
        {architecture.caption}
      </figcaption>

      {/* The diagram in prose, for screen readers and for anyone who prefers text. */}
      <details className="mt-4">
        <summary className="label cursor-pointer text-ink-faint hover:text-ink">
          Describe this diagram in text
        </summary>
        <div className="mt-4 space-y-5 border-l border-rule pl-5">
          <div>
            <p className="label text-ink-faint">Components</p>
            <ul className="mt-2 space-y-1.5">
              {architecture.nodes.map((n) => (
                <li key={n.id} className="text-small text-ink-muted">
                  <span className="text-ink">{n.label}</span>
                  {n.note ? ` — ${n.note}` : ""}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label text-ink-faint">Connections</p>
            <ol className="mt-2 space-y-1.5">
              {architecture.edges.map((e, i) => {
                const from = byId.get(e.from);
                const to = byId.get(e.to);
                if (!from || !to) return null;
                return (
                  <li key={i} className="text-small text-ink-muted">
                    {from.label} → {to.label}
                    {e.label ? ` (${e.label})` : ""}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </details>
    </figure>
  );
}
