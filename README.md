# Freelancer Hub — Modern Production-Ready Freelancer Marketplace & Super Admin Control Center

![Obsidian Atelier Theme](https://img.shields.io/badge/Design_System-Obsidian_Atelier-F4B860?style=for-the-badge)
![Django 5](https://img.shields.io/badge/Backend-Django_5_|_DRF_|_Channels-092E20?style=for-the-badge&logo=django)
![React 18](https://img.shields.io/badge/Frontend-React_18_|_Vite_|_Tailwind_CSS-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_|_SQLite_Fallback-4169E1?style=for-the-badge&logo=postgresql)
![WebSockets](https://img.shields.io/badge/Realtime-Django_Channels_|_Redis-DC382D?style=for-the-badge&logo=redis)
![Currency](https://img.shields.io/badge/Currency-Indian_Rupees_(%E2%82%B9)-FF9933?style=for-the-badge)

**Freelancer Hub** is a modern, high-performance two-sided freelancer marketplace and enterprise **Super Admin Control Center**. Built with a robust **Django 5 + REST Framework + Django Channels** backend and a client-side **React 18 + Vite + Tailwind CSS** frontend, the application features an editorial **"Obsidian Atelier"** dark design system, live WebSockets messaging, server-verified Razorpay payments, dynamic category hierarchies, identity verification queues, immutable financial reconciliation, and role-specific portals.

---

## 🌐 Live Production Demos

- **Public Marketplace Live**: [https://frontend-five-black-87.vercel.app](https://frontend-five-black-87.vercel.app)
- **Super Admin Control Center**: [https://frontend-five-black-87.vercel.app/admin/login](https://frontend-five-black-87.vercel.app/admin/login)
- **GitHub Repository**: [https://github.com/Kandarp089/freelancer-hub](https://github.com/Kandarp089/freelancer-hub)

---

## 🔑 Fast 1-Click Demo Credentials

| Role | Email | Password | Direct Portal Link |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@freelancerhub.com` | `admin123` | [Super Admin Portal](https://frontend-five-black-87.vercel.app/admin/login) |
| **Client** | `client@freelancerhub.com` | `client123` | [Client Portal](https://frontend-five-black-87.vercel.app/login) |
| **Freelancer** | `freelancer@freelancerhub.com` | `freelancer123` | [Freelancer Portal](https://frontend-five-black-87.vercel.app/login) |

---

## 🌟 Key Features & Capabilities

### 1. Super Admin Control Center (`/admin/dashboard`)
- **Matrix-Inspired SaaS Visual Analytics**: 10 Quick Statistic Cards (Total Users, Freelancers, Clients, Active Projects, Completed Work, Revenue, Escrow Volume, Submitted Bids, Pending Verifications, Reports).
- **Multi-Period Financial Graphs**: Interactive monthly gross billing throughput (Jan–Aug 2026), conversion rate analytics, and category demand distribution bars.
- **User Accounts Governance (`/admin/users`)**: Manage accounts, search by username/email, assign roles, toggle verification badges, and execute bulk suspend/reactivate actions.
- **Talent Verification Queue (`/admin/freelancers`)**: Review identity documentation, verify freelancer credentials, and approve/revoke Pro badges.
- **Contract & Project Moderation (`/admin/projects`)**: Filter projects by budget and status (`OPEN`, `IN_PROGRESS`, `COMPLETED`), approve postings, toggle featured badges, and soft-delete contracts.
- **Taxonomy Management (`/admin/categories`, `/admin/skills`)**: Full CRUD for 15 top-level categories, subcategories hierarchy, and skills tag directory.
- **Immutable Financials (`/admin/payments`, `/admin/transactions`)**: Audit Razorpay transaction logs, configure server-side platform commission percentage (default 10%), and export financial CSV reports.
- **Security Audit Logs (`/admin/audit-logs`, `/admin/system`)**: Immutable Django `AuditLog` table capturing every administrative mutation, IP address, timestamp, and reason, paired with a real-time infrastructure latency monitor.

### 2. Clients
- **Project Posting**: Create fixed or hourly projects in INR (`₹`), define milestones, deadline, required skills, and image cover attachments.
- **Proposal Evaluation**: View applicant cover letters, bids, and delivery timelines. Shortlist candidates or accept bids with 1-click contract assignment.
- **Razorpay Payments**: Secure payment checkout with server-side HMAC-SHA256 signature verification.

### 3. Freelancers
- **Talent Profiles**: Set hourly rates (`₹650 – ₹3,500/hr`), bio, experience years, location, and verified badges.
- **Interactive Portfolios & Service Packages**: Showcase past contracts and fixed-price service packages.
- **Proposal Bidding**: Submit bids across 15 categories with custom delivery estimates.

---

## 🎨 Visual Identity: "Obsidian Atelier"

- **Canvas Background**: Deep Obsidian (`#0B0B0D`, `#111113`)
- **Card Surfaces**: Elevated Graphite (`#171719`, `#1D1D20`)
- **Primary Accent**: Champagne Amber (`#F4B860`, `#E9A84C`)
- **Text & Contrast**: Soft Ivory (`#F4F0E8`) and Muted Slate (`#8D8A83`)
- **Typography**: `Plus Jakarta Sans` display headings + `Inter` body text

---

## 🏗 System Architecture

```
                               ┌──────────────────────────────────────────┐
                               │           React SPA (Vite + Tailwind)    │
                               │    Obsidian Admin / Framer Motion        │
                               └────────────────────┬─────────────────────┘
                                                    │
                                        HTTP REST   │   WebSockets (WSS)
                                          (JWT)     │   (Real-time Chat/Notifs)
                                                    ▼
                               ┌──────────────────────────────────────────┐
                               │         Django REST Framework API        │
                               │        Django Channels ASGI Server       │
                               │        Admin Governance & AuditLog       │
                               └────────┬───────────┬────────────┬────────┘
                                        │           │            │
                                        ▼           ▼            ▼
                                 ┌────────────┐┌───────────┐┌───────────┐
                                 │ PostgreSQL ││   Redis   ││  Celery   │
                                 │   Database ││ Channel   ││ Background│
                                 │            ││ Layer/Cache││  Tasks    │
                                 └────────────┘└───────────┘└───────────┘
```

---

## 🚀 Quick Start Guide (Windows PowerShell)

### Prerequisites
- Python 3.12+
- Node.js v18+ & npm
- Git

### 1. Backend Setup

```powershell
# Clone repository
git clone https://github.com/Kandarp089/freelancer-hub.git
Set-Location freelancer-hub

# Create & activate virtual environment
python -m venv backend\venv
.\backend\venv\Scripts\Activate.ps1

# Install requirements
pip install -r backend\requirements.txt

# Run migrations
python backend\manage.py makemigrations accounts categories profiles projects proposals messaging notifications reviews payments favorites reports admin_panel
python backend\manage.py migrate

# Seed database with dummy data
python backend\manage.py seed_data

# Start backend server
python backend\manage.py runserver 8000
```
*API Endpoint*: `http://127.0.0.1:8000/api/`

---

### 2. Frontend Setup

Open a second PowerShell window:

```powershell
Set-Location frontend
cmd /c "npm install"
cmd /c "npm run dev"
```
*Frontend Dev Server*: `http://localhost:5173`

---

## 🧪 Running Tests & Build Verification

```powershell
# Django backend unit tests
.\backend\venv\Scripts\python.exe backend\manage.py test apps.admin_panel apps.common

# Vite production bundle build
cmd /c "npm run build"
```

---

## 📁 Repository Structure

```
freelancer-hub/
├── backend/
│   ├── apps/
│   │   ├── accounts/         # User auth, custom model, JWT tokens, dual login
│   │   ├── admin_panel/      # Super Admin REST API, AuditLog, Dispute, MarketplaceSetting
│   │   ├── categories/       # Category & SubCategory models & views
│   │   ├── profiles/         # FreelancerProfile, ClientProfile, Portfolio, Service
│   │   ├── projects/         # Project postings, image attachments, cover banners
│   │   ├── proposals/        # Proposals, milestone management, contract acceptance
│   │   ├── messaging/        # Conversation, Message, Channels ChatConsumer
│   │   ├── notifications/    # In-app notifications
│   │   ├── reviews/          # Verified project reviews & rating aggregation
│   │   ├── payments/         # Razorpay order creation & HMAC verification
│   │   ├── favorites/        # Saved bookmarks
│   │   ├── reports/          # Moderation tools
│   │   └── common/           # Seed command, pagination, permissions
│   ├── config/               # Django settings, ASGI/WSGI, routing, URLs
│   ├── requirements.txt      # Python dependencies
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── admin/            # Super Admin Layout, Sidebar, Topbar, AdminLogin
│   │   │   └── pages/        # DashboardOverview, UsersManager, FreelancersManager,
│   │   │                     # ProjectsManager, CategoriesSkillsManager, FinancialsManager,
│   │   │                     # AuditLogsSystem
│   │   ├── components/       # Navbar, Footer, Cards, RatingStars
│   │   ├── context/          # AuthContext provider
│   │   ├── pages/            # Home, CategoryList, CategoryDetail, FreelancerList,
│   │   │                     # FreelancerDetail, ProjectList, ProjectDetail, PostProject,
│   │   │                     # DashboardClient, DashboardFreelancer, DashboardAdmin, Chat, etc.
│   │   ├── services/         # Axios API interceptors & fallback mock dataset
│   │   └── App.jsx           # Client-side router
│   ├── package.json
│   ├── vercel.json           # Vercel proxy rewrite config
│   └── netlify.toml          # Netlify SPA redirect config
├── .gitignore
├── render.yaml
└── README.md
```

---

## 📄 License
This project is licensed under the MIT License.
