"use client";

import { useEffect, useRef, useState } from "react";
import { ConsensusField } from "./consensusField";

/**
 * The canvas layer of the hero figure.
 *
 * Plain Canvas2D. An earlier version of this figure used three.js; it cost 230 KB and
 * ~1.8 s of main-thread time to draw a few hundred soft dots, and Lighthouse attributed
 * seconds of LCP render delay to it. Canvas2D draws the same frame in about 1 ms.
 *
 * Everything the figure asserts — the truth line, the consensus marker, the gap between
 * them — is drawn here *and* stated in text next to it, because a canvas is invisible to
 * a screen reader and absent without JavaScript.
 */

const ALPHA_BUCKETS = 5;
const SPRITE_PX = 12;
const MAX_DPR = 1.5;

function makeSprites(color: string, dpr: number) {
  const size = Math.ceil(SPRITE_PX * dpr);
  return Array.from({ length: ALPHA_BUCKETS }, (_, i) => {
    const alpha = ((i + 1) / ALPHA_BUCKETS) * 0.9;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size;
    const ctx = c.getContext("2d")!;
    const r = size / 2;
    const g = ctx.createRadialGradient(r, r, 0, r, r, r);
    g.addColorStop(0, color);
    g.addColorStop(0.6, color);
    g.addColorStop(1, "transparent");
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    return c;
  });
}

export default function ConsensusCanvas({
  count,
  seed,
  rho,
  animate,
  onStats,
  onPaint,
}: {
  count: number;
  seed: number;
  /** 0 = independent agents, 1 = identical agents. Controlled by the parent. */
  rho: number;
  /** False under reduced motion: the field renders on change rather than continuously. */
  animate: boolean;
  onStats: (s: { agreement: number; consensusError: number }) => void;
  /** Fires once a frame has actually been painted, so the fallback can step aside. */
  onPaint: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Values the render loop reads are mirrored from effects, never written during render.
  const rhoRef = useRef(rho);
  useEffect(() => {
    rhoRef.current = rho;
  }, [rho]);

  const statsRef = useRef(onStats);
  useEffect(() => {
    statsRef.current = onStats;
  }, [onStats]);

  const paintRef = useRef(onPaint);
  useEffect(() => {
    paintRef.current = onPaint;
  }, [onPaint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    let sprites = makeSprites("#191713", dpr);
    let width = 0;
    let height = 0;
    let painted = false;
    let announced = false;
    const field = new ConsensusField({ count, seed });
    // Settle once so the first painted frame is representative.
    field.step(0.5, rhoRef.current);

    function resize() {
      const r = canvas!.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      if (Math.abs(nextDpr - dpr) > 0.01) {
        dpr = nextDpr;
        sprites = makeSprites("#191713", dpr);
      }
      width = r.width;
      height = r.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /** Horizontal padding so dots at the extremes are not clipped by the border. */
    const PAD = 34;

    function xOf(opinion: number) {
      const usable = (width - PAD * 2) / 2;
      return width / 2 + opinion * usable;
    }

    function draw() {
      const plotTop = 30;
      const plotBottom = height - 52;
      const plotMid = (plotTop + plotBottom) / 2;
      const plotHalf = (plotBottom - plotTop) / 2;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, width, height);

      const truthX = xOf(0);
      const consensusX = xOf(field.mean);

      // ── The truth line. Solid, full height, the fixed reference. ──
      ctx!.strokeStyle = "#6a665d";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(truthX, plotTop - 12);
      ctx!.lineTo(truthX, plotBottom + 10);
      ctx!.stroke();

      // ── The agents. ──
      for (let i = 0; i < field.count; i++) {
        const bucket = Math.min(
          ALPHA_BUCKETS - 1,
          (field.variance[i * 2 + 1] * ALPHA_BUCKETS) | 0,
        );
        const d = field.variance[i * 2] * 2.4;
        ctx!.drawImage(
          sprites[bucket],
          xOf(field.opinions[i]) - d / 2,
          plotMid + field.rows[i] * plotHalf - d / 2,
          d,
          d,
        );
      }

      // ── The consensus marker, in the accent. Dashed, so it reads as derived. ──
      ctx!.strokeStyle = "#b93f22";
      ctx!.lineWidth = 1.5;
      ctx!.setLineDash([3, 3]);
      ctx!.beginPath();
      ctx!.moveTo(consensusX, plotTop - 12);
      ctx!.lineTo(consensusX, plotBottom + 10);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // ── The gap between them, bracketed and labelled. This is the whole point of
      //    the figure, so it is drawn explicitly rather than left to be inferred. ──
      const gap = Math.abs(consensusX - truthX);
      if (gap > 6) {
        const y = plotBottom + 22;
        const left = Math.min(truthX, consensusX);
        const right = Math.max(truthX, consensusX);
        ctx!.strokeStyle = "#b93f22";
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.moveTo(left, y);
        ctx!.lineTo(right, y);
        ctx!.moveTo(left, y - 4);
        ctx!.lineTo(left, y + 4);
        ctx!.moveTo(right, y - 4);
        ctx!.lineTo(right, y + 4);
        ctx!.stroke();

        // Proportional, not absolute: 60px is a wide gap on a phone and a narrow one on
        // a desktop plate.
        if (gap > width * 0.12) {
          ctx!.fillStyle = "#b93f22";
          ctx!.font =
            '500 10px var(--font-plex-mono, ui-monospace), ui-monospace, monospace';
          ctx!.textAlign = "center";
          ctx!.fillText("ERROR", (left + right) / 2, y + 15);
        }
      }

      // ── Labels for the two lines. ──
      ctx!.font =
        '500 10px var(--font-plex-mono, ui-monospace), ui-monospace, monospace';
      ctx!.textAlign = "center";
      ctx!.fillStyle = "#6a665d";
      ctx!.fillText("TRUTH", truthX, plotTop - 18);
      painted = true;
      // Only label the consensus once it is far enough from TRUTH that the two labels
      // cannot collide. Below that the dashed line is unambiguous on its own.
      if (gap > width * 0.16) {
        ctx!.fillStyle = "#b93f22";
        ctx!.fillText("CONSENSUS", consensusX, plotTop - 18);
      }
    }

    let raf = 0;
    let last = performance.now();

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      if (document.hidden) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      field.step(dt, rhoRef.current);
      draw();
      statsRef.current({
        agreement: field.agreement,
        consensusError: field.consensusError,
      });
      if (painted && !announced) {
        announced = true;
        paintRef.current();
      }
    }

    if (animate) {
      raf = requestAnimationFrame(frame);
    } else {
      // Reduced motion: recompute and repaint only when the visitor changes something.
      field.step(0, rhoRef.current);
      draw();
      statsRef.current({
        agreement: field.agreement,
        consensusError: field.consensusError,
      });
      if (painted) paintRef.current();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      sprites = [];
    };
  }, [count, seed, animate]);

  // Under reduced motion the parent remounts on rho change via the key prop, so a
  // static repaint is all that is required.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
