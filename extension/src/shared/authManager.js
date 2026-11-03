// Authentication & Auditor Session Manager

const STORAGE_KEY_USER = "sentinel_auth_user";
const STORAGE_KEY_TOKEN = "sentinel_auth_token";

export const DEMO_USER = {
  id: "usr_23bce0058",
  name: "Shivam Kaushik",
  regNo: "23BCE0058",
  email: "shivamkaushik0618@gmail.com",
  role: "Lead Security Auditor",
  badge: "BCSE410L Review-I",
  avatar: "SK",
};

export function getCurrentUser() {
  if (typeof localStorage === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function loginUser(email, password) {
  // If demo credentials or requested
  if (email === "demo@sentinelaudit.io" || email === "shivamkaushik0618@gmail.com" || !password) {
    saveSession(DEMO_USER, "demo-jwt-token-23bce0058");
    return DEMO_USER;
  }

  const user = {
    id: "usr_" + Date.now().toString(36),
    name: email.split("@")[0],
    email,
    role: "SOC Security Analyst",
    badge: "Verified Auditor",
    avatar: email.substring(0, 2).toUpperCase(),
  };
  saveSession(user, "token-" + Date.now());
  return user;
}

export function registerUser(name, email, role = "Lead Security Auditor") {
  const user = {
    id: "usr_" + Date.now().toString(36),
    name: name.trim(),
    email: email.trim(),
    role: role || "Lead Security Auditor",
    badge: "Enterprise SOC",
    avatar: name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
  };
  saveSession(user, "token-" + Date.now());
  return user;
}

export function logoutUser() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_USER);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
}

function saveSession(user, token) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
}
