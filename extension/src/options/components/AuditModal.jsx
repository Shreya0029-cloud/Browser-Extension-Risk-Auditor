import { useState, useEffect } from "react";
import { X, ShieldAlert, Sparkles } from "lucide-react";
import { scoreExtension } from "../../shared/scoring/scoreEngine.js";

const COMMON_PERMISSIONS = [
  { key: "proxy", label: "proxy (Redirect/Intercept traffic)", tier: "Critical" },
  { key: "webRequestBlocking", label: "webRequestBlocking (Block/Alter requests)", tier: "Critical" },
  { key: "webRequest", label: "webRequest (Inspect in-flight traffic)", tier: "Critical" },
  { key: "management", label: "management (Control other extensions)", tier: "Critical" },
  { key: "debugger", label: "debugger (Full browser debugging)", tier: "Critical" },
  { key: "nativeMessaging", label: "nativeMessaging (Run native OS binaries)", tier: "Critical" },
  { key: "cookies", label: "cookies (Read session tokens/cookies)", tier: "High" },
  { key: "scripting", label: "scripting (Inject code into pages)", tier: "High" },
  { key: "tabs", label: "tabs (Read active tab URLs/titles)", tier: "Medium" },
  { key: "storage", label: "storage (Local disk storage)", tier: "Low" },
  { key: "alarms", label: "alarms (Background recurring timers)", tier: "Low" },
];

const HOST_OPTIONS = [
  { value: "", label: "No Host Permissions" },
  { value: "<all_urls>", label: "<all_urls> (Full access to all websites - Highest Risk)" },
  { value: "https://*/*", label: "https://*/* (All HTTPS websites)" },
  { value: "*://*.amazon.com/*", label: "*://*.amazon.com/* (Specific wildcard domain)" },
];

export default function AuditModal({ isOpen, onClose, onAddExtension, prefill }) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("1.0.0");
  const [selectedPerms, setSelectedPerms] = useState(["storage"]);
  const [hostPattern, setHostPattern] = useState("");
  const [domainsInput, setDomainsInput] = useState("");

  useEffect(() => {
    if (prefill) {
      if (prefill.name) setName(prefill.name);
      if (prefill.version) setVersion(prefill.version);
      if (prefill.permissions) setSelectedPerms(prefill.permissions);
      if (prefill.hostPermissions && prefill.hostPermissions[0]) {
        setHostPattern(prefill.hostPermissions[0]);
      }
    }
  }, [prefill]);

  if (!isOpen) return null;

  const handleTogglePerm = (perm) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const applyPreset = (presetName) => {
    if (presetName === "high") {
      setName("Free Proxy & VPN Booster");
      setSelectedPerms(["proxy", "webRequestBlocking", "webRequest", "management", "storage"]);
      setHostPattern("<all_urls>");
      setDomainsInput("telemetry-beacon.org, data-exfil.xyz");
    } else if (presetName === "medium") {
      setName("Shopping Price Tracker");
      setSelectedPerms(["cookies", "scripting", "tabs", "storage"]);
      setHostPattern("https://*/*");
      setDomainsInput("analytics.coupons.net");
    } else if (presetName === "low") {
      setName("Minimal Dark Theme");
      setSelectedPerms(["storage", "alarms"]);
      setHostPattern("");
      setDomainsInput("");
    }
  };

  const handleAudit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const hostPermissions = hostPattern ? [hostPattern] : [];
    const observedDomains = domainsInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const scored = scoreExtension({
      permissions: selectedPerms,
      hostPermissions,
      observedDomains,
    });

    const newExt = {
      extensionId: "custom-" + Date.now().toString(36),
      name: name.trim(),
      version: version.trim() || "1.0.0",
      installType: "custom-audit",
      enabled: true,
      permissions: selectedPerms,
      hostPermissions,
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

    onAddExtension(newExt);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15 }}>
            <ShieldAlert size={18} style={{ color: "var(--accent)" }} />
            <span>Audit Any Extension (Live Sandbox)</span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleAudit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Presets */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>
              Quick Presets
            </label>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button
                type="button"
                onClick={() => applyPreset("high")}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  borderRadius: 6,
                  border: "1px solid var(--risk-high)",
                  background: "var(--risk-high-bg)",
                  color: "var(--risk-high)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                High Risk (Exfil VPN)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("medium")}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  borderRadius: 6,
                  border: "1px solid var(--risk-medium)",
                  background: "var(--risk-medium-bg)",
                  color: "var(--risk-medium)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Medium Risk (Coupon Tracker)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("low")}
                style={{
                  padding: "5px 10px",
                  fontSize: 11,
                  borderRadius: 6,
                  border: "1px solid var(--risk-low)",
                  background: "var(--risk-low-bg)",
                  color: "var(--risk-low)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Low Risk (Dark Theme)
              </button>
            </div>
          </div>

          {/* Name & Version */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Extension Name
              </label>
              <input
                required
                placeholder="e.g. My Chrome Tool"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
                Version
              </label>
              <input
                placeholder="1.0.0"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: "var(--surface-raised)",
                  color: "var(--text)",
                  fontSize: 13,
                }}
              />
            </div>
          </div>

          {/* Host Permissions */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Host Permission Access (Scope)
            </label>
            <select
              value={hostPattern}
              onChange={(e) => setHostPattern(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text)",
                fontSize: 12.5,
              }}
            >
              {HOST_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Declared Permissions */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Declared Permissions ({selectedPerms.length} selected)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 6,
                maxHeight: 180,
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: 10,
                background: "var(--surface-raised)",
              }}
            >
              {COMMON_PERMISSIONS.map((perm) => (
                <label
                  key={perm.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedPerms.includes(perm.key)}
                    onChange={() => handleTogglePerm(perm.key)}
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observed Domains */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 4 }}>
              Observed Runtime Network Domains (comma separated)
            </label>
            <input
              placeholder="e.g. tracker.net, api.exfil.org"
              value={domainsInput}
              onChange={(e) => setDomainsInput(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text)",
                fontSize: 12.5,
              }}
            />
            <span style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4, display: "block" }}>
              Unfamiliar domains contacted at runtime dynamically add +5 risk points each (capped at 25).
            </span>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text)",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Sparkles size={14} />
              Calculate & Audit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
