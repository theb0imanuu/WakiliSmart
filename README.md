<div align="center">
  <img src="./frontend/public/logo.svg" alt="WakiliSmart Logo" width="150"/>
  <h1>WakiliSmart ERP</h1>
  <p><em>Modern Legal Practice Management, Reimagined.</em></p>
</div>

---

**WakiliSmart** is a comprehensive, monolithic Enterprise Resource Planning (ERP) application engineered specifically for legal professionals, law firms, and legal secretaries. Designed to replace disjointed tools, it provides an all-in-one ecosystem for managing clients, dockets, court dates, billing, and internal operations.

## 🌟 Key Features

### 🏛️ Case & Document Management
- **Centralized Case Registry**: Track open, closed, and pending dockets. Link specific courts, related clients, and designated attorneys.
- **Document Organization**: Securely index and reference case notes, affidavits, and pleadings securely in the backend.

### 📅 Smart Practice Calendar & Intake
- **Public Booking Interface**: A beautiful, public-facing portal allowing prospective clients to request a consultation without logging in.
- **Approval Workflow**: Intuitive administrative review. Pending consults appear in a distinct dashboard.
- **Auto-Registration CRM**: Upon approving a consultation, the system seamlessly detects returning clients via phone/email or automatically mints new `CLI-XXXX` records for new prospects.

### 👥 Client & Staff Administration
- **Client Profiles**: Deep CRM capabilities tracking historical metadata, occupations, and all related active cases.
- **Role-Based Access Control (RBAC)**: Secure infrastructure partitioning access between Administrators, Advocates, and Secretaries.
- **Audit Logging**: Comprehensive logging of user activities to maintain operational security compliance.

### 💳 Invoicing & Billing
- **Financial Registry**: Integrated financial tools tracking invoices, outstanding balances, and client billing histories.
- **Automated Statistics**: Intelligent dashboards summarize outstanding capital and monthly revenue.

### 📝 Integrated Blog & Content Management
- Built-in capabilities for managing the firm's outward-facing content strategy directly alongside the operational dashboard.

---

## 🛠️ Technology Stack

WakiliSmart is structured as a **Monorepo**, seamlessly isolating the robust server from the lightweight client while remaining easy to deploy together.

### **Frontend Pipeline** 💻
Provides the fast, responsive, and gorgeous user interface.
- **Framework**: [React 19](https://react.dev/) mapped alongside [Vite](https://vitejs.dev/) for blazing-fast HMR and building.
- **Language**: TypeScript (`v5.9`).
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) bundled with Tailwind-Merge & CLSX, avoiding bulky CSS.
- **Visuals & Charts**: `lucide-react` for iconography, `recharts` for financial metrics, and `motion` for fluid micro-animations.
- **State & Forms**: `zustand` for high-performance localized state; `react-hook-form` paired with `zod` schema validation for iron-clad intake forms.
- **Calendars**: Integrated with `react-big-calendar`.

### **Backend Server** ⚙️
Acts as the robust, transactional brain of the operation.
- **Framework**: [NestJS 11](https://nestjs.com/) — heavily structured into modular domains.
- **Language**: TypeScript (`v5.7`).
- **Database**: [PostgreSQL](https://www.postgresql.org/) supported natively via [Neon](https://neon.tech).
- **ORM**: [Prisma](https://www.prisma.io/).
- **Security & Identity**: JSON Web Tokens (JWT), `bcrypt` hashing, and strict `@UseGuards()`.

---

## 🏗️ Monorepo Architecture

```text
WakiliSmart/
├── backend/                  # NestJS API Server
│   ├── prisma/               # Database schemas and migrations
│   ├── src/                  # Business logic (auth, cases, clients, etc.)
│   └── test/                 # E2E & Unit Test definitions
│
├── frontend/                 # React SPA
│   ├── public/               # Static assets & illustrations
│   ├── src/                  # UI implementation
│   │   ├── components/       # Reusable components & Modals
│   │   ├── pages/            # Core views (Dashboards, Booking, etc.)
│   │   ├── lib/              # API interceptors & Utilities
│   │   └── types/            # Global type definitions
│   └── index.html            # Vite app entry point
│
├── docker-compose.yml        # Orchestration (if self-hosted Postgres)
└── start.sh                  # Bootstrap development script
```

---

## 🚀 Getting Started

Follow these steps to launch the WakiliSmart environment locally.

### 1. Prerequisites
- **Node.js**: Minimum `v20.x` or higher.
- **Package Manager**: `npm`
- **Database**: Access to a PostgreSQL instance (or launch one using Docker).

### 2. Backend Initialization
The backend controls the database and all API communications. Navigate to the `backend/` directory:

```bash
cd backend
npm install
```

**Environment Variables** (\`backend/.env\`):
Create an `.env` file in the backend root containing:
```properties
DATABASE_URL="postgresql://user:password@hostname:5432/wakilismart?sslmode=require"
JWT_SECRET="YOUR_SUPER_SECRET_KEY"
PORT=3000
ALLOWED_ORIGINS="http://localhost:5173"
```

**Database Migration & Boot**:
```bash
npx prisma generate
npx prisma db push
npm run start:dev
```
*The server will successfully bind to `http://localhost:3000`.*

### 3. Frontend Initialization
The frontend displays the ERP tools to the user. Open a **new terminal tab** and navigate to the `frontend/` directory:

```bash
cd frontend
npm install
```

**Environment Variables** (\`frontend/.env\`):
Create an `.env` file in the frontend root to bind it to the API:
```properties
VITE_API_URL="http://localhost:3000/api"
```

**Boot the Client**:
```bash
npm run dev
```
*The application UI will now be available at `http://localhost:5173`.*

---

## 🔐 Core Workflows inside WakiliSmart

#### The Authentication Flow
1. Staff navigate to `/login` and submit their credentials.
2. The UI contacts `POST /api/auth/login`.
3. The NestJS server issues an HTTP-only JWT Cookie or Token.
4. On future requests (e.g. `GET /api/cases`), Axios automatically injects the Bearer token by default.

#### The Calendar Auto-CRM Bridging Flow
1. A stranger visits `/booking` and registers a consultation (saving as `tempClient` on the backend). 
2. A lawyer opens the Calendar, identifies the `PENDING` booking (highlighted in orange).
3. Clicking **Approve** triggers a backend reconciliation protocol.
4. *Prisma* queries for matching phone numbers or emails. If known, it maps them. If unknown, it effortlessly generates a `Client` record (`CLI-XXXXXX`) expanding the firm's Rolodex implicitly.

---

## 🛡️ License & Liability
Designed specifically for internal ecosystem usage. When deploying to production infrastructure, verify that all SSL, cookie configurations (SameSite, Secure), and firewalls are strictly configured to prevent client PII leakage.
