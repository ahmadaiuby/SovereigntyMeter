"use client";

import { useEffect, useState } from "react";
import { SovereigntyResult } from "@/lib/sovereignty";

interface SovereigntyMeterProps {
  result: SovereigntyResult;
}

export default function SovereigntyMeter({ result }: SovereigntyMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = result.total;
    const duration = 1200;
    const step = (end / duration) * 16;

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [result.total]);

  return (
    <div style={{ padding: "28px 0" }}>
      {/* Score display */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
        <span
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "80px",
            fontWeight: 300,
            lineHeight: 1,
            color: result.color,
          }}
        >
          {animatedScore}
        </span>
        <div>
          <div style={{ fontSize: "12px", color: "var(--mist)", letterSpacing: "1px" }}>/ 100</div>
          <div
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "24px",
              fontStyle: "italic",
              color: result.color,
              marginTop: "2px",
            }}
          >
            Grade {result.grade}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div
        style={{
          height: "2px",
          background: "rgba(255,255,255,0.06)",
          marginBottom: "8px",
          position: "relative",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${animatedScore}%`,
            background: `linear-gradient(to right, var(--rust), ${result.color})`,
            transition: "none",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-1px",
              top: "-4px",
              width: "2px",
              height: "10px",
              background: result.color,
            }}
          />
        </div>
      </div>

      <p
        style={{
          fontSize: "11px",
          color: "var(--mist)",
          letterSpacing: "0.5px",
          marginBottom: "28px",
          fontStyle: "italic",
        }}
      >
        {result.verdict}
      </p>

      {/* Factors */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {result.factors.map((factor, i) => (
          <div
            key={i}
            style={{
              padding: "16px 0",
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "10px", letterSpacing: "2px", color: "var(--mist)", textTransform: "uppercase" }}>
                {factor.label}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: factor.score / factor.maxScore > 0.5 ? "var(--signal)" : factor.score / factor.maxScore > 0.25 ? "var(--gold)" : "var(--rust)",
                  fontFamily: "IBM Plex Mono, monospace",
                }}
              >
                {factor.score}<span style={{ color: "var(--mist)", fontSize: "10px" }}>/{factor.maxScore}</span>
              </span>
            </div>

            {/* Sub-bar */}
            <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "6px" }}>
              <div
                style={{
                  height: "100%",
                  width: `${(factor.score / factor.maxScore) * 100}%`,
                  background: factor.score / factor.maxScore > 0.5 ? "var(--signal)" : factor.score / factor.maxScore > 0.25 ? "var(--gold)" : "var(--rust)",
                  transition: "width 1s ease",
                }}
              />
            </div>

            <p style={{ fontSize: "10px", color: "rgba(160,152,136,0.7)", lineHeight: "1.5" }}>
              {factor.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
