import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#d6ff3f",
          borderRadius: 7,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#14160a" d="M3.6 19.4V5.4l8.4 7.4 8.4-7.4v14h-2.8v-8.1L12 16.2l-5.6-4.9v8.1H3.6Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
