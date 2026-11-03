import { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Globe,
  Laptop,
  Plus,
  RefreshCw,
  Settings2,
  FileCode,
  AlertTriangle,
  Upload,
  Cpu,
  Layers,
  Lock,
  Eye,
  CheckCircle2,
  FolderSearch,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import Sidebar from "./Sidebar.jsx";
import DetailPanel from "./DetailPanel.jsx";

export default function DashboardView({
  devices,
  activeDeviceId,
  activeDevice,
  extensions,
  selectedId,
  onSelectExtension,
  onOpenAuditModal,
  onOpenSettings,
  onScanDevice,
  onResetDevice,
  scanning,
  isExtensionContext,
  onOpenSetupGuide,
}) {
  const [manifestUploadError, setManifestUploadError] = useState(null);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // Compute live device stats
  const totalCount = extensions?.length || 0;
  const highRiskCount = (extensions || []).filter((e) => e.riskLabel === "High").length;
  const medRiskCount = (extensions || []).filter((e) => e.riskLabel === "Medium").length;
  const lowRiskCount = (extensions || []).filter((e) => e.riskLabel === "Low").length;

  const deviceScore =
    activeDevice?.deviceRiskScore !== null && activeDevice?.deviceRiskScore !== undefined
      ? activeDevice.deviceRiskScore
      : totalCount > 0
      ? Math.round(extensions.reduce((acc, e) => acc + (Number(e.compositeScore) || 0), 0) / totalCount)
      : null;

  const allDomains = new Set();
  (extensions || []).forEach((e) => {
    (e.observedDomains || []).forEach((d) => allDomains.add(d));
  });

  const selected = (extensions || []).find((e) => e.extensionId === selectedId) || extensions?.[0] || null;

  // File upload handler for manifest.json
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const manifest = JSON.parse(event.target.result);
        const name = manifest.name || file.name.replace(".json", "");
        const version = manifest.version || "1.0.0";
        const permissions = manifest.permissions || [];
        const hostPermissions = manifest.host_permissions || [];

        onOpenAuditModal({
          name,
          version,
          permissions,
          hostPermissions,
        });
        setManifestUploadError(null);
      } catch (err) {
        setManifestUploadError("Invalid JSON manifest file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Environment specs for preview
  const hardware = activeDevice?.inspectionReport?.hardware || {
    cpuCores: typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 8 : 8,
    memoryGB: typeof navigator !== "undefined" ? navigator.deviceMemory || 8 : 8,
    screenRes: typeof window !== "undefined" && window.screen ? `${window.screen.width}x${window.screen.height}` : "1920x1080",
    colorDepth: "24-bit",
  };

  const perms = activeDevice?.inspectionReport?.permissions || {
    notifications: "prompt",
    geolocation: "prompt",
    clipboardRead: "prompt",
  };

  const isInspected = Boolean(activeDevice?.inspected);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", position: "relative" }}>
      {/* Metrics Banner */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          padding: "16px 24px",
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
            Total Extensions
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>
            {isInspected ? totalCount : "—"}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
            {isInspected ? `Audited on ${activeDevice?.name?.split("(")[0]}` : "Pending inspection"}
          </div>
        </div>

        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
            High Risk Alerts
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: !isInspected ? "var(--text-faint)" : highRiskCount > 0 ? "var(--risk-high)" : "var(--risk-low)",
              marginTop: 2,
            }}
          >
            {isInspected ? highRiskCount : "—"}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
            {isInspected ? `${medRiskCount} Medium Risk` : "Awaiting scan"}
          </div>
        </div>

        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
            Device Risk Index
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color:
                !isInspected || deviceScore === null
                  ? "var(--text-faint)"
                  : deviceScore >= 70
                  ? "var(--risk-high)"
                  : deviceScore >= 40
                  ? "var(--risk-medium)"
                  : "var(--risk-low)",
              marginTop: 2,
            }}
          >
            {isInspected && deviceScore !== null ? (
              <>
                {deviceScore}{" "}
                <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-faint)" }}>/ 100</span>
              </>
            ) : (
              "Uninspected"
            )}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>
            {isInspected ? `${activeDevice?.riskLabel || "Evaluated"} Security Posture` : "Requires device scan"}
          </div>
        </div>

        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
            Observed Domains
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>
            {isInspected ? allDomains.size : "—"}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)" }}>External network calls</div>
        </div>

        <div style={{ background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" }}>
            Inspection Status
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: isInspected ? "var(--risk-low)" : "var(--risk-medium)",
              marginTop: 5,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {isInspected ? (
              <>
                <CheckCircle2 size={16} /> <span>Audited</span>
              </>
            ) : (
              <>
                <AlertTriangle size={16} /> <span>Uninspected</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text-muted)", marginTop: 2 }}>
            {activeDevice?.inspectedAt ? new Date(activeDevice.inspectedAt).toLocaleTimeString() : "Never inspected"}
          </div>
        </div>
      </div>

      {/* Device Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 24px",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)" }}>Target Device:</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)" }}>{activeDevice?.name}</span>
          <span style={{ fontSize: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", color: "var(--accent-text)", padding: "1px 6px", borderRadius: 4 }}>
            {activeDevice?.platform} • {activeDevice?.browser}
          </span>
          {activeDevice?.isCurrent && (
            <span style={{ fontSize: 10, background: "rgba(56, 199, 147, 0.15)", color: "var(--risk-low)", border: "1px solid var(--risk-low)", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
              Physical Machine
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Upload manifest.json */}
          <label
            title="Import real manifest.json to audit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 11px",
              borderRadius: 6,
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 11.5,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Upload size={12} />
            <span>Import manifest.json</span>
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
          </label>

          <button
            onClick={() => onOpenAuditModal()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 12px",
              borderRadius: 6,
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            <Plus size={13} />
            <span>Audit Custom Extension</span>
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onScanDevice()}
            disabled={scanning}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 6,
              background: isInspected ? "var(--surface-raised)" : "var(--accent)",
              border: isInspected ? "1px solid var(--border)" : "none",
              color: isInspected ? "var(--text)" : "#fff",
              fontSize: 11.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: isInspected ? "none" : "0 0 15px rgba(59, 130, 246, 0.4)",
            }}
          >
            <RefreshCw size={12} style={{ animation: scanning ? "spin 1s linear infinite" : "none" }} />
            <span>{scanning ? "Inspecting Device..." : isInspected ? "Re-Inspect Device" : "⚡ Inspect Device Now"}</span>
          </button>

          {isInspected && (
            <button
              onClick={() => onResetDevice && onResetDevice()}
              title="Reset device back to uninspected state"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                borderRadius: 6,
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: 11,
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            title="Configure Backend API"
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <Settings2 size={13} />
          </button>
        </div>
      </div>

      {manifestUploadError && (
        <div style={{ padding: "8px 24px", background: "var(--risk-high-bg)", color: "var(--risk-high)", fontSize: 12 }}>
          {manifestUploadError}
        </div>
      )}

      {/* Hardware & Browser Inspection Header Strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 24px",
          background: "var(--surface-raised)",
          borderBottom: "1px solid var(--border-soft)",
          fontSize: 11,
          color: "var(--text-muted)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>
            <strong style={{ color: "var(--text)" }}>Hardware:</strong> {hardware.cpuCores} CPU Cores • {hardware.memoryGB} GB RAM • {hardware.screenRes}
          </span>
          <span>
            <strong style={{ color: "var(--text)" }}>Sandbox Context:</strong> {typeof window !== "undefined" && window.isSecureContext ? "Secure (HTTPS)" : "Standard"}
          </span>
          <span>
            <strong style={{ color: "var(--text)" }}>Permissions:</strong> Notif ({perms.notifications}) • Geo ({perms.geolocation})
          </span>
        </div>
        <div>
          <span>
            <strong style={{ color: "var(--text)" }}>Scoring Engine:</strong> Singh et al. (2025) Weights Active
          </span>
        </div>
      </div>

      {/* Main View Area: Either Uninspected Portal OR Inspected 2-Column Split */}
      {!isInspected ? (
        /* UNINSPECTED DEVICE PORTAL */
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 20px",
            background: "radial-gradient(ellipse at top, rgba(59, 130, 246, 0.08) 0%, transparent 70%), var(--bg)",
          }}
        >
          <div style={{ maxWidth: 680, width: "100%", textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                boxShadow: "0 10px 25px rgba(59, 130, 246, 0.2)",
              }}
            >
              <Laptop size={32} style={{ color: "var(--accent)" }} />
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-text)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Device Security Gateway
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", margin: "8px 0 10px", letterSpacing: "-0.02em" }}>
              Inspect {activeDevice?.name}
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 540, margin: "0 auto 28px" }}>
              This device has not been audited yet. Run an active device inspection to query browser sandbox boundaries, detect installed extensions, and compute mathematically grounded risk scores.
            </p>

            {/* Hardware & Browser Inspection Diagnostics Box */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                textAlign: "left",
                marginBottom: 28,
              }}
            >
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--accent)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <Cpu size={14} /> Hardware Profile
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{hardware.cpuCores} CPU Cores</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{hardware.memoryGB} GB System Memory</div>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--risk-low)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <Lock size={14} /> Security Context
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>
                  {typeof window !== "undefined" && window.isSecureContext ? "Secure Context" : "Standard Context"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Cross-Origin Sandbox</div>
              </div>

              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--risk-medium)", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                  <Eye size={14} /> Browser Permissions
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Attack Surface Ready</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>Camera / Mic / Geo / Storage</div>
              </div>
            </div>

            {/* Main Action Call to Action */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => onScanDevice()}
                disabled={scanning}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  padding: "14px 36px",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  border: "none",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                  transition: "transform 0.15s ease",
                }}
              >
                <RefreshCw size={18} style={{ animation: scanning ? "spin 1s linear infinite" : "none" }} />
                <span>{scanning ? "Performing Deep Device Audit..." : "⚡ Run Complete Device & Extension Inspection"}</span>
              </button>

              <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>
                Or select an inspection method below:
              </div>

              {/* Alternative Discovery Methods */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 6,
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <FolderSearch size={14} style={{ color: "var(--accent)" }} />
                  <span>Upload Local manifest.json</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: "none" }} />
                </label>

                <button
                  onClick={() => onOpenAuditModal()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 14px",
                    borderRadius: 6,
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <Plus size={14} style={{ color: "var(--accent)" }} />
                  <span>Audit Custom Extension</span>
                </button>
              </div>

              {/* Preset Archetype Buttons to quickly test distinct device configurations */}
              <div style={{ marginTop: 24, padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, width: "100%", textAlign: "left" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 10 }}>
                  Or audit with a realistic device archetype profile:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  <button
                    onClick={() => onScanDevice({ profile: "windows_workstation" })}
                    style={{
                      padding: "10px 12px",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Developer Workstation</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>React DevTools, Docs, IDM</div>
                  </button>

                  <button
                    onClick={() => onScanDevice({ profile: "macos_brave" })}
                    style={{
                      padding: "10px 12px",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700 }}>Hardened Privacy Setup</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>uBlock Origin, Bitwarden</div>
                  </button>

                  <button
                    onClick={() => onScanDevice({ profile: "compromised" })}
                    style={{
                      padding: "10px 12px",
                      background: "var(--surface-raised)",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text)",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--risk-high)" }}>High-Risk Sideloads</div>
                    <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 2 }}>Proxy VPN, Search Hijacker</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INSPECTED DEVICE 2-COLUMN SPLIT */
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left Column: Extensions List */}
          <div style={{ width: 320, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>
            <Sidebar extensions={extensions} selectedId={selected?.extensionId} onSelect={onSelectExtension} />
          </div>

          {/* Right Column: Detailed Extension Inspection */}
          <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
            {selected ? (
              <DetailPanel extension={selected} />
            ) : (
              <div style={{ padding: 60, textAlign: "center", color: "var(--text-muted)" }}>
                <ShieldAlert size={36} style={{ color: "var(--text-faint)", marginBottom: 12 }} />
                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>No extensions found on this device</div>
                <p style={{ fontSize: 13, maxWidth: 400, margin: "8px auto 20px", color: "var(--text-muted)" }}>
                  Click "Audit Custom Extension" or import a manifest.json to analyze extension permissions for this device profile.
                </p>
                <button
                  onClick={() => onOpenAuditModal()}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 6,
                    background: "var(--accent)",
                    border: "none",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  + Audit An Extension
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-Time Scanning Modal / Overlay when scanning is active */}
      {scanning && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(10, 14, 23, 0.85)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "28px 36px",
              maxWidth: 460,
              width: "100%",
              boxShadow: "0 25px 50px rgba(0,0,0,0.7)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(59, 130, 246, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <RefreshCw size={26} style={{ color: "var(--accent)", animation: "spin 1s linear infinite" }} />
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginBottom: 6 }}>
              Inspecting {activeDevice?.name}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 20 }}>
              Analyzing system architecture, browser attack surface, and extension privilege models...
            </div>

            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--risk-low)" }}>
                <CheckCircle2 size={14} /> <span>Querying CPU cores & device memory limits</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--risk-low)" }}>
                <CheckCircle2 size={14} /> <span>Evaluating browser sandbox & permission boundaries</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--accent)" }}>
                <Activity size={14} style={{ animation: "pulse 1.5s infinite" }} />{" "}
                <span>Testing Chrome Extension runtime bridge</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-faint)" }}>
                <Layers size={14} /> <span>Applying Singh et al. (2025) permission weights</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-faint)" }}>
                <Globe size={14} /> <span>Auditing observed domain telemetry & synthesizing score</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
