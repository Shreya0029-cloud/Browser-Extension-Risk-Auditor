🛡️ Browser Extension Risk Auditor

<p align="center">
  <strong>Intelligent Browser Extension Security & Permission Risk Analysis Platform</strong>
</p>

<p align="center">
  <a href="https://browser-extension-risk-auditor.onrender.com/">🌐 Live Demo</a> •
  <a href="https://github.com/Shreya0029-cloud/Browser-Extension-Risk-Auditor">💻 GitHub Repository</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Google%20Chrome-blue?logo=googlechrome" />
  <img src="https://img.shields.io/badge/Manifest-V3-green" />
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs" />
  <img src="https://img.shields.io/badge/API-Express-black?logo=express" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql" />
</p>

🚀 Live Application

Live Interactive Dashboard:
https://browser-extension-risk-auditor.onrender.com/

Source Code:
https://github.com/Shreya0029-cloud/Browser-Extension-Risk-Auditor

The application analyzes browser extension permissions, evaluates potential security risks, and provides risk assessments to help users understand the security implications of their installed extensions.

📌 Project Overview

Browser extensions enhance productivity and browser functionality, but they can also introduce security and privacy risks through excessive permissions, potentially suspicious behavior, and access to sensitive browser resources.

The Browser Extension Risk Auditor is a full-stack security assessment platform designed to identify and evaluate these risks.

Built using a Chrome Manifest V3 extension, React, Node.js, Express, and PostgreSQL, the system combines permission-based analysis with runtime network observations to generate a composite risk score for browser extensions.

The platform also maintains historical scan information to help identify changes in extension permissions and risk levels over time.

🎯 Key Objectives

Identify installed browser extensions and their declared permissions.

Evaluate permission-based security risks using a weighted scoring engine.

Observe eligible runtime network activity.

Generate composite risk scores with understandable explanations.

Maintain historical scan records.

Highlight changes that may indicate increased extension risk.

✨ Key Features

1. Browser Extension Inspection

Detect installed browser extensions using Chrome Management APIs.

Retrieve extension metadata and declared permissions.

Inspect host permissions and permission combinations.

Present extension information through an intuitive interface.

2. Intelligent Risk Scoring Engine

Assign weighted values to browser permissions.

Evaluate potentially excessive permission requests.

Calculate normalized permission risk scores.

Incorporate eligible runtime network observations.

Generate composite risk scores between 0 and 100.

3. Runtime Network Monitoring

Observe eligible network requests using Chrome WebRequest APIs.

Identify distinct domains contacted by extension contexts.

Apply runtime risk adjustments based on observed activity.

Combine static permission analysis with runtime signals.

4. Security Dashboard

View installed extensions and their risk levels.

Explore permission-based risk assessments.

Understand score breakdowns.

Identify extensions requiring additional attention.

5. Historical Risk Tracking

Store scan results with timestamps.

Maintain extension risk history.

Compare current and previous assessments.

Help identify potential permission changes after extension updates.

6. Backend API and Database

RESTful API built using Node.js and Express.

PostgreSQL integration for persistent scan history.

Database migration support.

Health-check endpoint.

Modular backend architecture.

🏗️ System Architecture

The platform follows a modular architecture consisting of a Chrome extension, React-based interface, Express backend, scoring engine, and PostgreSQL database.

                  BROWSER EXTENSION
                         |
                         |
              Chrome Management API
              Chrome WebRequest API
              Chrome Alarms API
                         |
                         |
                  Extension Layer
                         |
                  React + Vite UI
                         |
                         |
                   REST API
                         |
                  Node.js + Express
                         |
                         |
                  Risk Scoring Engine
                         |
              Permission Risk Analysis
              Runtime Risk Adjustment
              Composite Risk Calculation
                         |
                         |
                    PostgreSQL
                         |
                Historical Scan Data
                         |
                         |
                  Security Dashboard

Architecture Components

Component

Responsibility

Chrome Extension

Collects extension metadata and eligible runtime signals

React + Vite

Provides the popup and dashboard interface

Express API

Handles requests and scan processing

Risk Scoring Engine

Calculates permission and composite risk scores

PostgreSQL

Stores historical risk assessments

Chrome Alarms

Supports periodic re-evaluation

🛠️ Technology Stack

Frontend

React.js

JavaScript

Vite

HTML5

CSS3

Browser Extension

Chrome Extensions API

Manifest V3

Chrome Management API

Chrome WebRequest API

Chrome Storage API

Chrome Alarms API

Backend

Node.js

Express.js

REST APIs

Database

PostgreSQL

SQL

Database migrations

Development and Deployment

Git and GitHub

Docker Compose

Render

GitHub Actions

📂 Project Structure

Browser-Extension-Risk-Auditor/
│
├── .github/
│   └── workflows/
│
├── extension/
│   ├── manifest.json
│   ├── src/
│   │   ├── background.js
│   │   ├── popup/
│   │   ├── options/
│   │   └── shared/
│   ├── vite.config.js
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── scoring/
│   │   │   ├── weights.js
│   │   │   ├── scoreEngine.js
│   │   │   └── scoreEngine.test.js
│   │   │
│   │   ├── routes/
│   │   │   ├── scan.js
│   │   │   ├── extensions.js
│   │   │   └── health.js
│   │   │
│   │   ├── db/
│   │   │   └── schema.sql
│   │   │
│   │   ├── db.js
│   │   ├── migrate.js
│   │   └── index.js
│   │
│   └── package.json
│
├── docker-compose.yml
├── package.json
├── render.yaml
├── .gitignore
└── README.md

⚙️ Installation and Setup

Follow these instructions to run the project locally.

Prerequisites

Make sure you have installed:

Node.js (LTS recommended)

npm

Google Chrome

Docker Desktop (optional, for local PostgreSQL)

Git

1. Clone the Repository

git clone https://github.com/Shreya0029-cloud/Browser-Extension-Risk-Auditor.git

cd Browser-Extension-Risk-Auditor

2. Configure the Database

You can use Docker Compose to start the PostgreSQL service:

docker compose up -d

Alternatively, configure an existing PostgreSQL database through the backend environment variables.

3. Configure and Start the Backend

cd server
npm install

Create your environment configuration file:

cp .env.example .env

Update the database connection details in .env.

Run the database migration:

npm run migrate

Start the development server:

npm run dev

The backend API should be available at:

http://localhost:4000

Verify the API health:

http://localhost:4000/api/health

4. Build the Chrome Extension

Open another terminal:

cd extension
npm install
npm run build

The production build will be generated in:

extension/dist/

5. Load the Extension in Google Chrome

Open Google Chrome.

Navigate to chrome://extensions.

Enable Developer mode.

Click Load unpacked.

Select the generated extension/dist folder.

Open the extension from the Chrome toolbar.

The extension can now be tested in your local browser.

🧠 Risk Scoring Methodology

The platform combines permission-based analysis and runtime observations to produce a composite risk assessment.

1. Permission Risk Score

Each permission is assigned a weight based on its potential security impact.

Examples of permissions requiring careful evaluation include:

debugger

proxy

nativeMessaging

webRequestBlocking

Broad host permissions such as <all_urls>

The scoring engine evaluates declared permissions and host access patterns to calculate a normalized permission risk score.

2. Runtime Risk Adjustment

The system incorporates eligible network activity observations.

Distinct domains contacted by an extension's own background or service-worker context can contribute additional risk points.

The runtime adjustment is capped at 25 points.

3. Composite Risk Score

The final score combines permission risk and runtime adjustment:

Composite Risk Score =
Permission Risk Score + Runtime Risk Adjustment

The result is clamped between 0 and 100.

Risk Classification

Score

Risk Level

Below 40

Low

40–69

Medium

70–100

High

The scoring methodology is intended as a security assessment aid, not a definitive determination that an extension is malicious.

🔌 API Endpoints

The backend exposes REST endpoints for extension scanning, retrieving assessments, and checking service health.

Method

Endpoint

Purpose

GET

/api/health

Check backend and database health

POST

/api/scan

Submit extension scan information

GET

/api/extensions

Retrieve extension assessment information

GET

/api/extensions/:id/history

Retrieve historical scan information

🧪 Testing

The backend includes unit tests for the scoring engine.

Run the tests from the server directory:

cd server
npm test

The scoring tests validate the risk calculation logic without requiring a database connection.

🔐 Security Considerations and Limitations

Runtime network attribution depends on browser-provided request metadata.

Requests originating from content scripts may not always be attributable directly to an extension.

Manifest V3 service workers can become inactive when idle, which limits continuous runtime observation.

The known-benign domain list is intentionally limited and should not be treated as a comprehensive reputation database.

The current implementation focuses on Google Chrome and Manifest V3.

Risk scores are indicators for further investigation, not proof of malicious behavior.

🚀 Future Enhancements

Integrate domain reputation and threat intelligence services.

Expand browser compatibility to Firefox and Microsoft Edge.

Improve runtime behavior analysis.

Introduce user authentication and account-specific scan history.

Add advanced historical analytics and risk trend visualizations.

Explore machine-learning-based anomaly detection.

Prepare the extension for Chrome Web Store distribution.

🌐 Deployment

The backend and interactive web application are deployed using Render.

Live Application:
https://browser-extension-risk-auditor.onrender.com/

GitHub Repository:
https://github.com/Shreya0029-cloud/Browser-Extension-Risk-Auditor

Note: The web dashboard and the locally installed Chrome extension have different execution environments. Browser extension inspection requires the extension to be installed in a compatible Chrome browser.

👩‍💻 Author

GitHub: Shreya0029-cloud

Project Repository: Browser Extension Risk Auditor

<p align="center">
  <strong>Built to make browser extension security more transparent, understandable, and accessible.</strong>
</p>
