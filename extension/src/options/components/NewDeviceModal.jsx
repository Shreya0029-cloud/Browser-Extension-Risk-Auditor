import { useState } from "react";
import { X, Laptop, Plus } from "lucide-react";
import { addDevice } from "../../shared/deviceManager.js";

export default function NewDeviceModal({ isOpen, onClose, onDeviceCreated }) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Windows");
  const [browser, setBrowser] = useState("Chrome");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newDevice = addDevice(name.trim(), platform, browser);
    onDeviceCreated(newDevice);
    onClose();
    setName("");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface-raised)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Laptop size={18} style={{ color: "var(--accent)" }} />
            <span style={{ fontWeight: 700, fontSize: 14 }}>Add Monitored Device</span>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Device Profile Name
            </label>
            <input
              required
              placeholder="e.g. Work PC, Home MacBook, Lab Computer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "var(--surface-raised)",
                color: "var(--text)",
                fontSize: 13,
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Platform / OS
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
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
                <option value="Windows">Windows</option>
                <option value="macOS">macOS</option>
                <option value="Linux">Linux</option>
                <option value="ChromeOS">ChromeOS</option>
                <option value="Android">Android</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Browser Engine
              </label>
              <select
                value={browser}
                onChange={(e) => setBrowser(e.target.value)}
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
                <option value="Chrome">Chrome</option>
                <option value="Brave">Brave</option>
                <option value="Edge">Edge</option>
                <option value="Firefox">Firefox</option>
                <option value="Chromium">Chromium</option>
              </select>
            </div>
          </div>

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
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 18px",
                borderRadius: 6,
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Create Device Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
