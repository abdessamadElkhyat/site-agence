import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#161513",
          color: "#f4f1ea",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#d6ff3f",
              color: "#14160a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 28, letterSpacing: 4 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div style={{ fontSize: 64, lineHeight: 1.05 }}>{site.tagline}</div>
          <div style={{ fontSize: 24, color: "rgba(244,241,234,0.7)" }}>
            Websites · SEO · Ads · Brand
          </div>
        </div>
        <div style={{ fontSize: 20, color: "#d6ff3f" }}>lyne.studio</div>
      </div>
    ),
    size,
  );
}
