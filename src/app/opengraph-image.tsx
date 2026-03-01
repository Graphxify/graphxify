import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0d0d0f",
          color: "#f2f0eb",
          padding: "72px"
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: "0.22em", opacity: 0.72 }}>GRAPHXIFY</div>
        <div style={{ fontSize: 66, lineHeight: 1.05, marginTop: 24, maxWidth: "880px", fontWeight: 600 }}>
          Brand systems, web design &amp; development
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
