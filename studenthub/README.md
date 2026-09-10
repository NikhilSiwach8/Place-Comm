# StudentHub — Indian Institute of Management Guwahati (IIMG)

[![Institution](https://img.shields.io/badge/Institution-IIM%20Guwahati-0284c7.svg)](https://iimg.ac.in)
[![License](https://img.shields.io/badge/License-Institutional%20Copyright%20©%202026-1e293b.svg)](./LICENSE.md)
[![Build](https://img.shields.io/badge/Build-Vite%20%7C%20React%2019%20%7C%20TypeScript-22c55e.svg)](#architecture--tech-stack)

> **Official Unified Academic, Placement & Career Vault** for the Indian Institute of Management Guwahati (IIMG). A centralized, enterprise-grade web application engineered for student career portfolios, verified digital credentials, recruiter job boards, case competitions, administrative governance, and institutional audit tracking.

---

## 🏛️ Executive Summary

**StudentHub** provides an integrated single-pane-of-glass environment for students, recruiters, and academic administrators of IIM Guwahati. It modernizes campus placements and credential administration by bridging verified institutional records with real-time industry engagement:

- **Institutional Identity & Emblem**: Official IIM Guwahati crest branding with light/dark theme resilience, accessible typography, and responsive touch-first design.
- **Role-Based Access Control (RBAC)**: Secure access separation for enrolled students, placement coordinators, and institutional administrators with seamless dual-role switching for designated officers.
- **Cryptographically Verifiable Credentials**: Digitally verified academic transcripts, honor certificates, and achievement records with tamper-evident serial hashes.
- **Comprehensive Placement & Career Suite**: Full-lifecycle job & internship listings with work-mode filtering, eligibility screening, direct application routing, and offer tracking.
- **National Case Competitions Hub**: Curated MBA challenges, hackathons, and corporate case competitions with team formation and direct pre-registration flows.

---

## ⚡ Core Functional Modules

### 1. Student Career Vault (`/student`)
- **Holistic Profile Management**: CGPA tracking, specialization streams (Finance, Marketing, Strategy, Analytics, Operations), batch year, and career aspirations.
- **Skills Matrix & Certifications**: Categorized technical and managerial competencies with verified endorsement statuses.
- **Project Portfolios**: Showcase capstones, consulting projects, and published research with live links and technology badges.
- **Application Tracker**: Real-time status monitoring (Submitted, Under Review, Shortlisted, Interview Scheduled, Offered).

### 2. Opportunity & Placement Portal (`/opportunities`)
- **Curated Openings**: Full-time executive placement, summer internships, live consulting engagements, and research fellowships.
- **Multi-Factor Filters**: Filter by department, compensation/stipend bracket, location, and work arrangement (On-site, Hybrid, Remote).
- **Direct Application Channels**: Instant institutional resume forwarding or one-click external application routing.

### 3. Case Competitions & Challenges Engine (`/competitions`)
- **Corporate Competitions**: National and international business school challenges (e.g., L'Oréal Brandstorm, HUL L.I.M.E., Tata Steel Steel-a-thon).
- **Eligibility & Deadlines**: Automated countdowns, prize pool breakdowns, team size prerequisites, and round schedules.
- **Team Registration**: Integrated team creation and submission workflows.

### 4. Verified Digital Certificates & Transcripts (`/certificates`)
- **Tamper-Evident Records**: Unique institutional credential IDs and verification codes for each certificate.
- **Instant Preview & Export**: In-browser document viewer with direct client-side digital certificate download.
- **Recruiter Verification**: Publicly shareable verification links ensuring absolute authenticity.

### 5. Institutional Administrative Console (`/admin`)
- **Student Directory & Approvals**: Batch-wise student directory with credential validation and academic status oversight.
- **Opportunity Management**: Create, edit, publish, or expire corporate placement opportunities.
- **Institutional Domain Policies**: Whitelist management for approved email domains (e.g., `@iimg.ac.in`).
- **Immutable Audit Trail**: Chronological event logging for administrative sign-ins, role updates, and record alterations.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 19** + **TypeScript 5.8** | Component architecture with strict static typing |
| **Build Tool** | **Vite 6** | Ultra-fast development and optimized production bundling |
| **Styling** | **Tailwind CSS v4** | Clean, accessible design system with dark/light mode parity |
| **Icons** | **Lucide React** | Consistent, lightweight SVG icon suite |
| **Animations** | **Motion (`motion/react`)** | Fluid page transitions, modal displays, and state changes |
| **Effects** | **Canvas Confetti** | Milestone and achievement celebrations |
| **Persistence** | **LocalStorage + Cloud Store Sync** | Resilient client-side caching with seamless cloud hydration |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **bun**: Package manager

### Installation

```bash
# 1. Clone repository
git clone https://github.com/iimg-institution/studenthub.git
cd studenthub

# 2. Install dependencies
npm install

# 3. Launch development server (Runs on port 3000)
npm run dev
```

The application will be live at `http://localhost:3000`.

### Environment Configuration

Create a local `.env` file based on `.env.example`:

```env
# Optional cloud synchronization endpoints
VITE_SUPABASE_URL=""
VITE_SUPABASE_ANON_KEY=""
```
*Note: The platform is fully self-contained and operates gracefully in autonomous offline/local storage mode when external cloud keys are omitted.*

---

## 📦 Build & Production Deployment

### Production Compilation

Compile and minify the frontend assets for high-performance static delivery:

```bash
npm run build
```

This compiles optimized chunks to `dist/`, including:
- HTML entry point with synchronized OpenGraph metadata and theme initializer
- Minified, tree-shaken JavaScript bundles
- Unified Tailwind CSS stylesheets
- Verified IIMG branding assets

### Verification Scripts

```bash
# Run strict TypeScript typechecking
npm run lint

# Preview the production build locally
npm run preview
```

### Deployment to Google Cloud Run

1. Open the project in **Google AI Studio**.
2. Click the **Deploy** button in the top navigation bar.
3. Select **Deploy to Cloud Run**, configure your target Cloud Project, and click **Confirm**.
4. The deployment pipeline serves the static `dist/` bundle on port 3000 automatically.

---

## 🔒 Security & Role-Based Access Control

- **Domain Enforcement**: New student registrations are validated against verified institutional domain rules (default: `@iimg.ac.in`).
- **Role Isolation**:
  - `student`: Access to personal profile, job board, competitions, and certificate downloads.
  - `admin`: Full administrative access to student registries, audit logs, and institutional settings.
- **Dual-Role Switching**: Designated administrators (`p26nikhil@iimg.ac.in`) have access to a quick-switch toggle in the navigation header to preview the portal from either a student's or an administrator's perspective.
- **Sanitized UI**: Technical backend references are abstracted from the live web interface to maintain institutional brand integrity.

---

## 📄 Documentation & Architecture Files

- [Technical Documentation & Runbook](./DOCUMENTATION.md) — Comprehensive architectural specifications, component hierarchy, and data schemas.
- [License & Copyright Notice](./LICENSE.md) — Institutional ownership, copyright terms, and usage restrictions.

---

## ⚖️ Copyright & Attribution

```text
Copyright (c) 2026 Indian Institute of Management Guwahati (IIMG).
All Rights Reserved.
```

Managed and operated by the **Placement Committee & Academic IT Council**, Indian Institute of Management Guwahati.  
For institutional inquiries or administrative access, contact `p26nikhil@iimg.ac.in` or `administration@iimg.ac.in`.
