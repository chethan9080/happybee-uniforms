import React from "react";

export function LogoBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: "clamp(120px, 20vw, 260px)",
          fontWeight: 900,
          fontFamily: "'Georgia', serif",
          color: "#1a1a1a",
          opacity: 0.045,
          letterSpacing: "-4px",
          userSelect: "none",
          whiteSpace: "nowrap",
          lineHeight: 1,
        }}
      >
        HappyB
      </span>
    </div>
  );
}
