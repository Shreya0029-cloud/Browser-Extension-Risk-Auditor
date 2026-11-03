import { useState } from "react";
import { ShieldCheck, Laptop, ChevronDown, Plus, LogOut, User, Activity } from "lucide-react";

export default function Navbar({
  activeTab,
  onSelectTab,
  devices,
  activeDeviceId,
  onSelectDevice,
  onAddNewDevice,
  currentUser,
  onOpenAuth,
  onLogout,
  isExtensionContext,
}) {
  const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
  const activeDevice = devices.find((d) => d.id === activeDeviceId) || devices[0];

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        height: 56,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        zIndex: 50,
      }}
    >
      {/* Brand & Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div
          onClick={() => onSelectTab("landing")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)",
            }}
          >
            <ShieldCheck size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: "-0.02em", color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
              <span>SentinelAudit</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: "var(--accent-bg)",
                  color: "var(--accent-text)",
                  border: "1px solid var(--accent)",
                  borderRadius: 4,
                  padding: "1px 5px",
                }}
              >
                MV3
              </span>
            </div>
            <div style={{ fontSize: 10, color: "var(--text-faint)", marginTop: -2 }}>
              Extension Risk Auditor
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            onClick={() => onSelectTab("landing")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: activeTab === "landing" ? "var(--surface-raised)" : "transparent",
              border: "1px solid " + (activeTab === "landing" ? "var(--border)" : "transparent"),
              color: activeTab === "landing" ? "var(--text)" : "var(--text-muted)",
              fontWeight: activeTab === "landing" ? 600 : 500,
              fontSize: 12.5,
            }}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("dashboard")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: activeTab === "dashboard" ? "var(--surface-raised)" : "transparent",
              border: "1px solid " + (activeTab === "dashboard" ? "var(--border)" : "transparent"),
              color: activeTab === "dashboard" ? "var(--text)" : "var(--text-muted)",
              fontWeight: activeTab === "dashboard" ? 600 : 500,
              fontSize: 12.5,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>Dashboard</span>
            <span
              style={{
                fontSize: 10,
                background: activeDevice?.inspected ? "rgba(56, 199, 147, 0.15)" : "rgba(245, 158, 11, 0.15)",
                color: activeDevice?.inspected ? "var(--risk-low)" : "var(--risk-medium)",
                borderRadius: 99,
                padding: "1px 6px",
                fontWeight: 700,
              }}
            >
              {activeDevice?.inspected ? activeDevice?.extensions?.length || 0 : "Inspect"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("simulator")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: activeTab === "simulator" ? "var(--surface-raised)" : "transparent",
              border: "1px solid " + (activeTab === "simulator" ? "var(--border)" : "transparent"),
              color: activeTab === "simulator" ? "var(--text)" : "var(--text-muted)",
              fontWeight: activeTab === "simulator" ? 600 : 500,
              fontSize: 12.5,
            }}
          >
            Risk Simulator
          </button>
          <button
            type="button"
            onClick={() => onSelectTab("setup")}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: activeTab === "setup" ? "var(--surface-raised)" : "transparent",
              border: "1px solid " + (activeTab === "setup" ? "var(--border)" : "transparent"),
              color: activeTab === "setup" ? "var(--text)" : "var(--text-muted)",
              fontWeight: activeTab === "setup" ? 600 : 500,
              fontSize: 12.5,
            }}
          >
            Extension Setup
          </button>
        </nav>
      </div>

      {/* Right Controls: Device Selector & User Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Device Switcher Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              borderRadius: 6,
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <Laptop size={14} style={{ color: "var(--accent)" }} />
            <span style={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeDevice ? activeDevice.name : "Device Selector"}
            </span>
            <ChevronDown size={13} style={{ color: "var(--text-muted)" }} />
          </button>

          {isDeviceMenuOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                marginTop: 6,
                width: 280,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
                zIndex: 100,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "8px 12px", borderBottom: "1px solid var(--border)", fontSize: 11, color: "var(--text-faint)", fontWeight: 600 }}>
                SELECT MONITORED DEVICE
              </div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {devices.map((dev) => (
                  <div
                    key={dev.id}
                    onClick={() => {
                      onSelectDevice(dev.id);
                      setIsDeviceMenuOpen(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      background: dev.id === activeDeviceId ? "var(--surface-raised)" : "transparent",
                      borderLeft: dev.id === activeDeviceId ? "3px solid var(--accent)" : "3px solid transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: dev.id === activeDeviceId ? 600 : 400, color: "var(--text)" }}>
                        {dev.name}
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--text-faint)" }}>
                        {dev.platform} • {dev.browser} •{" "}
                        {dev.inspected
                          ? `${dev.extensions?.length || 0} exts • Score: ${dev.deviceRiskScore ?? "—"}`
                          : "Pending Inspection"}
                      </div>
                    </div>
                    {dev.isCurrent && (
                      <span style={{ fontSize: 10, background: "var(--accent-bg)", color: "var(--accent-text)", padding: "1px 5px", borderRadius: 4 }}>
                        This PC
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ padding: "6px 12px", borderTop: "1px solid var(--border)", background: "var(--surface-raised)" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsDeviceMenuOpen(false);
                    onAddNewDevice();
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: "6px 0",
                    background: "transparent",
                    border: "1px dashed var(--border)",
                    borderRadius: 4,
                    color: "var(--accent-text)",
                    fontSize: 11.5,
                    fontWeight: 600,
                  }}
                >
                  <Plus size={13} /> Add New Device / Profile
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Auth Chip */}
        {currentUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "3px 10px 3px 4px",
                borderRadius: 999,
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
            >
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
                  fontSize: 10.5,
                  fontWeight: 700,
                }}
              >
                {currentUser.avatar || "SK"}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                  {currentUser.name}
                </span>
                <span style={{ fontSize: 9.5, color: "var(--text-faint)", lineHeight: 1 }}>
                  {currentUser.role}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: 6,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--text-muted)",
              }}
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 6,
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            <User size={13} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
