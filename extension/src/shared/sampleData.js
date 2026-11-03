const now = Date.now();
const hour = 3600 * 1000;

export const SAMPLE_EXTENSIONS = [
  {
    extensionId: "free-vpn-proxy-unblocker",
    name: "Fast VPN & Free Web Proxy",
    version: "2.1.4",
    installType: "sideload",
    enabled: true,
    permissions: ["proxy", "webRequest", "webRequestBlocking", "storage", "management", "cookies"],
    hostPermissions: ["<all_urls>"],
    observedDomains: ["api.speedvpn.net", "telemetry-exfil.biz", "ad-tracker-cdn.xyz", "shadow-beacon.io"],
    unfamiliarDomains: ["telemetry-exfil.biz", "ad-tracker-cdn.xyz", "shadow-beacon.io"],
    permissionScore: 85,
    runtimeAdjustment: 15,
    compositeScore: 100,
    riskLabel: "High",
    reasons: [
      "Silent update added 'cookies' permission",
      "Full network traffic interception capability (webRequestBlocking, proxy)",
      "Unrestricted access to all websites (<all_urls>)",
      "Contacted 3 unfamiliar tracker/exfiltration domains during runtime",
    ],
    scoreBreakdown: [
      { key: "proxy", weight: 10, type: "permission" },
      { key: "webRequestBlocking", weight: 10, type: "permission" },
      { key: "management", weight: 8, type: "permission" },
      { key: "cookies", weight: 7, type: "permission" },
      { key: "webRequest", weight: 7, type: "permission" },
      { key: "<all_urls>", weight: 10, type: "host_permission" },
    ],
    checkedAt: new Date(now - 1 * hour).toISOString(),
    previous: {
      compositeScore: 92,
      riskLabel: "High",
      checkedAt: new Date(now - 12 * hour).toISOString(),
      delta: 8,
    },
  },
  {
    extensionId: "smart-coupon-cashback",
    name: "Smart Coupon & CashBack Finder",
    version: "3.2.1",
    installType: "normal",
    enabled: true,
    permissions: ["tabs", "scripting", "storage", "cookies"],
    hostPermissions: ["*://*.amazon.com/*", "*://*.walmart.com/*", "*://*.ebay.com/*"],
    observedDomains: ["analytics.coupons.io", "affiliate-cdn.net"],
    unfamiliarDomains: ["analytics.coupons.io"],
    permissionScore: 48,
    runtimeAdjustment: 5,
    compositeScore: 53,
    riskLabel: "Medium",
    reasons: [
      "Injects scripts into e-commerce store tabs",
      "Access to sensitive store cookies",
      "Contacted 1 unfamiliar third-party affiliate analytics domain",
    ],
    scoreBreakdown: [
      { key: "cookies", weight: 7, type: "permission" },
      { key: "scripting", weight: 6, type: "permission" },
      { key: "tabs", weight: 4, type: "permission" },
      { key: "storage", weight: 1, type: "permission" },
    ],
    checkedAt: new Date(now - 2 * hour).toISOString(),
    previous: {
      compositeScore: 53,
      riskLabel: "Medium",
      checkedAt: new Date(now - 18 * hour).toISOString(),
      delta: 0,
    },
  },
  {
    extensionId: "fmkadmapgofadopljbjfkapdkoienihi",
    name: "React Developer Tools",
    version: "5.3.1",
    installType: "normal",
    enabled: true,
    permissions: ["contextMenus"],
    hostPermissions: ["<all_urls>"],
    observedDomains: [],
    unfamiliarDomains: [],
    permissionScore: 35,
    runtimeAdjustment: 0,
    compositeScore: 35,
    riskLabel: "Low",
    reasons: ["Standard browser developer inspection tool", "No suspicious background network traffic"],
    scoreBreakdown: [
      { key: "<all_urls>", weight: 10, type: "host_permission" },
      { key: "contextMenus", weight: 1, type: "permission" },
    ],
    checkedAt: new Date(now - 5 * hour).toISOString(),
  },
  {
    extensionId: "ghbmnnjldmimeamjdobjflkkfdambia",
    name: "Google Docs Offline",
    version: "1.61.5",
    installType: "normal",
    enabled: true,
    permissions: ["storage", "alarms", "unlimitedStorage"],
    hostPermissions: [],
    observedDomains: ["docs.google.com", "drive.google.com"],
    unfamiliarDomains: [],
    permissionScore: 18,
    runtimeAdjustment: 0,
    compositeScore: 18,
    riskLabel: "Low",
    reasons: [
      "Low blast-radius declared permissions (storage, alarms)",
      "All network traffic is benign first-party infra",
    ],
    scoreBreakdown: [
      { key: "unlimitedStorage", weight: 2, type: "permission" },
      { key: "storage", weight: 1, type: "permission" },
      { key: "alarms", weight: 1, type: "permission" },
    ],
    checkedAt: new Date(now - 24 * hour).toISOString(),
  },
];

export function getFallbackExtensions() {
  return JSON.parse(JSON.stringify(SAMPLE_EXTENSIONS));
}

export function getFallbackHistory(extensionId) {
  const ext = SAMPLE_EXTENSIONS.find((e) => e.extensionId === extensionId);
  if (!ext) return [];

  const history = [
    {
      ...ext,
      compositeScore: Math.max(0, ext.compositeScore - (ext.previous?.delta || 0)),
      checkedAt: ext.previous?.checkedAt || new Date(now - 24 * hour).toISOString(),
    },
    {
      ...ext,
      checkedAt: ext.checkedAt,
    },
  ];
  return history;
}
