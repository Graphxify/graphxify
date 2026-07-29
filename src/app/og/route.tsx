import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/constants";

/**
 * Dynamic Open Graph card generator.
 *
 * Social platforms crop share images to roughly 1.91:1 (Facebook, LinkedIn, X).
 * The previous default OG image was a 1000x1000 / 377 KB square, so every share
 * was centre-cropped. This renders a purpose-built 1200x630 card per page.
 *
 * Usage: /og?title=Web%20Design&eyebrow=Services
 *
 * Deliberately NOT under /api — robots.ts disallows /api, and the Facebook and
 * X scrapers honour robots.txt, which would block every share preview.
 */

const size = { width: 1200, height: 630 };

const GRAPHITE = "#0d0d0f";
const IVORY = "#f2f0eb";
const ACCENT_A = "#00a3ff";
const ACCENT_B = "#0052cc";

/** Keeps long CMS titles from overflowing the card. */
function clamp(value: string, max: number): string {
  const trimmed = value.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max - 1).trimEnd()}…` : trimmed;
}

export function GET(request: NextRequest): ImageResponse {
  const { searchParams } = request.nextUrl;

  const title = clamp(searchParams.get("title") || "Brand systems and web platforms, built as one system.", 110);
  const eyebrow = clamp(searchParams.get("eyebrow") || "Design & Development Studio", 42);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: GRAPHITE,
          padding: "72px 80px",
          position: "relative"
        }}
      >
        {/* Ambient accent glow, mirrors the site's hero treatment */}
        <div
          style={{
            position: "absolute",
            top: -260,
            right: -160,
            width: 760,
            height: 760,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${ACCENT_A}2b 0%, ${GRAPHITE}00 68%)`
          }}
        />

        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              background: `linear-gradient(135deg, ${ACCENT_A} 0%, ${ACCENT_B} 100%)`
            }}
          />
          <div
            style={{
              fontSize: 27,
              fontWeight: 700,
              letterSpacing: 6,
              color: IVORY
            }}
          >
            GRAPHXIFY
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 3.4,
              textTransform: "uppercase",
              color: ACCENT_A,
              marginBottom: 22
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontSize: title.length > 68 ? 58 : 72,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -1.8,
              color: IVORY,
              maxWidth: 1000
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer: gradient rule + domain */}
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              width: "100%",
              height: 4,
              borderRadius: 9999,
              background: `linear-gradient(90deg, ${ACCENT_A} 0%, ${ACCENT_B} 55%, ${GRAPHITE} 100%)`
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 26, color: IVORY, opacity: 0.92 }}>
              {siteConfig.url.replace(/^https?:\/\//, "")}
            </div>
            <div style={{ fontSize: 23, color: IVORY, opacity: 0.6 }}>
              Brand · Web Design · Development · CMS
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        // Cards are deterministic per query string — cache hard at the edge.
        "Cache-Control": "public, immutable, no-transform, max-age=31536000"
      }
    }
  );
}
