import { useEffect, useState, useCallback } from "react";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./components/LandingPage.jsx";
import DashboardView from "./components/DashboardView.jsx";
import SimulatorView from "./components/SimulatorView.jsx";
import SetupGuideView from "./components/SetupGuideView.jsx";
import AuthModal from "./components/AuthModal.jsx";
import AuditModal from "./components/AuditModal.jsx";
import NewDeviceModal from "./components/NewDeviceModal.jsx";
import InstallGuideModal from "./components/InstallGuideModal.jsx";

import {
  getDevices,
  getActiveDeviceId,
  setActiveDeviceId,
  saveActiveDeviceExtensions,
  inspectDevice,
  resetDevice,
} from "../shared/deviceManager.js";
import { getCurrentUser, logoutUser } from "../shared/authManager.js";
import { scanNow, getApiBase, setApiBase, isExtensionContext } from "../shared/api.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard"); // landing | dashboard | simulator | setup
  const [devices, setDevices] = useState([]);
  const [activeDeviceId, setActiveDeviceIdState] = useState("device-current");
  const [currentUser, setCurrentUser] = useState(null);

  const [selectedExtensionId, setSelectedExtensionId] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiBaseInput, setApiBaseInput] = useState("");

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditModalPrefill, setAuditModalPrefill] = useState(null);
  const [isNewDeviceModalOpen, setIsNewDeviceModalOpen] = useState(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Initialize on Mount
  useEffect(() => {
    const loadedDevices = getDevices();
    setDevices(loadedDevices);
    const activeId = getActiveDeviceId();
    setActiveDeviceIdState(activeId);

    const user = getCurrentUser();
    if (user) setCurrentUser(user);

    getApiBase().then(setApiBaseInput);

    // Initial selected extension
    const currentDev = loadedDevices.find((d) => d.id === activeId) || loadedDevices[0];
    if (currentDev && currentDev.extensions?.length > 0) {
      setSelectedExtensionId(currentDev.extensions[0].extensionId);
    }
  }, []);

  const activeDevice = devices.find((d) => d.id === activeDeviceId) || devices[0];
  const extensions = activeDevice?.extensions || [];

  // Switch Active Device
  const handleSelectDevice = (id) => {
    setActiveDeviceId(id);
    setActiveDeviceIdState(id);
    const target = devices.find((d) => d.id === id);
    if (target && target.extensions?.length > 0) {
      setSelectedExtensionId(target.extensions[0].extensionId);
    } else {
      setSelectedExtensionId(null);
    }
  };

  // Create New Device
  const handleDeviceCreated = (newDev) => {
    const updated = getDevices();
    setDevices(updated);
    setActiveDeviceIdState(newDev.id);
    setSelectedExtensionId(null);
  };

  // Add / Audit Extension on Active Device
  const handleAddExtension = (newExt) => {
    const updatedExts = [newExt, ...extensions];
    saveActiveDeviceExtensions(updatedExts);
    setDevices(getDevices());
    setSelectedExtensionId(newExt.extensionId);
  };

  // Inspect / Scan Active Device
  const handleScanDevice = async (options = {}) => {
    setScanning(true);
    try {
      // Small simulated delay for real-time inspection feedback
      await new Promise((r) => setTimeout(r, 900));
      const updatedDev = await inspectDevice(activeDeviceId, options);
      const allDevices = getDevices();
      setDevices(allDevices);
      if (updatedDev.extensions?.length > 0) {
        setSelectedExtensionId(updatedDev.extensions[0].extensionId);
      }
    } catch (err) {
      console.warn("Scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  // Reset Active Device to Uninspected State
  const handleResetDevice = () => {
    resetDevice(activeDeviceId);
    const allDevices = getDevices();
    setDevices(allDevices);
    setSelectedExtensionId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        devices={devices}
        activeDeviceId={activeDeviceId}
        onSelectDevice={handleSelectDevice}
        onAddNewDevice={() => setIsNewDeviceModalOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          logoutUser();
          setCurrentUser(null);
        }}
        isExtensionContext={isExtensionContext}
      />

      {/* Main Views */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        {activeTab === "landing" && (
          <LandingPage
            onGoToDashboard={() => setActiveTab("dashboard")}
            onGoToSimulator={() => setActiveTab("simulator")}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === "dashboard" && (
          <DashboardView
            devices={devices}
            activeDeviceId={activeDeviceId}
            activeDevice={activeDevice}
            extensions={extensions}
            selectedId={selectedExtensionId}
            onSelectExtension={setSelectedExtensionId}
            onOpenAuditModal={(prefill) => {
              setAuditModalPrefill(prefill || null);
              setIsAuditModalOpen(true);
            }}
            onOpenSettings={() => setShowSettings((v) => !v)}
            onScanDevice={handleScanDevice}
            onResetDevice={handleResetDevice}
            scanning={scanning}
            isExtensionContext={isExtensionContext}
            onOpenSetupGuide={() => setActiveTab("setup")}
          />
        )}

        {activeTab === "simulator" && (
          <SimulatorView
            onSaveExtensionToDevice={(ext) => {
              handleAddExtension(ext);
              setActiveTab("dashboard");
            }}
          />
        )}

        {activeTab === "setup" && (
          <SetupGuideView onGoToDashboard={() => setActiveTab("dashboard")} />
        )}

        {/* Backend API Settings Drawer */}
        {showSettings && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 360,
              background: "var(--surface)",
              borderLeft: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
              boxShadow: "-10px 10px 30px rgba(0,0,0,0.5)",
              padding: 20,
              zIndex: 90,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Backend API Configuration</span>
              <button
                onClick={() => setShowSettings(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Endpoint where Chrome extension syncs real scans or where Docker / PostgreSQL scores extensions.
            </div>
            <input
              value={apiBaseInput}
              onChange={(e) => setApiBaseInput(e.target.value)}
              placeholder="http://localhost:4000 or Render URL"
              style={{
                width: "100%",
                padding: "8px 10px",
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text)",
                fontSize: 12,
              }}
              className="mono"
            />
            <button
              onClick={async () => {
                await setApiBase(apiBaseInput);
                setShowSettings(false);
              }}
              style={{
                padding: "8px 14px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 12,
              }}
            >
              Save Backend API URL
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => {
          setIsAuditModalOpen(false);
          setAuditModalPrefill(null);
        }}
        onAddExtension={handleAddExtension}
        prefill={auditModalPrefill}
      />

      <NewDeviceModal
        isOpen={isNewDeviceModalOpen}
        onClose={() => setIsNewDeviceModalOpen(false)}
        onDeviceCreated={handleDeviceCreated}
      />

      <InstallGuideModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
    </div>
  );
}
