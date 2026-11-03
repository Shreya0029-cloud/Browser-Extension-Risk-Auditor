import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Detect PostgreSQL connection configuration
const hasPgConfig = Boolean(process.env.DATABASE_URL || process.env.PGHOST);

const connectionConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl:
        !process.env.DATABASE_URL.includes("localhost") && !process.env.DATABASE_URL.includes("127.0.0.1")
          ? { rejectUnauthorized: false }
          : false,
    }
  : {
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || "auditor",
      password: process.env.PGPASSWORD || "auditor",
      database: process.env.PGDATABASE || "extension_risk_auditor",
    };

// Real PG pool
const pgPool = hasPgConfig ? new Pool(connectionConfig) : null;
let pgConnected = false;

if (pgPool) {
  pgPool.on("error", (err) => {
    console.warn("[PostgreSQL] Client warning:", err.message);
  });
}

// -------------------------------------------------------------
// In-Memory Database Fallback with Pre-Seeded Realistic Scans
// -------------------------------------------------------------
const now = Date.now();
const hour = 3600 * 1000;

let memoryIdCounter = 10;
const memoryStore = [
  // 1. High Risk Extension
  {
    id: 1,
    extension_id: "free-vpn-proxy-unblocker",
    name: "Fast VPN & Free Web Proxy",
    version: "2.1.0",
    install_type: "sideload",
    enabled: true,
    permissions: ["proxy", "webRequest", "webRequestBlocking", "storage", "management"],
    host_permissions: ["<all_urls>"],
    observed_domains: ["api.speedvpn.net", "telemetry-exfil.biz", "ad-tracker-cdn.xyz"],
    unfamiliar_domains: ["telemetry-exfil.biz", "ad-tracker-cdn.xyz"],
    permission_score: 82.0,
    runtime_adjustment: 10.0,
    composite_score: 92.0,
    risk_label: "High",
    reasons: [
      "Can intercept, modify or block all network requests (webRequestBlocking, proxy)",
      "Unrestricted access to all websites (<all_urls>)",
      "Contacted 2 unfamiliar telemetry/tracker domains during runtime",
    ],
    score_breakdown: [
      { key: "proxy", weight: 10, type: "permission" },
      { key: "webRequestBlocking", weight: 10, type: "permission" },
      { key: "management", weight: 8, type: "permission" },
      { key: "webRequest", weight: 7, type: "permission" },
      { key: "storage", weight: 1, type: "permission" },
      { key: "<all_urls>", weight: 10, type: "host_permission" },
    ],
    checked_at: new Date(now - 12 * hour).toISOString(),
  },
  {
    id: 2,
    extension_id: "free-vpn-proxy-unblocker",
    name: "Fast VPN & Free Web Proxy",
    version: "2.1.4",
    install_type: "sideload",
    enabled: true,
    permissions: ["proxy", "webRequest", "webRequestBlocking", "storage", "management", "cookies"],
    host_permissions: ["<all_urls>"],
    observed_domains: ["api.speedvpn.net", "telemetry-exfil.biz", "ad-tracker-cdn.xyz", "shadow-beacon.io"],
    unfamiliar_domains: ["telemetry-exfil.biz", "ad-tracker-cdn.xyz", "shadow-beacon.io"],
    permission_score: 85.0,
    runtime_adjustment: 15.0,
    composite_score: 100.0,
    risk_label: "High",
    reasons: [
      "Silent update added 'cookies' permission",
      "Full network traffic interception capability",
      "Unrestricted access to all websites (<all_urls>)",
      "Contacted 3 unfamiliar tracker domains",
    ],
    score_breakdown: [
      { key: "proxy", weight: 10, type: "permission" },
      { key: "webRequestBlocking", weight: 10, type: "permission" },
      { key: "cookies", weight: 7, type: "permission" },
      { key: "management", weight: 8, type: "permission" },
      { key: "webRequest", weight: 7, type: "permission" },
      { key: "<all_urls>", weight: 10, type: "host_permission" },
    ],
    checked_at: new Date(now - 1 * hour).toISOString(),
  },

  // 2. Medium Risk Extension
  {
    id: 3,
    extension_id: "smart-coupon-cashback",
    name: "Smart Coupon & CashBack Finder",
    version: "3.2.0",
    install_type: "normal",
    enabled: true,
    permissions: ["tabs", "scripting", "storage", "cookies"],
    host_permissions: ["*://*.amazon.com/*", "*://*.walmart.com/*", "*://*.ebay.com/*"],
    observed_domains: ["analytics.coupons.io", "affiliate-cdn.net"],
    unfamiliar_domains: ["analytics.coupons.io"],
    permission_score: 48.0,
    runtime_adjustment: 5.0,
    composite_score: 53.0,
    risk_label: "Medium",
    reasons: [
      "Injects scripts into e-commerce store tabs",
      "Access to sensitive store cookies",
      "Contacted 1 unfamiliar third-party affiliate analytics domain",
    ],
    score_breakdown: [
      { key: "cookies", weight: 7, type: "permission" },
      { key: "scripting", weight: 6, type: "permission" },
      { key: "tabs", weight: 4, type: "permission" },
      { key: "storage", weight: 1, type: "permission" },
    ],
    checked_at: new Date(now - 18 * hour).toISOString(),
  },
  {
    id: 4,
    extension_id: "smart-coupon-cashback",
    name: "Smart Coupon & CashBack Finder",
    version: "3.2.1",
    install_type: "normal",
    enabled: true,
    permissions: ["tabs", "scripting", "storage", "cookies"],
    host_permissions: ["*://*.amazon.com/*", "*://*.walmart.com/*", "*://*.ebay.com/*"],
    observed_domains: ["analytics.coupons.io", "affiliate-cdn.net"],
    unfamiliar_domains: ["analytics.coupons.io"],
    permission_score: 48.0,
    runtime_adjustment: 5.0,
    composite_score: 53.0,
    risk_label: "Medium",
    reasons: [
      "Injects scripts into shopping checkouts",
      "Access to browser cookies",
    ],
    score_breakdown: [
      { key: "cookies", weight: 7, type: "permission" },
      { key: "scripting", weight: 6, type: "permission" },
      { key: "tabs", weight: 4, type: "permission" },
    ],
    checked_at: new Date(now - 2 * hour).toISOString(),
  },

  // 3. Low Risk Extension
  {
    id: 5,
    extension_id: "ghbmnnjldmimeamjdobjflkkfdambia",
    name: "Google Docs Offline",
    version: "1.61.4",
    install_type: "normal",
    enabled: true,
    permissions: ["storage", "alarms", "unlimitedStorage"],
    host_permissions: [],
    observed_domains: ["docs.google.com", "drive.google.com"],
    unfamiliar_domains: [],
    permission_score: 18.0,
    runtime_adjustment: 0.0,
    composite_score: 18.0,
    risk_label: "Low",
    reasons: ["Low blast-radius declared permissions (storage, alarms)", "All network traffic is benign first-party infra"],
    score_breakdown: [
      { key: "unlimitedStorage", weight: 2, type: "permission" },
      { key: "storage", weight: 1, type: "permission" },
      { key: "alarms", weight: 1, type: "permission" },
    ],
    checked_at: new Date(now - 24 * hour).toISOString(),
  },

  // 4. Low Risk Developer Tool
  {
    id: 6,
    extension_id: "fmkadmapgofadopljbjfkapdkoienihi",
    name: "React Developer Tools",
    version: "5.3.1",
    install_type: "normal",
    enabled: true,
    permissions: ["contextMenus"],
    host_permissions: ["<all_urls>"],
    observed_domains: [],
    unfamiliar_domains: [],
    permission_score: 35.0,
    runtime_adjustment: 0.0,
    composite_score: 35.0,
    risk_label: "Low",
    reasons: ["Standard browser developer inspection tool"],
    score_breakdown: [
      { key: "<all_urls>", weight: 10, type: "host_permission" },
      { key: "contextMenus", weight: 1, type: "permission" },
    ],
    checked_at: new Date(now - 5 * hour).toISOString(),
  },
];

// Helper to normalize rows matching PostgreSQL serialized format
function formatRow(r) {
  return {
    ...r,
    permissions: typeof r.permissions === "string" ? JSON.parse(r.permissions) : r.permissions,
    host_permissions: typeof r.host_permissions === "string" ? JSON.parse(r.host_permissions) : r.host_permissions,
    observed_domains: typeof r.observed_domains === "string" ? JSON.parse(r.observed_domains) : r.observed_domains,
    unfamiliar_domains:
      typeof r.unfamiliar_domains === "string" ? JSON.parse(r.unfamiliar_domains) : r.unfamiliar_domains,
    reasons: typeof r.reasons === "string" ? JSON.parse(r.reasons) : r.reasons,
    score_breakdown: typeof r.score_breakdown === "string" ? JSON.parse(r.score_breakdown) : r.score_breakdown,
  };
}

// Memory database query emulator
async function runMemoryQuery(text, params = []) {
  const q = text.trim();

  // 1. SELECT 1 (health check)
  if (q.startsWith("SELECT 1")) {
    return { rows: [{ "?column?": 1 }] };
  }

  // 2. GET /api/extensions (DISTINCT ON extension_id)
  if (q.includes("DISTINCT ON (extension_id)")) {
    const latestMap = new Map();
    // Sort oldest first, so overwriting leaves newest
    const sorted = [...memoryStore].sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at));
    for (const r of sorted) {
      latestMap.set(r.extension_id, formatRow(r));
    }
    const rows = Array.from(latestMap.values());
    return { rows };
  }

  // 3. GET /api/extensions/:id/history
  if (q.includes("FROM extension_risk_history WHERE extension_id = $1 ORDER BY checked_at ASC")) {
    const extId = params[0];
    const rows = memoryStore
      .filter((r) => r.extension_id === extId)
      .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at))
      .map(formatRow);
    return { rows };
  }

  // 4. Previous score lookup in scan.js
  if (q.includes("SELECT composite_score, risk_label, checked_at") && q.includes("WHERE extension_id = $1")) {
    const extId = params[0];
    const matching = memoryStore
      .filter((r) => r.extension_id === extId)
      .sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at));
    return { rows: matching.slice(0, 1) };
  }

  // 5. INSERT in scan.js
  if (q.startsWith("INSERT INTO extension_risk_history")) {
    const [
      extension_id,
      name,
      version,
      install_type,
      enabled,
      permissions,
      host_permissions,
      observed_domains,
      unfamiliar_domains,
      permission_score,
      runtime_adjustment,
      composite_score,
      risk_label,
      reasons,
      score_breakdown,
    ] = params;

    const newRow = {
      id: ++memoryIdCounter,
      extension_id,
      name,
      version,
      install_type,
      enabled,
      permissions,
      host_permissions,
      observed_domains,
      unfamiliar_domains,
      permission_score,
      runtime_adjustment,
      composite_score,
      risk_label,
      reasons,
      score_breakdown,
      checked_at: new Date().toISOString(),
    };
    memoryStore.push(newRow);
    return { rows: [{ id: newRow.id, checked_at: newRow.checked_at }] };
  }

  // Fallback for simple queries
  return { rows: [] };
}

// Unified pool proxy
export const pool = {
  async query(text, params) {
    if (pgConnected && pgPool) {
      try {
        return await pgPool.query(text, params);
      } catch (err) {
        console.warn("[PostgreSQL] Query failed, falling back to in-memory store:", err.message);
      }
    }
    return runMemoryQuery(text, params);
  },

  async connect() {
    if (pgConnected && pgPool) {
      try {
        const client = await pgPool.connect();
        return client;
      } catch (err) {
        console.warn("[PostgreSQL] Connection failed, using in-memory mock client:", err.message);
      }
    }
    // Return mock client for memory store
    return {
      async query(text, params) {
        return runMemoryQuery(text, params);
      },
      release() {},
    };
  },
};

export async function query(text, params) {
  return pool.query(text, params);
}

// Try connecting to PostgreSQL on startup if configured
if (pgPool) {
  pgPool
    .query("SELECT 1")
    .then(async () => {
      pgConnected = true;
      console.log("[db] Connected to PostgreSQL successfully.");
    })
    .catch((err) => {
      console.log(`[db] PostgreSQL not reachable (${err.message}). Using built-in resilient in-memory database.`);
    });
} else {
  console.log("[db] No PostgreSQL configured. Using built-in resilient in-memory database.");
}

export { memoryStore };
