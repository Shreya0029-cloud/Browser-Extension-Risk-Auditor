import { useState } from "react";
import { Activity, ShieldCheck, Sparkles, RefreshCw, Plus, Globe } from "lucide-react";
import ScoreGauge from "./ScoreGauge.jsx";
import BreakdownChart from "./BreakdownChart.jsx";
import { scoreExtension } from "../../shared/scoring/scoreEngine.js";

const ALL_AVAILABLE_PERMISSIONS = [
  { key: "debugger", weight: 10, tier: "Critical", desc: "Full control over browser debugger; can inspect all code and memory" },
  { key: "proxy", weight: 10, tier: "Critical", desc: "Can redirect and inspect all browser web connections" },
  { key: "nativeMessaging", weight: 10, tier: "Critical", desc: "Can invoke binary code on the host operating system outside browser sandbox" },
  { key: "webRequestBlocking", weight: 10, tier: "Critical", desc: "Can intercept, inspect, modify, and drop in-flight HTTP requests" },
  { key: "management", weight: 9, tier: "Critical", desc: "Can read, disable, and uninstall other browser extensions" },
  { key: "webRequest", weight: 9, tier: "Critical", desc: "Can observe in-flight headers, query params, and network traffic" },
  { key: "declarativeNetRequest", weight: 8, tier: "High", desc: "Can modify request headers and block network requests declaratively" },
  { key: "cookies", weight: 7, tier: "High", desc: "Can read and steal session cookies, auth tokens, and credentials" },
  { key: "downloads", weight: 7, tier: "High", desc: "Can initiate and monitor file downloads to disk" },
  { key: "scripting", weight: 6, tier: "High", desc: "Can inject and execute arbitrary JavaScript code inside visited pages" },
  { key: "tabs", weight: 5, tier: "Medium", desc: "Can access sensitive tab URLs, titles, and browsing activity" },
  { key: "clipboardRead", weight: 4, tier: "Medium", desc: "Can silently read the user's system clipboard contents" },
  { key: "activeTab", weight: 4, tier: "Medium", desc: "Can inspect tab when user explicitly invokes extension" },
  { key: "unlimitedStorage", weight: 2, tier: "Low", desc: "Can allocate unlimited disk storage space locally" },
  { key: "storage", weight: 1, tier: "Low", desc: "Standard extension configuration storage" },
  { key: "alarms", weight: 1, tier: "Low", desc: "Can schedule periodic recurring background tasks" },
];

export default function SimulatorView({ onSaveExtensionToDevice }) {
  const [extName, setExtName] = useState("Custom Audited Tool");
  const [selectedPerms, setSelectedPerms] = useState(["webRequest", "cookies", "storage"]);
  const [hostPermission, setHostPermission] = useState("<all_urls>");
  const [domainsInput, setDomainsInput] = useState("api.exfil-telemetry.io, tracker-beacon.org");
  const [savedNotice, setSavedNotice] = useState(false);

  const observedDomains = domainsInput
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  const scored = scoreExtension({
    permissions: selectedPerms,
    hostPermissions: hostPermission ? [hostPermission] : [],
    observedDomains,
  });

  const handleToggle = (key) => {
    setSelectedPerms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSave = () => {
    const newExt = {
      extensionId: "sim-" + Date.now().toString(36),
      name: extName.trim() || "Simulated Extension",
      version: "1.0.0",
      installType: "simulator",
      enabled: true,
      permissions: selectedPerms,
      hostPermissions: hostPermission ? [hostPermission] : [],
      observedDomains,
      unfamiliarDomains: scored.unfamiliarDomains,
      permissionScore: scored.permissionScore,
      runtimeAdjustment: scored.runtimeAdjustment,
      compositeScore: scored.compositeScore,
      riskLabel: scored.riskLabel,
      reasons: scored.reasons,
      scoreBreakdown: scored.scoreBreakdown,
      checkedAt: new Date().toISOString(),
      previous: null,
    };
    onSaveExtensionToDevice(newExt);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "30px 40px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px", color: "var(--text)" }}>
              Interactive Permission Risk Simulator
            </h1>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 13 }}>
              Toggle permissions, host scopes, and runtime domains to test how the weighted scoring engine scores any extension.
            </p>
          </div>
          <button
            onClick={handleSave}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              borderRadius: 8,
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <Plus size={15} />
            <span>Save to Current Device</span>
          </button>
        </div>

        {savedNotice && (
          <div style={{ marginBottom: 20, padding: "10px 16px", borderRadius: 8, background: "rgba(56, 199, 147, 0.15)", border: "1px solid var(--risk-low)", color: "var(--risk-low)", fontSize: 13, fontWeight: 600 }}>
            ✓ Successfully saved extension to your active device dashboard!
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
          {/* Controls Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Extension Name Input */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                SIMULATED EXTENSION NAME
              </label>
              <input
                value={extName}
                onChange={(e) => setExtName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
            </div>

            {/* Host Scope Selector */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                HOST ACCESS PATTERN (SCOPE)
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { value: "<all_urls>", label: "<all_urls> (Unrestricted access to all web traffic)", weight: "+15 pts" },
                  { value: "https://*/*", label: "https://*/* (All HTTPS origins)", weight: "+12 pts" },
                  { value: "*://*.amazon.com/*", label: "*://*.amazon.com/* (Specific wildcard domain)", weight: "+8 pts" },
                  { value: "", label: "No Host Permissions", weight: "+0 pts" },
                ].map((hp) => (
                  <label
                    key={hp.value}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: hostPermission === hp.value ? "var(--accent-bg)" : "var(--surface-raised)",
                      border: `1px solid ${hostPermission === hp.value ? "var(--accent)" : "var(--border)"}`,
                      cursor: "pointer",
                      fontSize: 12.5,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="radio"
                        name="hostScope"
                        checked={hostPermission === hp.value}
                        onChange={() => setHostPermission(hp.value)}
                      />
                      <span>{hp.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-text)" }}>{hp.weight}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Declared Permissions Checklist */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)" }}>
                  DECLARED PERMISSIONS ({selectedPerms.length} selected)
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedPerms([])}
                  style={{ background: "transparent", border: "none", color: "var(--text-faint)", fontSize: 11, cursor: "pointer" }}
                >
                  Clear all
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
                {ALL_AVAILABLE_PERMISSIONS.map((perm) => {
                  const isChecked = selectedPerms.includes(perm.key);
                  const tierColor = perm.tier === "Critical" ? "var(--risk-high)" : perm.tier === "High" ? "var(--risk-medium)" : "var(--risk-low)";
                  return (
                    <label
                      key={perm.key}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "8px 10px",
                        borderRadius: 6,
                        background: isChecked ? "var(--surface-raised)" : "transparent",
                        border: `1px solid ${isChecked ? "var(--border)" : "transparent"}`,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(perm.key)}
                        style={{ marginTop: 3 }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{perm.key}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, color: tierColor, background: "rgba(0,0,0,0.3)", padding: "1px 6px", borderRadius: 4 }}>
                            Tier: {perm.tier} (w={perm.weight})
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>
                          {perm.desc}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Runtime Observed Domains */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 18 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                RUNTIME SIGNAL: UNFAMILIAR NETWORK DOMAINS
              </label>
              <input
                value={domainsInput}
                onChange={(e) => setDomainsInput(e.target.value)}
                placeholder="tracker.io, exfil.biz, telemetry.net"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 6 }}>
                Singh et al. (2025): Even extensions with minimal permissions can leak data. +5 points for each unfamiliar domain (capped at 25).
              </div>
            </div>
          </div>

          {/* Real-Time Score Feedback Column */}
          <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Score Card */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
                Live Composite Risk Result
              </div>
              <ScoreGauge score={scored.compositeScore} label={scored.riskLabel} />
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
                <strong>{scored.permissionScore}</strong> static permissions + <strong>{scored.runtimeAdjustment}</strong> runtime adjustment
              </div>
            </div>

            {/* Reasons Card */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>
                Plain-Language Risk Reasons
              </div>
              <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "var(--text)" }}>
                {scored.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Breakdown Chart */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>
                Score Contribution Breakdown
              </div>
              <BreakdownChart breakdown={scored.scoreBreakdown} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
