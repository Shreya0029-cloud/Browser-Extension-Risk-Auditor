import { getFallbackExtensions, getFallbackHistory, SAMPLE_EXTENSIONS } from "./sampleData.js";

// Thin wrapper around chrome.runtime messaging + direct backend fetches.
// Supports both Chrome Extension runtime and Standalone Web Dashboard / Live Demo.

export const isExtensionContext =
  typeof chrome !== "undefined" && Boolean(chrome.runtime?.sendMessage && chrome.runtime?.id);

export async function getApiBase() {
  // 1. If running as unpacked Chrome Extension
  if (isExtensionContext && chrome.storage?.local) {
    try {
      const { apiBase } = await chrome.storage.local.get("apiBase");
      if (apiBase) return apiBase;
    } catch {}
    return "http://localhost:4000";
  }

  // 2. If running in a web browser (Render, GitHub Pages, etc.)
  if (typeof window !== "undefined" && window.location) {
    const origin = window.location.origin;

    // Check localStorage, but IGNORE http:// localhost if page is on HTTPS
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem("apiBase");
      if (saved) {
        if (window.location.protocol === "https:" && saved.startsWith("http://")) {
          // Mixed Content block: browser blocks http:// from https:// origin
        } else {
          return saved;
        }
      }
    }

    // Default to the current origin if on a web domain (e.g. Render)
    if (origin && !origin.startsWith("chrome-extension://") && !origin.includes("github.io")) {
      return origin;
    }
  }

  return "http://localhost:4000";
}

export async function setApiBase(apiBase) {
  if (isExtensionContext && chrome.storage?.local) {
    await chrome.storage.local.set({ apiBase });
    try {
      await sendMessage({ type: "SET_API_BASE", apiBase });
    } catch {}
  } else if (typeof localStorage !== "undefined") {
    localStorage.setItem("apiBase", apiBase);
  }
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    if (!isExtensionContext) {
      resolve({ ok: true, data: null });
      return;
    }
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      resolve(response);
    });
  });
}

/** In-memory client cache for web demo mode */
let webDemoExtensions = null;

/** Ask the background worker to run a fresh scan, or simulate a live scan in web demo mode. */
export async function scanNow() {
  if (isExtensionContext) {
    const res = await sendMessage({ type: "SCAN_NOW" });
    if (!res?.ok) throw new Error(res?.error || "Scan failed");
    return res.data;
  }

  // Standalone web demo mode: attempt API scan first, fall back to dynamic simulation
  try {
    const apiBase = await getApiBase();
    if (!apiBase.includes("localhost") || window.location.hostname === "localhost") {
      const res = await fetch(`${apiBase}/api/scan/demo`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    }
  } catch {}

  // Client-side simulation of a scan
  if (!webDemoExtensions) {
    webDemoExtensions = getFallbackExtensions();
  } else {
    // Dynamically update scores slightly on each rescan to demonstrate active monitoring
    webDemoExtensions = webDemoExtensions.map((ext) => {
      const delta = Math.floor(Math.random() * 5) - 2;
      const newScore = Math.min(100, Math.max(10, ext.compositeScore + delta));
      return {
        ...ext,
        compositeScore: newScore,
        checkedAt: new Date().toISOString(),
        previous: {
          compositeScore: ext.compositeScore,
          riskLabel: ext.riskLabel,
          checkedAt: ext.checkedAt,
          delta,
        },
      };
    });
  }
  return { demo: true, results: webDemoExtensions };
}

/** Read the last cached scan result out of chrome.storage.local. */
export async function getLatest() {
  if (isExtensionContext && chrome.storage?.local) {
    const res = await sendMessage({ type: "GET_LATEST" });
    if (!res?.ok) throw new Error(res?.error || "Failed to read cached results");
    return { data: res.data, error: res.error };
  }
  return { data: webDemoExtensions || getFallbackExtensions(), error: null };
}

/** Direct read of the ranked extension list with seamless fallback */
export async function fetchExtensions() {
  try {
    const apiBase = await getApiBase();
    // In web mode on HTTPS or GitHub Pages, don't attempt unreachable localhost
    const shouldFetch =
      !apiBase.includes("localhost") ||
      (typeof window !== "undefined" && window.location.hostname === "localhost");

    if (shouldFetch) {
      const res = await fetch(`${apiBase}/api/extensions`);
      if (res.ok) {
        const data = await res.json();
        const validExtensions = (data.extensions || []).filter(
          (e) => e && e.extensionId && e.name
        );
        if (validExtensions.length > 0) {
          return { extensions: validExtensions, count: validExtensions.length };
        }
      }
    }
  } catch (err) {
    console.warn("Backend API unavailable, using resilient fallback data:", err.message);
  }

  // Graceful fallback to pre-scored sample extensions
  if (!webDemoExtensions) {
    webDemoExtensions = getFallbackExtensions();
  }
  return { extensions: webDemoExtensions, count: webDemoExtensions.length, isFallback: true };
}

export async function fetchHistory(extensionId) {
  try {
    const apiBase = await getApiBase();
    const shouldFetch =
      !apiBase.includes("localhost") ||
      (typeof window !== "undefined" && window.location.hostname === "localhost");

    if (shouldFetch) {
      const res = await fetch(`${apiBase}/api/extensions/${encodeURIComponent(extensionId)}/history`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.history) && data.history.length > 0) {
          return data;
        }
      }
    }
  } catch (err) {
    console.warn("Backend history unavailable, using fallback:", err.message);
  }

  return { extensionId, history: getFallbackHistory(extensionId) };
}

export const DEFAULT_API_BASE = "http://localhost:4000";
