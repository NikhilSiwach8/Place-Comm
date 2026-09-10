# StudentHub Technical & Operational Documentation

**Institution:** Indian Institute of Management Guwahati (IIMG)  
**Document Version:** 2.4.0  
**Last Updated:** 2026-09-07  
**Classification:** Institutional Internal / Administration & Developer Guide  

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Directory & Component Layout](#2-directory--component-layout)
3. [Authentication & Authorization Model](#3-authentication--authorization-model)
4. [Data Layer & State Management](#4-data-layer--state-management)
5. [Core Functional Modules](#5-core-functional-modules)
6. [Institutional Branding & Asset Guidelines](#6-institutional-branding--asset-guidelines)
7. [Security & Compliance](#7-security--compliance)
8. [Maintenance, Troubleshooting & Runbook](#8-maintenance-troubleshooting--runbook)
9. [Copyright & Intellectual Property](#9-copyright--intellectual-property)

---

## 1. System Architecture Overview

StudentHub is built using a modern Single Page Application (SPA) architecture designed for reliability, sub-second latency, and intuitive interaction:

```text
[ Browser Client ]
       │
       ├── Theme Context (System / Light / Dark via class-based Tailwind)
       ├── Auth Context (Session State, Token Persistence, Role Switching)
       │
       ├── State & Storage Layer (src/services/store.ts)
       │      ├── LocalStorage Caching (Encrypted/Scoped Keys)
       │      └── Asynchronous Cloud Sync (Optional PostgreSQL Service)
       │
       └── View & Component Router
              ├── Landing & Institutional Portal (Public)
              ├── Student Workspace (Profiles, Skills, Portfolios, Applications)
              ├── Opportunities & Placement Engine (Listings, Filters, Apply)
              ├── National Case Competitions (Challenges, Teams, Pre-Reg)
              ├── Digital Credentials Vault (Verified Certificates & Transcripts)
              └── Administrative Console (User Directory, Audit Trail, Domain Settings)
```

---

## 2. Directory & Component Layout

```text
├── index.html                   # HTML entry point with synchronized title, OpenGraph tags & theme script
├── metadata.json                # AI Studio application metadata & frame permissions
├── package.json                 # Build dependencies, TypeScript & Tailwind configurations
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS plugin
├── public/                      # Static assets
│   ├── iimg-logo.jpg            # High-resolution IIMG crest logo
│   └── logo.jpg                 # Institutional emblem fallback
├── src/
│   ├── main.tsx                 # Application root entry point
│   ├── App.tsx                  # Main router, view switcher & modal manager
│   ├── index.css                # Global Tailwind CSS import & theme rules
│   ├── types.ts                 # TypeScript interfaces, types & enums
│   ├── contexts/
│   │   ├── AuthContext.tsx      # User authentication, registration & dual-role management
│   │   └── ThemeContext.tsx     # Light/Dark/System theme provider
│   ├── services/
│   │   ├── store.ts             # Central synchronized data store with local persistence
│   │   ├── demoData.ts          # Institutional starter dataset for students & opportunities
│   │   ├── supabase.ts          # Optional cloud client connector
│   │   └── supabaseData.ts      # Cloud synchronization service
│   └── components/
│       ├── common/              # Shared UI components
│       │   ├── Button.tsx       # Standardized institutional button
│       │   ├── Input.tsx        # Styled form inputs & select dropdowns
│       │   ├── Card.tsx         # Card container with header & elevation
│       │   ├── Badge.tsx        # Status tags & metadata chips
│       │   ├── IIMGLogo.tsx     # Official institutional logo with image fallback
│       │   └── Navbar.tsx       # Primary navigation bar with search & dual-role toggle
│       ├── auth/
│       │   ├── LoginPage.tsx    # Institutional single sign-on & credentials entry
│       │   └── RegisterPage.tsx # Student registration with domain validation
│       ├── landing/
│       │   └── LandingPage.tsx  # Public institutional introduction & feature showcase
│       ├── student/
│       │   ├── StudentDashboard.tsx # Student overview, progress stats & recommendations
│       │   ├── StudentProfile.tsx   # Comprehensive editable student resume & details
│       │   ├── StudentSettings.tsx  # Account security, password & preferences
│       │   └── EditProfileModal.tsx # Profile edit modal dialog
│       ├── opportunities/
│       │   └── OpportunityPortal.tsx # Job & internship board with multi-filter search
│       ├── competitions/
│       │   └── CompetitionPortal.tsx # Case competitions hub, team builder & deadlines
│       ├── certificates/
│       │   └── CertificateManagement.tsx # Verified credentials & transcript viewer
│       └── admin/
│           ├── AdminDashboard.tsx   # Institutional KPI metrics & recent activity
│           ├── AdminStudents.tsx    # Comprehensive student registry with batch filters
│           ├── AdminOpportunities.tsx # Placement openings manager & publisher
│           ├── AdminAuditLogs.tsx   # Immutable security & operational audit trail
│           └── AdminSettings.tsx    # Email domain controls & institutional configurations
```

---

## 3. Authentication & Authorization Model

### Roles & Access Matrix

| Role | Scope | Permitted Views |
| :--- | :--- | :--- |
| `anonymous` | Unauthenticated Visitors | Landing Page, Public Portal, Login, Registration |
| `student` | Enrolled IIMG Students | Student Dashboard, Profile, Opportunities, Competitions, Certificates, Settings |
| `admin` | Institutional Officers | Admin Dashboard, Student Registry, Opportunities Manager, Audit Logs, Settings |

### Designated Administrator
- **Primary Administrator:** `p26nikhil@iimg.ac.in`
- **Dual-Role Capability:** Automatically granted dual-role privileges. The administrator can switch between `admin` console and `student` perspective directly from the top navigation bar to test and verify student experiences without logging out.

### Registration Domain Policy
- Registration is strictly gated by the institutional domain whitelist configured in `store.getAllowedEmailDomains()`.
- Default Whitelist: `@iimg.ac.in`.
- Administrators can append new institutional branches or affiliated domains via **Admin Settings**.

---

## 4. Data Layer & State Management

### Synchronized Data Store (`src/services/store.ts`)
The platform implements a singleton data store pattern (`store`) providing:
1. **Local State Persistence**: All student profiles, projects, opportunities, applications, notifications, and certificates are cached in `localStorage` under namespaced keys (`studenthub_*`).
2. **Event-Driven Reactivity**: Custom browser events (`case_competitions_updated`, `audit_logs_updated`, `studenthub_store_updated`) trigger component updates without page reloads.
3. **Graceful Fallback**: If external cloud connectivity is unconfigured or transiently unavailable, the application operates seamlessly using client storage.

### Key Data Entities (`src/types.ts`)
- `Student`: Roll number, full name, email, department, batch, CGPA, verified status, bio, skills, resume URL.
- `Opportunity`: Title, organization, role type, stipend/salary, location, work mode, eligibility criteria, application deadline.
- `CaseCompetition`: Challenge title, host organizer, prize pool, registration deadline, eligibility, team size bounds, external brief/apply links.
- `Certificate`: Credential ID, title, issuer, issue date, credential URL, verification hash.
- `AuditLog`: Timestamp, actor name, action type, target entity, metadata payload.

---

## 5. Core Functional Modules

### Student Profile & Career Vault
- **Academic Details**: Verified CGPA, specialization track, batch year, and enrollment credentials.
- **Skills Matrix**: Technical skills, managerial competencies, and tools with proficiency tiers.
- **Portfolio Showcase**: Direct links to capstone repositories, live demo projects, and research publications.

### Opportunities & Placement Portal
- **Advanced Filtering**: Real-time filtering by role type (Full-Time, Summer Internship, Consulting Project), work mode (On-site, Hybrid, Remote), and eligible departments.
- **Application Workflow**: Single-click institutional application submission with dynamic application status updates.

### Case Competitions & MBA Challenges
- **Countdown Engine**: Dynamic day counters for upcoming deadlines.
- **Direct Application vs Internal Team Builder**: Direct URL normalization with fallback to internal institutional team submission.

### Verified Certificates Vault
- **Instant Digital Download**: Generates and downloads institutional certificate verification files directly in the browser.
- **Verification Code**: Unique serial code for third-party recruiter verification.

### Administrative Audit Trail
- Logs every significant institutional action (student profile modifications, opportunity publications, admin logins, domain whitelist adjustments).
- Fully searchable and filterable by action type and date range.

---

## 6. Institutional Branding & Asset Guidelines

- **Primary Colors**: IIMG Blue (`#1d4ed8` / `#2563eb`), Slate Neutrals (`#0f172a` / `#f8fafc`).
- **Logo Component (`IIMGLogo`)**:
  - Implements multi-tier fallback: Primary image (`/iimg-logo.jpg`) -> Secondary image (`/logo.jpg`) -> SVG crest geometry.
  - Supports `horizontal`, `stacked`, and `compact` variants across all breakpoints.
- **Typography**: Refined modern sans-serif scale with optical padding and strict WCAG AA contrast ratios.

---

## 7. Security & Compliance

- **No Public API Keys**: Client bundles contain zero third-party or administrative secrets.
- **Data Protection**: Sensitive student contact and academic data is isolated behind authenticated routes.
- **Sanitized UI**: Internal infrastructure names and diagnostic modals are omitted from production views.
- **Audit Immutability**: Administrative logs record actor timestamps for institutional accountability.

---

## 8. Maintenance, Troubleshooting & Runbook

### Routine Commands
```bash
# Clean build artifacts
npm run clean

# Run strict TypeScript audit
npm run lint

# Build production distribution
npm run build

# Start production preview server
npm run preview
```

### Common Troubleshooting Scenarios

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| Registration rejected | Email domain not in whitelist | Add domain via Admin Settings or use `@iimg.ac.in` |
| Image not displaying | Missing asset in `/public` | `IIMGLogo` automatically falls back to vector emblem |
| Changes not visible | Browser storage has older schema | Use "Reset Demo Data" in Admin Dashboard or clear cache |

---

## 9. Copyright & Intellectual Property

```text
Copyright (c) 2026 Indian Institute of Management Guwahati (IIMG).
All Rights Reserved.
```

This software and its documentation are proprietary to the **Indian Institute of Management Guwahati**. Unauthorized copying, distribution, or decompilation is strictly prohibited. For inquiries, refer to `LICENSE.md`.
