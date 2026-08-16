# Freelancer Hub — Modern Production-Ready Freelancer Marketplace

![Obsidian Atelier Theme](https://img.shields.io/badge/Design_System-Obsidian_Atelier-F4B860?style=for-the-badge)
![Django 5](https://img.shields.io/badge/Backend-Django_5_|_DRF_|_Channels-092E20?style=for-the-badge&logo=django)
![React 18](https://img.shields.io/badge/Frontend-React_18_|_Vite_|_Tailwind_CSS-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_|_SQLite_Fallback-4169E1?style=for-the-badge&logo=postgresql)
![WebSockets](https://img.shields.io/badge/Realtime-Django_Channels_|_Redis-DC382D?style=for-the-badge&logo=redis)
![Currency](https://img.shields.io/badge/Currency-Indian_Rupees_(%E2%82%B9)-FF9933?style=for-the-badge)

**Freelancer Hub** is a modern, high-performance two-sided freelancer marketplace. Built with a robust **Django 5 + REST Framework + Django Channels** backend and a client-side **React 18 + Vite + Tailwind CSS** frontend, the application features an editorial **"Obsidian Atelier"** dark design system, live WebSockets messaging, server-verified Razorpay payments, dynamic category hierarchies, and role-specific portals.

---

## 🌐 Live Production Demo

- **Vercel Live Application**: [https://frontend-five-black-87.vercel.app](https://frontend-five-black-87.vercel.app)
- **Django REST API**: `https://loud-windows-invite.loca.lt/api`
- **Django Admin Panel**: `http://127.0.0.1:8000/admin/`

---

## 🔑 Fast 1-Click Demo Credentials

| Role | Username / Email | Password | Direct Portal |
| :--- | :--- | :--- | :--- |
| **Client** | `client@freelancerhub.com` *(or `democlient`)* | `client123` | [Client Portal](https://frontend-five-black-87.vercel.app/login) |
| **Freelancer** | `freelancer@freelancerhub.com` *(or `demofreelancer`)* | `freelancer123` | [Freelancer Portal](https://frontend-five-black-87.vercel.app/login) |
| **Admin** | `admin@freelancerhub.com` *(or `admin`)* | `admin123` | [Admin Portal](https://frontend-five-black-87.vercel.app/login) |

---

## 🌟 Key Features & Capabilities

### 1. Clients
- **Account & Profile Setup**: Register as a client, configure company credentials and location.
- **Project Marketplace**: Post projects with min/max budget in Indian Rupees (`₹`), fixed or hourly rates, deadline, required skills, and image cover attachments.
- **Proposal Evaluation**: View applicant cover letters, bids, and delivery timelines. Shortlist candidates or accept bids to automatically assign the contract.
- **Real-Time Communication**: Instant WebSocket messaging with applicants and hired talent.
- **Razorpay Payments**: Secure payment workflow featuring server-side HMAC signature verification before marking orders as completed.

### 2. Freelancers
- **Professional Profiles**: Set hourly rates (`₹650 – ₹3,500/hr`), bio, experience years, primary category, and availability.
- **Interactive Portfolios**: Showcase projects with lightbox previews, technology tags, and live demo links.
- **Service Listings**: Offer fixed-price pre-packaged services in INR.
- **Proposal Submission**: Browse open project opportunities across 15 categories, filter by subcategories, and submit proposals with pre-filled budget inputs.
- **Reviews & Reputation**: Earn verified 1–5 star reviews and build an average star rating.

### 3. Administration
- **User & Content Moderation**: View all platform users, monitor filed reports, and suspend/reactivate accounts.
- **Dynamic Category Manager**: Manage 15 top-level categories and 50+ subcategories without touching code.
- **Platform Analytics**: Monitor user growth, total spending, and active contract counts.

---

## 🎨 Visual Identity: "Obsidian Atelier"

The application uses a bespoke dark palette designed for modern marketplaces:
- **Backgrounds**: Deep Obsidian (`#0B0B0D`, `#111113`)
- **Card Surfaces**: Elevated Graphite (`#171719`, `#1D1D20`)
- **Primary Accent**: Champagne Amber (`#F4B860`, `#E9A84C`)
- **Text & Contrast**: Soft Ivory (`#F4F0E8`) and Muted Slate (`#8D8A83`)
- **Typography**: `Plus Jakarta Sans` display headings + `Inter` body text
- **Animations**: Framer Motion scroll reveals and smooth card hover elevations.

---

## 🏗 System Architecture

```
                               ┌──────────────────────────────────────────┐
                               │           React SPA (Vite + Tailwind)    │
                               │    Obsidian Atelier UI / Framer Motion   │
                               └────────────────────┬─────────────────────┘
                                                    │
                                        HTTP REST   │   WebSockets (WSS)
                                          (JWT)     │   (Real-time Chat/Notifs)
                                                    ▼
                               ┌──────────────────────────────────────────┐
                               │         Django REST Framework API        │
                               │        Django Channels ASGI Server       │
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

### 1. Environment Setup

```powershell
# Clone the repository
git clone https://github.com/kandarp089/freelancer-hub.git
Set-Location freelancer-hub

# Create Python Virtual Environment inside backend
python -m venv backend\venv

# Activate Virtual Environment
.\backend\venv\Scripts\Activate.ps1

# Install Python requirements
pip install -r backend\requirements.txt
```

### 2. Database Setup & Migration

```powershell
# Generate Django migrations
python backend\manage.py makemigrations accounts categories profiles projects proposals messaging notifications reviews payments favorites reports

# Apply migrations
python backend\manage.py migrate

# Seed 15 categories with 120+ projects, image attachments & verified freelancers
python backend\manage.py seed_data
```

### 3. Run Backend Server

```powershell
# Run ASGI/WSGI Development Server
python backend\manage.py runserver 8000
```
*API Base URL*: `http://127.0.0.1:8000/api/`

---

### 4. Frontend Setup

Open a second PowerShell window:

```powershell
# Navigate to frontend folder
Set-Location frontend

# Install Node dependencies
cmd /c "npm install"

# Start Vite Development Server
cmd /c "npm run dev"
```
*Frontend App URL*: `http://localhost:5173`

---

## 🧪 Running Automated Tests

```powershell
# Run backend Django unit test suite
.\backend\venv\Scripts\python.exe backend\manage.py test apps.common

# Test frontend production build bundle
cmd /c "npm run build"
```

---

## 📁 Repository Directory Structure

```
Dark Free Lancing/
├── backend/
│   ├── apps/
│   │   ├── accounts/         # User auth, custom model, JWT tokens, dual login
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
│   │   ├── components/       # Navbar, Footer, Cards, RatingStars
│   │   ├── context/          # AuthContext provider
│   │   ├── pages/            # Home, CategoryList, CategoryDetail, FreelancerList,
│   │   │                     # FreelancerDetail, ProjectList, ProjectDetail, PostProject,
│   │   │                     # DashboardClient, DashboardFreelancer, DashboardAdmin, Chat, etc.
│   │   ├── services/         # Axios API interceptors & fallback mock dataset
│   │   ├── App.jsx           # Client-side router & ScrollToTop listener
│   │   ├── index.css         # Obsidian Atelier CSS theme rules
│   │   └── main.jsx
│   ├── package.json
│   ├── vercel.json           # Vercel proxy rewrite config
│   └── netlify.toml          # Netlify SPA redirect config
├── .env.example
├── .gitignore
├── render.yaml
└── README.md
```

---

## 💳 Payment Gateway Integration (Razorpay)

Freelancer Hub integrates **Razorpay** for Indian & International payment processing:
1. When a client initiates payment, the server calls `create_razorpay_order()` to generate a secure Razorpay Order ID.
2. After the client completes checkout, signature verification is executed strictly on the Django backend using HMAC-SHA256 digest comparison.
3. Upon signature verification success, the payment record status updates to `SUCCESS` and the project state transitions to `COMPLETED`.

Set your Razorpay credentials in `.env`:
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

---

## 📄 License
This project is licensed under the MIT License.
