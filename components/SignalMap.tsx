"use client";

import { useEffect, useRef } from "react";

interface SignalMapProps {
  originCity: string;
  originCountry: string;
  destCity: string;
  destCountry: string;
  destCoords: [number, number];
  score: number;
}

// Approximate country centroids (lat, lon)
const COUNTRY_COORDS: Record<string, [number, number]> = {
  SA: [24.7, 46.7],
  US: [38.9, -77.0],
  GB: [51.5, -0.1],
  DE: [52.5, 13.4],
  FR: [48.8, 2.3],
  NL: [52.4, 4.9],
  SG: [1.3, 103.8],
  AU: [-33.8, 151.2],
  JP: [35.7, 139.7],
  CN: [39.9, 116.4],
  IN: [28.6, 77.2],
  AE: [25.2, 55.3],
  EG: [30.0, 31.2],
  ZA: [-33.9, 18.4],
  BR: [-23.5, -46.6],
  CA: [43.7, -79.4],
  RU: [55.7, 37.6],
  KR: [37.6, 126.9],
  SE: [59.3, 18.1],
  CH: [47.4, 8.5],
  IT: [41.9, 12.5],
  ES: [40.4, -3.7],
};

function latLonToSVG(lat: number, lon: number, w: number, h: number): [number, number] {
  // Simple equirectangular projection
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return [x, y];
}

export default function SignalMap({
  originCity,
  originCountry,
  destCity,
  destCountry,
  destCoords,
  score,
}: SignalMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 700;
  const H = 300;

  const originLatLon = COUNTRY_COORDS["SA"] || [24.7, 46.7];
  const destLatLon = COUNTRY_COORDS[destCountry] || destCoords || [0, 0];

  const [ox, oy] = latLonToSVG(originLatLon[0], originLatLon[1], W, H);
  const [dx, dy] = latLonToSVG(destLatLon[0], destLatLon[1], W, H);

  // Control point for arc (midpoint elevated)
  const mx = (ox + dx) / 2;
  const my = Math.min(oy, dy) - 60;

  const pathD = `M ${ox} ${oy} Q ${mx} ${my} ${dx} ${dy}`;

  const scoreColor = score >= 75 ? "#3ddc97" : score >= 55 ? "#c8963c" : score >= 35 ? "#e07b39" : "#b5432a";

  const isSameCountry = originCountry === destCountry;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
        }}
      >
        <defs>
          <radialGradient id="originGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3ddc97" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#3ddc97" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="destGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={scoreColor} stopOpacity="0.6" />
            <stop offset="100%" stopColor={scoreColor} stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={scoreColor} opacity="0.7" />
          </marker>
        </defs>

        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75].map((r, i) => (
          <line
            key={i}
            x1={W * r} y1={0} x2={W * r} y2={H}
            stroke="rgba(200,150,60,0.04)"
            strokeWidth="1"
          />
        ))}
        {[0.33, 0.66].map((r, i) => (
          <line
            key={i}
            x1={0} y1={H * r} x2={W} y2={H * r}
            stroke="rgba(200,150,60,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* Equator line */}
        <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="rgba(200,150,60,0.08)" strokeWidth="1" strokeDasharray="4 8" />

        {/* Signal path — ghost */}
        <path
          d={pathD}
          fill="none"
          stroke={scoreColor}
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.15"
        />

        {/* Signal path — animated */}
        <path
          d={pathD}
          fill="none"
          stroke={scoreColor}
          strokeWidth="1.5"
          strokeDasharray="800"
          strokeDashoffset="0"
          opacity="0.7"
          filter="url(#glow)"
          style={{
            animation: "signal-move 2s ease-out forwards",
          }}
          markerEnd="url(#arrowhead)"
        />

        {/* Border crossing marker */}
        {!isSameCountry && (
          <g transform={`translate(${mx}, ${my + 30})`}>
            <circle r="4" fill="rgba(200,150,60,0.2)" stroke="#c8963c" strokeWidth="1" />
            <text
              y={-10}
              textAnchor="middle"
              fill="#c8963c"
              fontSize="8"
              fontFamily="IBM Plex Mono"
              letterSpacing="1"
            >
              BORDER
            </text>
          </g>
        )}

        {/* Origin dot — Saudi Arabia */}
        <circle cx={ox} cy={oy} r="16" fill="url(#originGlow)" />
        <circle cx={ox} cy={oy} r="5" fill="#080810" stroke="#3ddc97" strokeWidth="1.5" />
        <circle cx={ox} cy={oy} r="2.5" fill="#3ddc97">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={ox} y={oy - 14} textAnchor="middle" fill="#3ddc97" fontSize="9" fontFamily="IBM Plex Mono" letterSpacing="1">
          YOU · SA
        </text>

        {/* Destination dot */}
        <circle cx={dx} cy={dy} r="16" fill="url(#destGlow)" />
        <circle cx={dx} cy={dy} r="5" fill="#080810" stroke={scoreColor} strokeWidth="1.5" />
        <circle cx={dx} cy={dy} r="2.5" fill={scoreColor} />
        <text
          x={dx}
          y={dy + 18}
          textAnchor={dx > W * 0.7 ? "end" : dx < W * 0.3 ? "start" : "middle"}
          fill={scoreColor}
          fontSize="9"
          fontFamily="IBM Plex Mono"
          letterSpacing="1"
        >
          {destCity?.toUpperCase() || destCountry} · {destCountry}
        </text>
      </svg>

      <style jsx>{`
        @keyframes signal-move {
          from { stroke-dashoffset: 800; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
