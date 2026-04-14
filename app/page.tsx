"use client";

import { useState, useRef } from "react";
import SignalMap from "@/components/SignalMap";
import SovereigntyMeter from "@/components/SovereigntyMeter";
import PoemDisplay from "@/components/PoemDisplay";

interface ScanResult {
  domain: string;
  ip: string;
  city: string;
  region: string;
  country: string;
  org: string;
  asn: string;
  coords: [number, number];
  infraOwner: string;
  sovereignty: {
    total: number;
    grade: string;
    color: string;
    verdict: string;
    factors: Array<{ label: string; score: number; maxScore: number; description: string }>;
  };
  cables: Array<{
    name: string;
    length: string;
    countries: string[];
    readyForService?: string;
    owners?: string[];
  }>;
}

const EXAMPLES = ["nytimes.com", "bbc.com", "aljazeera.net", "github.com", "wikipedia.org"];

export default function Home() {
  const [domain, setDomain] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [poem, setPoem] = useState("");
  const [poemLoading, setPoemLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleScan(e?: React.FormEvent) {
    e?.preventDefault();
    const target = domain.trim();
    if (!target) return;

    setScanning(true);
    setResult(null);
    setPoem("");
    setError("");

    try {
      const res = await fetch(`/api/scan?domain=${encodeURIComponent(target)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Scan failed");
        setScanning(false);
        return;
      }

      setResult(data);
      setScanning(false);

      setPoemLoading(true);
      const poemRes = await fetch("/api/poem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: data.domain,
          country: data.country,
          city: data.city,
          org: data.org,
          asn: data.asn,
          infraOwner: data.infraOwner,
          sovereigntyScore: data.sovereignty.total,
          sovereigntyVerdict: data.sovereignty.verdict,
        }),
      });

      const poemData = await poemRes.json();
      setPoem(poemData.poem || "");
      setPoemLoading(false);
    } catch {
      setError("Network error. Please try again.");
      setScanning(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "clamp(40px, 8vw, 80px) 24px 80px" }}>

        {/* Header */}
        <header style={{ marginBottom: "clamp(48px, 8vw, 72px)" }}>
          <div style={{ fontSize: "9px", letterSpacing: "5px", color: "var(--gold)", textTransform: "uppercase", marginBottom: "16px" }}>
            Digital Sovereignty Scanner
          </div>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(52px, 11vw, 100px)", fontWeight: 300, fontStyle: "italic", lineHeight: 0.9, color: "var(--parchment)", marginBottom: "24px", letterSpacing: "-0.02em" }}>
            Territorial
          </h1>
          <p style={{ fontSize: "11px", color: "var(--mist)", letterSpacing: "0.5px", lineHeight: "1.8", maxWidth: "480px" }}>
            Every click crosses borders. Enter a domain to reveal who owns the wires, where your data travels, and what that means.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(200,150,60,0.3))" }} />
            <div style={{ width: "5px", height: "5px", background: "var(--gold)", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(200,150,60,0.3))" }} />
          </div>
        </header>

        {/* Search */}
        <form onSubmit={handleScan} style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", border: "1px solid rgba(200,150,60,0.3)", background: "rgba(240,235,224,0.02)" }}>
            <div style={{ padding: "16px 20px", fontSize: "12px", color: "var(--gold)", background: "rgba(200,150,60,0.06)", borderRight: "1px solid rgba(200,150,60,0.2)", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}>
              https://
            </div>
            <input
              ref={inputRef}
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="example.com"
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", padding: "16px 20px", fontFamily: "IBM Plex Mono, monospace", fontSize: "13px", color: "var(--parchment)", caretColor: "var(--gold)", minWidth: 0 }}
            />
            <button
              type="submit"
              disabled={scanning || !domain.trim()}
              style={{ padding: "16px 28px", background: scanning ? "rgba(200,150,60,0.4)" : "var(--gold)", border: "none", cursor: scanning ? "not-allowed" : "pointer", fontFamily: "IBM Plex Mono, monospace", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--ink)", fontWeight: 400, transition: "background 0.2s", whiteSpace: "nowrap" }}
            >
              {scanning ? "Scanning…" : "Scan"}
            </button>
          </div>
        </form>

        {/* Examples */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "48px", alignItems: "center" }}>
          <span style={{ fontSize: "9px", color: "var(--mist)", letterSpacing: "2px" }}>TRY:</span>
          {EXAMPLES.map(ex => (
            <button key={ex} onClick={() => { setDomain(ex); inputRef.current?.focus(); }}
              style={{ fontSize: "10px", color: "var(--mist)", background: "transparent", border: "1px solid rgba(122,143,160,0.2)", padding: "4px 10px", cursor: "pointer", fontFamily: "IBM Plex Mono, monospace" }}>
              {ex}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "16px 20px", border: "1px solid rgba(181,67,42,0.4)", background: "rgba(181,67,42,0.06)", fontSize: "12px", color: "#e07b39", marginBottom: "32px" }}>
            ⚠ {error}
          </div>
        )}

        {/* Scanning state */}
        {scanning && (
          <div style={{ padding: "40px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Resolving DNS…", "Querying IP intelligence…", "Calculating sovereignty…"].map((msg, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", opacity: 0, animation: `fadeUp 0.4s ease ${i * 0.15}s both` }}>
                <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--gold)", animation: `pulseGlow 1s ease-in-out ${i * 0.2}s infinite` }} />
                <span style={{ fontSize: "11px", color: "var(--mist)", letterSpacing: "1px" }}>{msg}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {result && !scanning && (
          <div style={{ animation: "fadeUp 0.5s ease both" }}>

            {/* Domain header */}
            <div style={{ marginBottom: "40px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "8px" }}>SCAN RESULT</div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, color: "var(--parchment)", wordBreak: "break-all" }}>
                {result.domain}
              </h2>
              <div style={{ fontSize: "11px", color: "var(--mist)", marginTop: "6px" }}>
                {result.ip} · {new Date().toISOString().slice(0, 19).replace("T", " ")} UTC
              </div>
            </div>

            {/* Signal Map */}
            <section style={{ marginBottom: "1px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "16px" }}>SIGNAL JOURNEY</div>
              <div style={{ border: "1px solid rgba(200,150,60,0.15)", padding: "24px", background: "rgba(26,74,107,0.06)" }}>
                <SignalMap originCity="Riyadh" originCountry="SA" destCity={result.city} destCountry={result.country} destCoords={result.coords} score={result.sovereignty.total} />
              </div>
            </section>

            {/* Data cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "rgba(200,150,60,0.08)", marginBottom: "1px" }}>
              {[
                { label: "Server location", value: result.city || "Unknown", sub: result.country },
                { label: "Infrastructure", value: result.infraOwner, sub: result.org },
                { label: "Autonomous system", value: result.asn, sub: "BGP routing" },
                { label: "IP address", value: result.ip, sub: "IPv4" },
              ].map((cell, i) => (
                <div key={i} style={{ background: "var(--ink)", padding: "24px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--mist)", marginBottom: "10px" }}>{cell.label}</div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 300, color: "var(--parchment)", marginBottom: "4px", wordBreak: "break-word" }}>{cell.value}</div>
                  <div style={{ fontSize: "10px", color: "var(--mist)", wordBreak: "break-word" }}>{cell.sub}</div>
                </div>
              ))}
            </div>

            {/* Sovereignty */}
            <section style={{ border: "1px solid rgba(200,150,60,0.2)", padding: "28px", background: "rgba(200,150,60,0.02)", marginBottom: "1px" }}>
              <div style={{ fontSize: "9px", letterSpacing: "4px", color: "var(--gold)" }}>SOVEREIGNTY SCORE</div>
              <SovereigntyMeter result={result.sovereignty} />
            </section>

            {/* Cables */}
            {result.cables?.length > 0 && (
              <section style={{ border: "1px solid rgba(200,150,60,0.12)", padding: "28px", background: "rgba(26,74,107,0.04)", marginBottom: "1px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "20px" }}>LIKELY UNDERSEA CABLES</div>
                {result.cables.map((cable, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.04)", gap: "16px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontWeight: 300, color: "var(--parchment)", marginBottom: "4px" }}>{cable.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--mist)" }}>{cable.countries.slice(0, 6).join(" → ")}{cable.countries.length > 6 && " → …"}</div>
                      {cable.owners && <div style={{ fontSize: "10px", color: "rgba(122,143,160,0.5)", marginTop: "2px" }}>{cable.owners.slice(0, 3).join(", ")}</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "12px", color: "var(--gold)" }}>{cable.length}</div>
                      {cable.readyForService && <div style={{ fontSize: "10px", color: "var(--mist)", marginTop: "2px" }}>since {cable.readyForService}</div>}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Poem */}
            <section style={{ border: "1px solid rgba(200,150,60,0.25)", padding: "clamp(28px, 5vw, 48px)", background: "rgba(181,67,42,0.03)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-30px", left: "20px", fontFamily: "Cormorant Garamond, serif", fontSize: "200px", color: "rgba(200,150,60,0.04)", lineHeight: 1, pointerEvents: "none", userSelect: "none" }}>"</div>
              <div style={{ fontSize: "9px", letterSpacing: "4px", color: "var(--gold)", marginBottom: "4px", position: "relative" }}>GENERATED POEM</div>
              <div style={{ fontSize: "9px", color: "var(--mist)", marginBottom: "4px", position: "relative" }}>Written by Claude AI · decolonial voice · unique to this scan</div>
              <div style={{ position: "relative" }}>
                <PoemDisplay poem={poem} isLoading={poemLoading} />
              </div>
            </section>

            {/* Footer */}
            <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "10px", color: "rgba(122,143,160,0.4)", lineHeight: 1.8 }}>
              Data: IPinfo.io · Sovereignty scoring is interpretive, not legal · Cable data from TeleGeography · Poem by Anthropic Claude
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </main>
  );
}
