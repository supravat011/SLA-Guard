# 🛡️ SLA Guard

> **Intelligent SLA Breach Prevention System** - Proactive ticket monitoring with automated escalation, real-time risk assessment, and comprehensive analytics for IT support teams.

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Usage Guide](#-usage-guide)
- [Security](#-security)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🎯 Overview

**SLA Guard** is a next-generation Service Level Agreement (SLA) breach prevention system designed to help IT support teams proactively monitor, track, and prevent SLA violations before they occur. Built with modern web technologies, it provides real-time risk assessment, intelligent escalation, and role-based dashboards for both managers and technicians.

### Why SLA Guard?

Traditional ticketing systems are **reactive** - they notify you *after* an SLA breach occurs. SLA Guard is **proactive** - it predicts and prevents breaches before they happen through:

- 🔮 **Predictive Risk Assessment** - Dynamic risk calculation based on elapsed time and SLA thresholds
- ⚡ **Automated Escalation** - Intelligent auto-escalation at 75% SLA threshold
- 📊 **Real-time Monitoring** - Background scheduler checks ticket status every 5 minutes
- 🎯 **Role-based Workflows** - Specialized dashboards for managers and technicians
- 📧 **Smart Notifications** - HTML email alerts with actionable insights
- 💬 **Collaborative Comments** - Public and internal comment system for team coordination

---

## ✨ Key Features

### 🎛️ **For Managers**

<table>
<tr>
<td width="50%">

**📊 Comprehensive Dashboard**
- Real-time SLA breach metrics
- High-risk ticket monitoring
- Average resolution time tracking
- Technician workload distribution

**👥 Team Management**
- User creation and role assignment
- Technician performance analytics
- Workload balancing insights
- Activity log tracking

</td>
<td width="50%">

**⚙️ System Configuration**
- SLA threshold customization by priority
- Email notification settings
- Escalation rule management
- Risk level configuration

**💬 Advanced Communication**
- Internal comments (manager-only)
- Public comments (team-wide)
- Email notification system
- Escalation alerts

</td>
</tr>
</table>

### 🔧 **For Technicians**

<table>
<tr>
<td width="50%">

**🎯 Personalized Workspace**
- View only assigned tickets
- SLA timer with visual countdown
- Color-coded priority indicators
- Quick resolve actions

</td>
<td width="50%">

**📝 Ticket Management**
- Update ticket status
- Add public comments
- Track activity history
- Monitor SLA progress

</td>
</tr>
</table>

### 🚀 **Advanced Capabilities**

#### **Intelligent SLA Engine**
- **Automated Monitoring**: Background scheduler runs every 5 minutes
- **Risk Calculation**: Dynamic risk levels (Safe, Warning, High Risk, Breached)
- **Smart Escalation**: Automatic escalation at 75% SLA threshold
- **Email Notifications**: HTML templates for escalations and assignments

#### **Advanced Search & Filtering**
- Multi-field search (title, customer, ticket ID)
- Combined filters (status, priority, assignee)
- Role-based result filtering
- Real-time search results

#### **Comprehensive Analytics**
- Dashboard overview statistics
- Risk distribution charts
- Technician workload analysis
- SLA breach trend tracking

#### **Activity Logging**
- Complete audit trail
- User action tracking
- Timestamp-based history
- Filterable activity logs

---

## 🛠️ Technology Stack

### **Frontend Architecture**

```
React 19.2.4 + TypeScript 5.8.2 + Vite 6.2.0
```

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.4 | Modern UI library with hooks |
| **TypeScript** | 5.8.2 | Type-safe development |
| **Vite** | 6.2.0 | Lightning-fast build tool |
| **React Router DOM** | 7.13.0 | Client-side routing |
| **Axios** | 1.13.4 | HTTP client with interceptors |
| **Recharts** | 3.7.0 | Data visualization |
| **Tailwind CSS** | - | Utility-first styling |
| **Lucide React** | 0.563.0 | Icon library |

### **Backend Architecture**

```
FastAPI 0.115.0 + Python 3.8+ + SQLAlchemy 2.0.36
```

| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | 0.115.0 | High-performance async API framework |
| **Python** | 3.8+ | Modern Python with async support |
| **SQLAlchemy** | 2.0.36 | ORM for database operations |
| **SQLite** | - | Lightweight relational database |
| **JWT (python-jose)** | 3.3.0 | Secure token authentication |
| **Passlib (bcrypt)** | 1.7.4 | Password hashing |
| **APScheduler** | 3.10.4 | Background job scheduling |
| **Uvicorn** | 0.32.0 | ASGI server |
| **Pydantic** | 2.10.3 | Data validation |

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js** 16+ and npm
- **Python** 3.8+
- **pip** package manager

### **Installation**

#### **1️⃣ Clone the Repository**

```bash
git clone <repository-url>
cd "SLA Guard"
```

#### **2️⃣ Backend Setup**

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see Configuration section)
# Edit .env with your settings

# Run the server
python main.py
```

✅ Backend will start on **http://localhost:8000**

#### **3️⃣ Frontend Setup**

```bash
# From project root
npm install

# Run development server
npm run dev
```

✅ Frontend will start on **http://localhost:3000**

### **Access the Application**

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Main application UI |
| **Backend API** | http://localhost:8000 | REST API endpoints |
| **API Docs (Swagger)** | http://localhost:8000/docs | Interactive API documentation |
| **API Docs (ReDoc)** | http://localhost:8000/redoc | Alternative documentation |

### **First-Time Setup**

1. Navigate to **http://localhost:8000/docs**
2. Use the `/auth/register` endpoint to create your first user
3. Set `role` to `MANAGER` for admin access
4. Login via `/auth/login` to get your JWT token
5. Access the frontend at **http://localhost:3000**

---

## 🏗️ Architecture

### **Project Structure**

```
SLA Guard/
├── 📁 backend/                      # FastAPI Backend
│   ├── 📄 main.py                  # Application entry point
│   ├── 📄 config.py                # Configuration settings
│   ├── 📄 database.py              # Database setup & session
│   ├── 📄 auth.py                  # JWT authentication
│   ├── 📄 scheduler.py             # Background job scheduler
│   │
│   ├── 📁 models/                  # SQLAlchemy Models
│   │   ├── models.py               # Ticket, User, Notification models
│   │   └── models_comments.py      # Comment model
│   │
│   ├── 📁 schemas/                 # Pydantic Schemas
│   │   ├── schemas.py              # Request/response schemas
│   │   ├── schemas_tickets.py      # Ticket schemas
│   │   └── schemas_comments.py     # Comment schemas
│   │
│   ├── 📁 routers/                 # API Endpoints
│   │   ├── auth.py                 # Authentication routes
│   │   ├── tickets.py              # Ticket CRUD operations
│   │   ├── tickets_extended.py     # Extended ticket features
│   │   ├── comments.py             # Comment system
│   │   ├── notifications.py        # Notification management
│   │   ├── analytics.py            # Analytics & reporting
│   │   ├── sla.py                  # SLA configuration
│   │   ├── users.py                # User management
│   │   └── activity_logs.py        # Activity logging
│   │
│   ├── 📁 services/                # Business Logic
│   │   ├── sla_engine.py           # SLA monitoring engine
│   │   ├── escalation.py           # Auto-escalation logic
│   │   └── email_service.py        # Email notifications
│   │
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 .env                     # Environment variables
│   └── 📄 seed_data.py             # Sample data generator
│
├── 📁 pages/                        # React Pages
│   ├── LandingPage.tsx             # Marketing landing page
│   ├── LoginPage.tsx               # Authentication page
│   ├── ManagerDashboard.tsx        # Manager workspace
│   ├── TechnicianDashboard.tsx     # Technician workspace
│   ├── TicketDetailPage.tsx        # Ticket details view
│   └── SettingsPage.tsx            # Configuration page
│
├── 📁 components/                   # React Components
│   ├── SLAProgressBar.tsx          # SLA timer component
│   ├── TicketCard.tsx              # Ticket display card
│   ├── CommentSection.tsx          # Comment system UI
│   └── ...                         # Other components
│
├── 📁 services/                     # Frontend Services
│   └── api.ts                      # Axios API client
│
├── 📄 App.tsx                      # Main React app
├── 📄 types.ts                     # TypeScript types
├── 📄 constants.ts                 # Constants & config
├── 📄 package.json                 # Node dependencies
├── 📄 vite.config.ts               # Vite configuration
└── 📄 README.md                    # This file
```

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Manager    │  │  Technician  │  │   Settings   │      │
│  │  Dashboard   │  │  Dashboard   │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │  API.ts   │ (Axios Client)             │
│                    └─────┬─────┘                            │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    Routers                            │  │
│  │  Auth │ Tickets │ Comments │ Analytics │ SLA │ Users │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │                   Services                            │  │
│  │  SLA Engine │ Escalation │ Email Service             │  │
│  └──────────────────────┬───────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼───────────────────────────────┐  │
│  │              SQLAlchemy ORM                           │  │
│  └──────────────────────┬───────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                   SQLite Database                            │
│  Tickets │ Users │ Comments │ Notifications │ Activity Logs │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│              Background Scheduler (APScheduler)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  SLA Check Job (Every 5 minutes)                       │ │
│  │  → Update risk levels → Auto-escalate → Send emails   │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### **SLA Risk Calculation Flow**

```
Ticket Created
    │
    ▼
┌─────────────────────┐
│  Calculate Elapsed  │
│  Time vs SLA Limit  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────────────────────────────┐
│  Risk Level = (Elapsed / SLA Limit) × 100   │
└─────────┬───────────────────────────────────┘
          │
          ▼
    ┌─────┴─────┐
    │   0-49%   │ → Safe (Green)
    ├───────────┤
    │  50-74%   │ → Warning (Yellow)
    ├───────────┤
    │  75-99%   │ → High Risk (Orange) → AUTO-ESCALATE
    ├───────────┤
    │   100%+   │ → Breached (Red)
    └───────────┘
```

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:8000
```

### **Authentication**

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### **API Endpoints**

#### **🔐 Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login and get JWT token | ❌ |

**Example: Register**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "name": "John Manager",
    "password": "securepass123",
    "role": "MANAGER"
  }'
```

**Example: Login**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "securepass123"
  }'
```

#### **🎫 Tickets**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/tickets` | Create new ticket | All |
| `GET` | `/tickets` | List tickets (role-filtered) | All |
| `GET` | `/tickets/search` | Advanced search | All |
| `GET` | `/tickets/{id}` | Get ticket details | All |
| `PUT` | `/tickets/{id}` | Update ticket | All |
| `POST` | `/tickets/{id}/resolve` | Resolve ticket | All |
| `GET` | `/tickets/high-risk` | Get high-risk tickets | All |
| `DELETE` | `/tickets/{id}` | Delete ticket | Manager only |

**Example: Create Ticket**
```bash
curl -X POST "http://localhost:8000/tickets" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server Outage - Production",
    "customer": "Acme Corporation",
    "priority": "CRITICAL",
    "description": "Production server is down, affecting 500+ users"
  }'
```

**Example: Search Tickets**
```bash
curl -X GET "http://localhost:8000/tickets/search?q=server&status=OPEN&priority=CRITICAL" \
  -H "Authorization: Bearer <token>"
```

#### **💬 Comments**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/comments` | Create comment |
| `GET` | `/comments/ticket/{id}` | Get ticket comments |
| `PUT` | `/comments/{id}` | Update comment |
| `DELETE` | `/comments/{id}` | Delete comment |

**Example: Add Comment**
```bash
curl -X POST "http://localhost:8000/comments" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "ticket_id": 1,
    "content": "Working on resolving this issue",
    "is_internal": false
  }'
```

#### **🔔 Notifications**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/notifications` | Get user notifications |
| `POST` | `/notifications/{id}/acknowledge` | Mark as read |
| `POST` | `/notifications/acknowledge-all` | Mark all as read |

#### **📊 Analytics**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/analytics/overview` | Dashboard statistics | All |
| `GET` | `/analytics/risk-distribution` | Risk breakdown | All |
| `GET` | `/analytics/technician-workload` | Workload analysis | Manager only |

**Example: Get Dashboard Overview**
```bash
curl -X GET "http://localhost:8000/analytics/overview" \
  -H "Authorization: Bearer <token>"
```

#### **⚙️ SLA Configuration**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/sla/config` | Get SLA rules | All |
| `PUT` | `/sla/config/{priority}` | Update SLA rule | Manager only |

**Example: Update SLA Config**
```bash
curl -X PUT "http://localhost:8000/sla/config/CRITICAL" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sla_hours": 2
  }'
```

#### **👥 User Management**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/users` | List all users | Manager only |
| `POST` | `/users` | Create new user | Manager only |
| `GET` | `/users/{id}` | Get user details | Manager only |
| `PUT` | `/users/{id}` | Update user | Manager only |
| `DELETE` | `/users/{id}` | Delete user | Manager only |

#### **📋 Activity Logs**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/activity-logs` | Get activity logs |
| `GET` | `/activity-logs/ticket/{id}` | Get ticket activity |

---

## ⚙️ Configuration

### **Backend Configuration**

Create a `.env` file in the `backend/` directory:

```env
# JWT Settings
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database
DATABASE_URL=sqlite:///./sla_guard.db

# Scheduler
SLA_CHECK_INTERVAL_MINUTES=5

# Email Notifications (Optional)
EMAIL_ENABLED=False
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@slaguard.com

# SLA Defaults (hours)
SLA_CRITICAL=4
SLA_HIGH=8
SLA_MEDIUM=24
SLA_LOW=48
```

### **Email Setup (Optional)**

To enable email notifications:

1. **Set `EMAIL_ENABLED=True`** in `.env`
2. **Configure SMTP settings** (Gmail example):
   - Enable 2-factor authentication on your Google account
   - Generate an [App Password](https://myaccount.google.com/apppasswords)
   - Use the app password in `SMTP_PASSWORD`
3. **Restart the backend server**

### **SLA Risk Levels**

| Risk Level | Threshold | Color | Behavior |
|------------|-----------|-------|----------|
| **Safe** | 0-49% | 🟢 Green | Normal monitoring |
| **Warning** | 50-74% | 🟡 Yellow | Increased attention |
| **High Risk** | 75-99% | 🟠 Orange | **Auto-escalation triggered** |
| **Breached** | 100%+ | 🔴 Red | Immediate action required |

### **Priority-Based SLA Defaults**

| Priority | Default SLA | Recommended For |
|----------|-------------|-----------------|
| **CRITICAL** | 4 hours | System outages, security incidents |
| **HIGH** | 8 hours | Major functionality issues |
| **MEDIUM** | 24 hours | Minor bugs, feature requests |
| **LOW** | 48 hours | Documentation, cosmetic issues |

---

## 📖 Usage Guide

### **For Managers**

#### **1. Initial Setup**
1. Register as a manager via API or Swagger UI
2. Login to access the manager dashboard
3. Configure SLA thresholds in Settings
4. Create technician accounts

#### **2. Daily Workflow**
1. **Monitor Dashboard** - View key metrics and high-risk tickets
2. **Review Escalations** - Check email alerts for auto-escalated tickets
3. **Assign Tickets** - Distribute workload among technicians
4. **Analyze Performance** - Review technician workload and SLA compliance
5. **Manage SLA Rules** - Adjust thresholds based on team capacity

#### **3. Advanced Features**
- **Internal Comments** - Add manager-only notes to tickets
- **User Management** - Create, update, or deactivate technician accounts
- **Activity Logs** - Audit trail of all ticket actions
- **Risk Distribution** - Visual analytics of ticket risk levels

### **For Technicians**

#### **1. Daily Workflow**
1. **Login** - Access your personalized dashboard
2. **View Assigned Tickets** - See only tickets assigned to you
3. **Monitor SLA Timers** - Track time remaining for each ticket
4. **Update Progress** - Add public comments to keep team informed
5. **Resolve Tickets** - Mark tickets as resolved when complete

#### **2. Best Practices**
- ✅ Check dashboard at start of shift
- ✅ Prioritize high-risk tickets (orange/red)
- ✅ Add comments when making progress
- ✅ Resolve tickets promptly to maintain SLA compliance
- ✅ Monitor SLA countdown timers

### **Automated Features**

The system automatically handles:

- **SLA Monitoring** - Runs every 5 minutes via background scheduler
- **Risk Calculation** - Updates ticket risk levels in real-time
- **Auto-Escalation** - Escalates tickets at 75% SLA threshold
- **Email Alerts** - Sends HTML notifications to managers (if enabled)
- **Activity Logging** - Records all ticket actions with timestamps

---

## 🔒 Security

### **Built-in Security Features**

- ✅ **JWT Authentication** - Secure token-based authentication with expiration
- ✅ **Bcrypt Password Hashing** - Industry-standard password encryption
- ✅ **Role-Based Access Control (RBAC)** - Manager and Technician permissions
- ✅ **CORS Protection** - Configured for specific origins
- ✅ **SQL Injection Prevention** - SQLAlchemy ORM with parameterized queries
- ✅ **Input Validation** - Pydantic schema validation on all endpoints

### **Production Security Checklist**

> [!CAUTION]
> **Before deploying to production, ensure you complete ALL items below:**

- [ ] Change `SECRET_KEY` to a cryptographically secure random string (min 32 characters)
- [ ] Use HTTPS/SSL for all communications (Let's Encrypt recommended)
- [ ] Switch from SQLite to PostgreSQL or MySQL for production database
- [ ] Implement rate limiting (e.g., using `slowapi` or nginx)
- [ ] Enable security headers (HSTS, CSP, X-Frame-Options)
- [ ] Set up monitoring and logging (e.g., Sentry, ELK stack)
- [ ] Configure firewall rules to restrict database access
- [ ] Regular security audits and dependency updates
- [ ] Implement backup and disaster recovery procedures
- [ ] Use environment-specific `.env` files (never commit to git)

### **Recommended Production Stack**

```
Frontend: Nginx → React (static build)
Backend: Gunicorn → FastAPI → PostgreSQL
Monitoring: Prometheus + Grafana
Logging: ELK Stack (Elasticsearch, Logstash, Kibana)
SSL: Let's Encrypt
```

---

## 🚢 Deployment

### **Backend Deployment**

#### **Using Uvicorn (Development)**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### **Using Gunicorn (Production)**
```bash
pip install gunicorn
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

#### **Systemd Service (Linux)**

Create `/etc/systemd/system/slaguard.service`:

```ini
[Unit]
Description=SLA Guard Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/SLA Guard/backend
Environment="PATH=/path/to/venv/bin"
ExecStart=/path/to/venv/bin/gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable slaguard
sudo systemctl start slaguard
```

### **Frontend Deployment**

#### **Build for Production**
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

#### **Serve with Nginx**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/SLA Guard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### **Docker Deployment** (Optional)

#### **Backend Dockerfile**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

#### **Frontend Dockerfile**
```dockerfile
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **Docker Compose**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/slaguard
    depends_on:
      - db

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: slaguard
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## 🧪 Testing

### **Interactive API Testing**

1. Start the backend server
2. Navigate to **http://localhost:8000/docs**
3. Use the Swagger UI to test endpoints:
   - Register a new user
   - Login to get JWT token
   - Click **"Authorize"** and enter your token
   - Test all endpoints interactively

### **Manual Testing with cURL**

```bash
# 1. Register a manager
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Manager",
    "password": "password123",
    "role": "MANAGER"
  }'

# 2. Login
TOKEN=$(curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | jq -r '.access_token')

# 3. Create a ticket
curl -X POST "http://localhost:8000/tickets" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Ticket",
    "customer": "Test Corp",
    "priority": "HIGH",
    "description": "This is a test ticket"
  }'

# 4. Get analytics
curl -X GET "http://localhost:8000/analytics/overview" \
  -H "Authorization: Bearer $TOKEN"
```

### **Frontend Testing**

1. Start the frontend dev server: `npm run dev`
2. Open **http://localhost:3000**
3. Test user flows:
   - Login as manager
   - Create tickets
   - Assign to technicians
   - Monitor SLA timers
   - Test search and filters

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Commit your changes**
   ```bash
   git commit -m 'Add AmazingFeature: description of changes'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
6. **Open a Pull Request**

### **Code Style Guidelines**

- **Python**: Follow PEP 8, use type hints
- **TypeScript**: Use strict mode, define interfaces
- **Commits**: Use conventional commit messages
- **Documentation**: Update README for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - Initial development and architecture

---

## 🙏 Acknowledgments

- **FastAPI** - For the excellent async web framework
- **React Team** - For the powerful UI library
- **SQLAlchemy** - For robust ORM capabilities
- **APScheduler** - For reliable background job scheduling
- **Tailwind CSS** - For beautiful utility-first styling

---

## 📞 Support

Need help? Here's how to get support:

- 📧 **Email**: support@slaguard.com
- 🐛 **Bug Reports**: [Open an issue](https://github.com/your-repo/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/your-repo/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

## 🗺️ Roadmap

### **Upcoming Features**

- [ ] **Mobile App** - React Native mobile application
- [ ] **Slack Integration** - Real-time notifications in Slack
- [ ] **Advanced Analytics** - ML-based SLA breach prediction
- [ ] **Multi-tenancy** - Support for multiple organizations
- [ ] **Custom Workflows** - Configurable ticket workflows
- [ ] **API Webhooks** - External system integrations
- [ ] **Dark Mode** - UI theme customization
- [ ] **Export Reports** - PDF/Excel report generation

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Made with ❤️ for IT Support Teams**

[⬆ Back to Top](#️-sla-guard)

</div>
