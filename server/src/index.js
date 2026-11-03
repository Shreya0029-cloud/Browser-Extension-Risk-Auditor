import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import healthRoute from "./routes/health.js";
import scanRoute from "./routes/scan.js";
import extensionsRoute from "./routes/extensions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../../extension/dist");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== "*" ? process.env.CORS_ORIGIN.split(",") : true,
  })
);
app.use(express.json({ limit: "2mb" }));

// Serve built extension frontend if available (for Render / Web deployment)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// API Routes
app.use("/api/health", healthRoute);
app.use("/api/scan", scanRoute);
app.use("/api/extensions", extensionsRoute);

// Auth Endpoints (JWT / Session Simulation)
app.post("/api/auth/login", (req, res) => {
  const { email } = req.body || {};
  res.json({
    token: "jwt_token_" + Date.now(),
    user: {
      id: "usr_23bce0058",
      name: "Shivam Kaushik",
      regNo: "23BCE0058",
      email: email || "shivamkaushik0618@gmail.com",
      role: "Lead Security Auditor",
      badge: "BCSE410L Review-I",
      avatar: "SK",
    },
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, role } = req.body || {};
  res.json({
    token: "jwt_token_" + Date.now(),
    user: {
      id: "usr_" + Date.now().toString(36),
      name: name || "Auditor",
      email: email || "auditor@sentinelaudit.io",
      role: role || "Lead Security Auditor",
      badge: "Enterprise SOC",
      avatar: (name || "AU").substring(0, 2).toUpperCase(),
    },
  });
});

app.get("/api/auth/me", (_req, res) => {
  res.json({
    user: {
      id: "usr_23bce0058",
      name: "Shivam Kaushik",
      regNo: "23BCE0058",
      email: "shivamkaushik0618@gmail.com",
      role: "Lead Security Auditor",
      badge: "BCSE410L Review-I",
      avatar: "SK",
    },
  });
});

// Web Pages (Options dashboard & Popup preview)
app.get("/dashboard*", (_req, res) => {
  const indexPath = path.join(distPath, "index.html");
  const optionsPath = path.join(distPath, "options.html");
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  if (fs.existsSync(optionsPath)) return res.sendFile(optionsPath);
  res.redirect("/");
});

app.get("/popup*", (_req, res) => {
  const popupPath = path.join(distPath, "popup.html");
  if (fs.existsSync(popupPath)) {
    return res.sendFile(popupPath);
  }
  res.redirect("/");
});

// Root / Catch-All: Serve SPA
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();

  const indexPath = path.join(distPath, "index.html");
  const optionsPath = path.join(distPath, "options.html");

  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  if (fs.existsSync(optionsPath)) return res.sendFile(optionsPath);

  res.json({
    name: "SentinelAudit • Browser Extension Risk Auditor API",
    status: "online",
    endpoints: [
      "GET /api/health",
      "POST /api/scan",
      "POST /api/scan/demo",
      "GET /api/extensions",
      "GET /api/extensions/:id/history",
      "POST /api/auth/login",
      "POST /api/auth/register",
    ],
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`SentinelAudit Server running on http://localhost:${PORT}`);
});
