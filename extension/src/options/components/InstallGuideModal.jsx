import { X, CheckCircle2, AlertTriangle, Download, Chrome } from "lucide-react";

export default function InstallGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
          maxWidth: 600,
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
            <Chrome size={18} style={{ color: "var(--accent)" }} />
            <span>How to Audit Extensions on THIS Device</span>
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

        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 8,
              background: "rgba(234, 179, 8, 0.1)",
              border: "1px solid rgba(234, 179, 8, 0.3)",
              color: "#eab308",
              fontSize: 12.5,
              display: "flex",
              gap: 10,
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <strong>Why does the website show sample extensions?</strong>
              <div style={{ marginTop: 4, color: "var(--text)" }}>
                Google Chrome's security model strictly prohibits normal websites from querying or inspecting extensions
                installed on your computer (via <code>chrome.management</code>). To audit the <strong>real extensions installed on your actual browser</strong>, load this project as a Chrome Extension.
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Download / Locate Project Files</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 12 }}>
                  The extension build is located inside the <code>extension/dist</code> folder in the repository.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Open Extensions in Chrome</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 12 }}>
                  Navigate to <code>chrome://extensions</code> in your Chrome address bar and switch on <strong>Developer mode</strong> (toggle in top-right corner).
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div style={{ fontSize: 13 }}>
                <strong>Click "Load unpacked" & Select Folder</strong>
                <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 12 }}>
                  Click <strong>Load unpacked</strong> and select the <code>extension/dist</code> directory. The extension will automatically audit all real extensions installed on your current browser!
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 20px",
                borderRadius: 6,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
