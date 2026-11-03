import { useState } from "react";
import { X, ShieldCheck, Zap, Mail, Lock, User, Briefcase } from "lucide-react";
import { loginUser, registerUser, DEMO_USER } from "../../shared/authManager.js";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("signin"); // signin | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Lead Security Auditor");
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleDemoLogin = () => {
    const user = loginUser(DEMO_USER.email, "demo");
    onAuthSuccess(user);
    onClose();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }
    const user = loginUser(email.trim(), password);
    onAuthSuccess(user);
    onClose();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill out all required fields.");
      return;
    }
    const user = registerUser(name.trim(), email.trim(), role);
    onAuthSuccess(user);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(6px)",
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
          maxWidth: 440,
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
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
            <ShieldCheck size={20} style={{ color: "var(--accent)" }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>Auditor Authentication</span>
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

        {/* Tab switch */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)" }}>
          <button
            type="button"
            onClick={() => { setTab("signin"); setError(null); }}
            style={{
              flex: 1,
              padding: "12px 0",
              background: tab === "signin" ? "transparent" : "rgba(0,0,0,0.2)",
              border: "none",
              borderBottom: tab === "signin" ? "2px solid var(--accent)" : "none",
              color: tab === "signin" ? "var(--text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab("register"); setError(null); }}
            style={{
              flex: 1,
              padding: "12px 0",
              background: tab === "register" ? "transparent" : "rgba(0,0,0,0.2)",
              border: "none",
              borderBottom: tab === "register" ? "2px solid var(--accent)" : "none",
              color: tab === "register" ? "var(--text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Create Account
          </button>
        </div>

        <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Quick Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 8,
              background: "rgba(91, 141, 239, 0.15)",
              border: "1px solid var(--accent)",
              color: "var(--accent-text)",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <Zap size={16} style={{ color: "#60a5fa" }} />
            <span>⚡ 1-Click Demo Login (Shivam Kaushik - 23BCE0058)</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-faint)", fontSize: 11 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span>OR ENTER CREDENTIALS</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          {error && (
            <div
              style={{
                padding: "8px 12px",
                borderRadius: 6,
                background: "var(--risk-high-bg)",
                border: "1px solid var(--risk-high)",
                color: "var(--risk-high)",
                fontSize: 12,
              }}
            >
              {error}
            </div>
          )}

          {tab === "signin" ? (
            <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Auditor Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
                  <input
                    type="email"
                    required
                    placeholder="auditor@sentinelaudit.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: "10px",
                  borderRadius: 6,
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Sign In to Security Console
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
                  <input
                    type="text"
                    required
                    placeholder="Shivam Kaushik"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
                  <input
                    type="email"
                    required
                    placeholder="shivam@vit.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                  Auditor Role
                </label>
                <div style={{ position: "relative" }}>
                  <Briefcase size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      borderRadius: 6,
                      border: "1px solid var(--border)",
                      background: "var(--surface-raised)",
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  >
                    <option value="Lead Security Auditor">Lead Security Auditor</option>
                    <option value="SOC Analyst">SOC Analyst</option>
                    <option value="Enterprise IT SecOps">Enterprise IT SecOps</option>
                    <option value="Academic Researcher">Academic Researcher (BCSE410L)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 6,
                  padding: "10px",
                  borderRadius: 6,
                  border: "none",
                  background: "var(--accent)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Create Auditor Profile
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
