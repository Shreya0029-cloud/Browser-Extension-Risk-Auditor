import { Chrome, Download, CheckCircle2, Terminal, AlertTriangle, Copy, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SetupGuideView({ onGoToDashboard }) {
  const [copied, setCopied] = useState(false);
  const distPath = "c:\\Users\\DELL\\OneDrive\\Desktop\\Browser_Extension\\browser-extension-risk-auditor\\extension\\dist";

  const handleCopy = () => {
    navigator.clipboard.writeText(distPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "40px", background: "var(--bg)" }}>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--accent-text)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", marginBottom: 8 }}>
            <Chrome size={16} /> Device Setup Guide
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px", color: "#fff" }}>
            Audit Real Local Extensions on This Device
          </h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6 }}>
            Normal web pages are prevented by Chrome's sandbox from querying your computer's installed extensions. By loading this project into your Chrome browser, you grant it the <code>chrome.management</code> permission to audit your real installed extensions.
          </p>
        </div>

        {/* 3 Step Guide Cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Step 1 */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 22, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              1
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>
                Open Chrome Extensions Console
              </h3>
              <p style={{ margin: "0 0 10px", color: "var(--text-muted)", fontSize: 13 }}>
                In your Google Chrome address bar, type or paste:
              </p>
              <code style={{ display: "inline-block", padding: "6px 12px", background: "var(--surface-raised)", border: "1px solid var(--border)", borderRadius: 6, fontFamily: "var(--font-mono)", color: "var(--accent-text)", fontSize: 13 }}>
                chrome://extensions
              </code>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 22, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              2
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>
                Enable Developer Mode
              </h3>
              <p style={{ margin: "0", color: "var(--text-muted)", fontSize: 13 }}>
                In the top-right corner of the <code>chrome://extensions</code> page, toggle on the <strong>Developer mode</strong> switch. This enables the "Load unpacked" button.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: 22, display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
              3
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px", color: "var(--text)" }}>
                Click "Load unpacked" & Select Extension Build Folder
              </h3>
              <p style={{ margin: "0 0 10px", color: "var(--text-muted)", fontSize: 13 }}>
                Click <strong>Load unpacked</strong> and select the <code>extension/dist</code> directory on your disk:
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--surface-raised)", border: "1px solid var(--border)", padding: "8px 12px", borderRadius: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                  {distPath}
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: copied ? "var(--risk-low-bg)" : "transparent",
                    border: `1px solid ${copied ? "var(--risk-low)" : "var(--border)"}`,
                    color: copied ? "var(--risk-low)" : "var(--text)",
                    fontSize: 11,
                    cursor: "pointer",
                  }}
                >
                  <Copy size={12} />
                  <span>{copied ? "Copied!" : "Copy Path"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ready Callout */}
        <div style={{ marginTop: 28, padding: 20, borderRadius: 10, background: "var(--surface-raised)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              Ready to explore your audited devices?
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
              Switch back to the Executive Security Dashboard to view extensions across your fleet.
            </div>
          </div>
          <button
            onClick={onGoToDashboard}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 18px",
              borderRadius: 6,
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <span>Go to Dashboard</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
