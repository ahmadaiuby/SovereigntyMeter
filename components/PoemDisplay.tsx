"use client";

import { useEffect, useState } from "react";

interface PoemDisplayProps {
  poem: string;
  isLoading: boolean;
}

export default function PoemDisplay({ poem, isLoading }: PoemDisplayProps) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!poem) { setDisplayed(""); return; }
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(poem.slice(0, i));
      i++;
      if (i > poem.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [poem]);

  if (isLoading) {
    return (
      <div style={{ padding: "40px 0" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--gold)",
                animation: "pulse-glow 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
          <span style={{ fontSize: "10px", color: "var(--mist)", letterSpacing: "2px", marginLeft: "8px" }}>
            COMPOSING
          </span>
        </div>
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
        `}</style>
      </div>
    );
  }

  if (!poem) return null;

  return (
    <div style={{ position: "relative", padding: "40px 0 20px" }}>
      {/* Opening quote mark */}
      <div
        style={{
          position: "absolute",
          top: "-10px",
          left: "-8px",
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "120px",
          color: "rgba(200,150,60,0.07)",
          lineHeight: 1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        "
      </div>

      <p
        style={{
          fontFamily: "Cormorant Garamond, serif",
          fontSize: "22px",
          fontWeight: 300,
          fontStyle: "italic",
          lineHeight: 2,
          color: "var(--parchment)",
          whiteSpace: "pre-wrap",
          position: "relative",
        }}
      >
        {displayed}
        {displayed.length < poem.length && (
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              background: "var(--gold)",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "pulse-glow 0.8s ease-in-out infinite",
            }}
          />
        )}
      </p>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
