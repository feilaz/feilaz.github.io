import { ImageResponse } from "next/og";
import { ConsensusField } from "@/components/agents/consensusField";

export const alt = "Adam Kostka — AI engineer and multi-agent systems researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Required by `output: "export"` — the card is rendered once, at build time. */
export const dynamic = "force-static";

/**
 * The share card.
 *
 * It shows the same thing Fig. 1 shows, frozen at a high correlation: a tight cluster of
 * agreeing agents sitting well away from the truth line. So a link preview in Slack or
 * LinkedIn carries the argument, not just a name.
 *
 * The simulation runs here, on the server, at build time for a static route — it never
 * reaches a browser.
 */
const PLATE_W = 452;
const PLATE_H = 486;
const RHO = 0.82;

function frame() {
  const field = new ConsensusField({ count: 340, seed: 20260827 });
  field.step(1.5, RHO);
  const pad = 26;
  const usable = (PLATE_W - pad * 2) / 2;
  return {
    truthX: PLATE_W / 2,
    consensusX: PLATE_W / 2 + field.mean * usable,
    dots: Array.from({ length: field.count }, (_, i) => ({
      x: PLATE_W / 2 + field.opinions[i] * usable,
      y: PLATE_H / 2 + field.rows[i] * (PLATE_H / 2 - 40),
      r: Math.max(1.6, field.variance[i * 2] * 1.6),
      o: field.variance[i * 2 + 1] * 0.85,
    })),
  };
}

export default async function Image() {
  const { dots, truthX, consensusX } = frame();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f6f4ef",
          color: "#191713",
          padding: 68,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            paddingRight: 44,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#6a665d",
            }}
          >
            Multi-agent systems · Agent reliability
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 84, letterSpacing: -2 }}>
              Adam Kostka
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 34,
                color: "#55524a",
                maxWidth: 600,
                lineHeight: 1.25,
              }}
            >
              I build multi-agent AI systems, and I study how they fail.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
              fontSize: 20,
              letterSpacing: 1.5,
              textTransform: "uppercase",
              color: "#6a665d",
            }}
          >
            <span>AI Engineer · Strategy</span>
            <span>8 peer-reviewed</span>
            <span>UAI 2026</span>
          </div>
        </div>

        {/* The figure, frozen where agreement is total and the consensus is wrong. */}
        <div
          style={{
            display: "flex",
            position: "relative",
            width: PLATE_W,
            height: PLATE_H,
            border: "1px solid #d9d4c8",
            background: "#fbfaf7",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: truthX,
              top: 18,
              width: 1,
              height: PLATE_H - 36,
              background: "#6a665d",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: consensusX,
              top: 18,
              width: 2,
              height: PLATE_H - 36,
              background: "#b93f22",
            }}
          />
          {dots.map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x,
                top: d.y,
                width: d.r * 2,
                height: d.r * 2,
                borderRadius: 999,
                background: "#191713",
                opacity: d.o,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 12,
              display: "flex",
              fontSize: 15,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#b93f22",
            }}
          >
            Agreement 100% · still wrong
          </div>
        </div>
      </div>
    ),
    size,
  );
}
