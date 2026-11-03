import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Layers,
  ArrowRight,
  Terminal,
  FileCode,
  Laptop,
  CheckCircle2,
  Lock,
  Globe,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import ScoreGauge from "./ScoreGauge.jsx";

export default function LandingPage({ onGoToDashboard, onGoToSimulator, onOpenAuth }) {
  // Quick Interactive Mini-Scanner state on Landing Page
  const [demoPerms, setDemoPerms] = useState(["proxy", "webRequestBlocking", "<all_urls>"]);
  const [demoDomains, setDemoDomains] = useState(3);

  const calculateQuickScore = () => {
    let permWeight = 0;
    if (demoPerms.includes("proxy")) permWeight += 10;
    if (demoPerms.includes("webRequestBlocking")) permWeight += 10;
    if (demoPerms.includes("management")) permWeight += 9;
    if (demoPerms.includes("cookies")) permWeight += 7;
    if (demoPerms.includes("scripting")) permWeight += 6;
    if (demoPerms.includes("storage")) permWeight += 1;
    if (demoPerms.includes("<all_urls>")) permWeight += 15;

    const baseScore = Math.min(100, Math.round((permWeight / 45) * 85));
    const runtimeAdj = Math.min(25, demoDomains * 5);
    const composite = Math.min(100, baseScore + runtimeAdj);
    const label = composite >= 70 ? "High" : composite >= 40 ? "Medium" : "Low";
    return { composite, label, baseScore, runtimeAdj };
  };

  const scoreData = calculateQuickScore();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", background: "var(--bg)", overflowY: "auto" }}>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "70px 24px 60px",
          textAlign: "center",
          borderBottom: "1px solid var(--border)",
          background: "radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: 999,
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "#93c5fd",
              fontSize: 12,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span>BCSE410L Review-I • Manifest V3 Defensive Security Architecture</span>
          </div>

          <h1
            style={{
              fontSize: 44,
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 16px",
              letterSpacing: "-0.03em",
              color: "#fff",
            }}
          >
            Audit Browser Extensions. <br />
            <span
              style={{
                background: "linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Detect Silent Privilege Drift.
            </span>
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "var(--text-muted)",
              maxWidth: 680,
              margin: "0 0 32px",
            }}
          >
            Chrome extensions operate with high-level browser privileges—intercepting web requests, accessing private tokens, and reading stored credentials. SentinelAudit couples <strong>literature-grounded permission weights</strong> with <strong>runtime network attribution</strong> to uncover stealthy update expansions.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={onGoToDashboard}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 8,
                background: "var(--accent)",
                border: "none",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
              }}
            >
              <span>Open Security Dashboard</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onGoToSimulator}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 22px",
                borderRadius: 8,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <Activity size={16} style={{ color: "var(--accent)" }} />
              <span>Interactive Risk Sandbox</span>
            </button>
          </div>
        </div>

        {/* Live Mini Sandbox Card */}
        <div
          style={{
            maxWidth: 780,
            margin: "48px auto 0",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Terminal size={16} style={{ color: "var(--accent)" }} />
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>LIVE RISK CALCULATION ENGINE PREVIEW</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-faint)", fontFamily: "var(--font-mono)" }}>Objective 2 & 4 Formula</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 24, alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>
                Select Requested Permissions to observe score reaction:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {[
                  { key: "proxy", label: "proxy (+10)" },
                  { key: "webRequestBlocking", label: "webRequestBlocking (+10)" },
                  { key: "<all_urls>", label: "<all_urls> (+15)" },
                  { key: "cookies", label: "cookies (+7)" },
                  { key: "scripting", label: "scripting (+6)" },
                  { key: "management", label: "management (+9)" },
                  { key: "storage", label: "storage (+1)" },
                ].map((p) => {
                  const active = demoPerms.includes(p.key);
                  return (
                    <button
                      key={p.key}
                      onClick={() =>
                        setDemoPerms(active ? demoPerms.filter((x) => x !== p.key) : [...demoPerms, p.key])
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                        background: active ? "var(--accent-bg)" : "var(--surface-raised)",
                        color: active ? "var(--accent-text)" : "var(--text-muted)",
                        fontSize: 11.5,
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                Runtime Signal: Unfamiliar Domains Contacted (+5 ea, max 25): {demoDomains}
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={demoDomains}
                onChange={(e) => setDemoDomains(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
            </div>

            {/* Live Gauge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "var(--surface-raised)",
                padding: "16px",
                borderRadius: 8,
                border: "1px solid var(--border)",
              }}
            >
              <ScoreGauge score={scoreData.composite} label={scoreData.label} />
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>
                {scoreData.baseScore} static + {scoreData.runtimeAdj} runtime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section style={{ padding: "60px 24px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Comprehensive Defense Across 5 Core Review Objectives
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
            Direct implementation of Review-I Section 2.3 for BCSE410L.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
          {[
            {
              icon: Layers,
              title: "1. Browser API Extraction",
              desc: "Collects real declared permissions, host pattern lists, and install origins directly via chrome.management.",
              badge: "Objective 1",
            },
            {
              icon: ShieldAlert,
              title: "2. Weighted Risk Matrix",
              desc: "Rigorous static weights grounded in academic research from 1 (low: alarms, storage) to 10 (critical: proxy, debugger).",
              badge: "Objective 2",
            },
            {
              icon: Globe,
              title: "3. Runtime Traffic Signal",
              desc: "Monitors outgoing service worker traffic with chrome.webRequest, penalizing unfamiliar external domain contacts.",
              badge: "Objective 3",
            },
            {
              icon: Activity,
              title: "4. Composite Risk Score",
              desc: "Produces one unified score (0-100) and human-readable risk reasons for instant executive decision-making.",
              badge: "Objective 4",
            },
            {
              icon: RefreshCw,
              title: "5. Silent Drift Detection",
              desc: "Runs periodic chrome.alarms checks every 6 hours, calculating risk deltas to catch post-install permission increases.",
              badge: "Objective 5",
            },
            {
              icon: Laptop,
              title: "Multi-Device Fleet Auditing",
              desc: "Tracks and isolates extension scores per physical device (Windows, macOS, Linux) with independent fleet profiles.",
              badge: "Enterprise",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: "var(--accent-bg)",
                    color: "var(--accent-text)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <item.icon size={18} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", background: "var(--surface-raised)", padding: "2px 8px", borderRadius: 4 }}>
                  {item.badge}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--text)" }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Literature Foundation */}
      <section style={{ padding: "40px 24px 60px", background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 16px", textAlign: "center" }}>
            Grounding in Peer-Reviewed Security Literature
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
            <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "var(--accent-text)", fontSize: 13, marginBottom: 4 }}>
                Singh et al. (2025)
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Demonstrated that minimal permissions (activeTab + scripting) are sufficient for real-world extensions to execute stealthy data exfiltration, justifying additive runtime adjustments.
              </div>
            </div>
            <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: 18 }}>
              <div style={{ fontWeight: 700, color: "var(--accent-text)", fontSize: 13, marginBottom: 4 }}>
                Kim & Lee (2023)
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Quantified UXSS and credential leakage vulnerabilities in extensions with unrestricted &lt;all_urls&gt; and webRequestBlocking privileges.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: "24px", textAlign: "center", fontSize: 12, color: "var(--text-faint)" }}>
        <div>
          BCSE410L Review-I: Browser Extension Permission Risk Auditor • <strong>Shivam Kaushik (23BCE0058)</strong>
        </div>
        <div style={{ marginTop: 4 }}>
          Defensive Security Tool conforming to Chrome Manifest V3 Standards.
        </div>
      </footer>
    </div>
  );
}
