# 🛡️ SLA Guard

> **Intelligent SLA Breach Prevention System** - Proactive ticket monitoring with automated escalation, real-time risk assessment, and comprehensive analytics for IT support teams.

<div align="center">

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

[Features](#-key-features) • [Quick Start](#-quick-start) • [Documentation](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Configuration](#-configuration)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**SLA Guard** is a next-generation Service Level Agreement (SLA) breach prevention system designed to help IT support teams proactively monitor, track, and prevent SLA violations before they occur. Built with modern web technologies, it provides real-time risk assessment, intelligent escalation, and role-based dashboards for managers, technicians, senior technicians, and end users.

### Why SLA Guard?

Traditional ticketing systems are **reactive** - they notify you *after* an SLA breach occurs. SLA Guard is **proactive** - it predicts and prevents breaches before they happen through:

- 🔮 **Predictive Risk Assessment** - Dynamic risk calculation based on elapsed time and SLA thresholds
- ⚡ **Automated Escalation** - Intelligent auto-escalation at 75% SLA threshold to senior technicians
- 📊 **Real-time Monitoring** - Background scheduler checks ticket status every 5 minutes
- 🎯 **Role-based Workflows** - Specialized dashboards for all user types
- 📧 **Smart Notifications** - Email alerts with actionable insights
- 💬 **Collaborative Comments** - Public and internal comment system for team coordination
- 📝 **Activity Logging** - Complete audit trail of all ticket actions

---

## ✨ Key Features

### 🎛️ **For Managers**

- **📊 Comprehensive Dashboard**
  - Real-time SLA breach metrics
  - High-risk ticket monitoring
  - Average resolution time tracking
  - Technician workload distribution

- **👥 Team Management**
  - Assign tickets to technicians
  - Escalate high-risk tickets to senior technicians
  - Reassign tickets for workload balancing
  - View technician performance analytics

- **⚙️ System Configuration**
  - Customize SLA thresholds by priority (CRITICAL, HIGH, MEDIUM, LOW)
  - Configure email notification settings
  - Manage escalation rules
  - Set risk level thresholds

- **💬 Advanced Communication**
  - Internal comments (manager-only)
  - Public comments (team-wide)
  - Email notification system
  - Escalation alerts

### 🔧 **For Technicians**

- **🎯 Personalized Workspace**
  - View only assigned tickets
  - SLA timer with visual countdown
  - Color-coded priority indicators
  - Quick resolve actions

- **📝 Ticket Management**
  - Accept assigned tickets
  - Update ticket status (IN_PROGRESS)
  - Add public comments
  - Track activity history
  - Monitor SLA progress with real-time countdown

### 👨‍💼 **For Senior Technicians**

- **🚨 Escalation Management**
  - View all escalated tickets
  - Accept high-risk escalations
  - Update progress with detailed notes
  - Resolve complex issues

- **📊 Enhanced Visibility**
  - Priority access to critical tickets
  - Advanced ticket filtering
  - Comprehensive activity logs
  - Performance metrics

### 👤 **For End Users**

- **🎫 Self-Service Portal**
  - Raise new support tickets
  - Track ticket status in real-time
  - View SLA progress
  - Monitor ticket history

- **📊 Personal Dashboard**
  - View all submitted tickets
  - Active tickets count
  - High-priority tickets
  - SLA breach notifications
  - Closed tickets history

---

## 🛠️ Technology Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | Modern UI library with hooks |
| **TypeScript** | 5.8.2 | Type-safe development |
| **Vite** | 6.4.1 | Lightning-fast build tool |
| **React Router DOM** | 7.13.0 | Client-side routing |
| **Axios** | 1.13.4 | HTTP client with interceptors |
| **Lucide React** | 0.563.0 | Beautiful icon library |
| **Tailwind CSS** | Custom | Utility-first styling |

### **Backend**

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
git clone https://github.com/supravat011/SLA-Guard.git
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
# Copy .env.example to .env and configure

# Seed the database with sample data
python seed_data.py

# Start the server
uvicorn main:app --reload
```

✅ Backend will start on **http://localhost:8000**

#### **3️⃣ Frontend Setup**

```bash
# From project root
npm install

# Start development server
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

### **Test Credentials**

After running `seed_data.py`, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Manager** | manager@company.com | password123 |
| **Technician** | tech1@company.com | password123 |
| **Senior Technician** | senior1@company.com | password123 |
| **User** | user@company.com | password123 |

---

## 📁 Project Structure

```
SLA Guard/
├── 📁 backend/                      # FastAPI Backend
│   ├── 📄 main.py                  # Application entry point
│   ├── 📄 config.py                # Configuration settings
│   ├── 📄 database.py              # Database setup & session
│   ├── 📄 auth.py                  # JWT authentication
│   ├── 📄 scheduler.py             # Background job scheduler
│   ├── 📄 models.py                # SQLAlchemy models
│   ├── 📄 models_comments.py       # Comment model
│   ├── 📄 schemas.py               # Pydantic schemas
│   ├── 📄 schemas_tickets.py       # Ticket schemas
│   ├── 📄 schemas_comments.py      # Comment schemas
│   │
│   ├── 📁 routers/                 # API Endpoints
│   │   ├── auth.py                 # Authentication routes
│   │   ├── tickets.py              # Ticket CRUD operations
│   │   ├── tickets_extended.py     # Escalation & reassignment
│   │   ├── users.py                # User ticket management
│   │   ├── comments.py             # Comment system
│   │   ├── notifications.py        # Notification management
│   │   ├── analytics.py            # Analytics & reporting
│   │   ├── sla.py                  # SLA configuration
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
│   ├── SeniorTechnicianDashboard.tsx # Senior tech workspace
│   └── UserDashboard.tsx           # End user portal
│
├── 📁 components/                   # React Components
│   ├── Header.tsx                  # Navigation header
│   ├── StatusBadge.tsx             # Status & priority badges
│   ├── SLAProgressBar.tsx          # SLA timer component
│   ├── TicketDetailsModal.tsx      # Ticket details popup
│   ├── ActivityLogViewer.tsx       # Activity log display
│   └── TicketComments.tsx          # Comment system UI
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

### **Key Endpoints**

#### **🔐 Authentication**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login and get JWT token | ❌ |

#### **🎫 Tickets**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/tickets` | Create new ticket | Manager |
| `GET` | `/tickets` | List tickets (role-filtered) | All |
| `GET` | `/tickets/{id}` | Get ticket details | All |
| `PUT` | `/tickets/{id}` | Update ticket | All |
| `POST` | `/tickets/{id}/resolve` | Resolve ticket | All |
| `POST` | `/tickets/{id}/escalate` | Escalate to senior tech | Manager |
| `POST` | `/tickets/{id}/reassign` | Reassign ticket | Manager |
| `POST` | `/tickets/{id}/accept` | Accept assigned ticket | Technician |

#### **👥 User Tickets**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/users/tickets` | User raises ticket | User |
| `GET` | `/users/tickets/my-tickets` | Get user's tickets | User |
| `GET` | `/users/tickets/active` | Get active tickets | User |
| `GET` | `/users/tickets/high-priority` | Get high-priority tickets | User |
| `GET` | `/users/tickets/breached` | Get SLA breached tickets | User |

#### **💬 Comments**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/comments` | Create comment |
| `GET` | `/comments/ticket/{id}` | Get ticket comments |
| `PUT` | `/comments/{id}` | Update comment |
| `DELETE` | `/comments/{id}` | Delete comment |

#### **📊 Analytics**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/analytics/overview` | Dashboard statistics | All |
| `GET` | `/analytics/risk-distribution` | Risk breakdown | All |
| `GET` | `/analytics/technician-workload` | Workload analysis | Manager |

For complete API documentation, visit **http://localhost:8000/docs** after starting the backend.

---

## 👥 User Roles

### **USER**
- Raise support tickets
- View own tickets
- Track ticket status
- Monitor SLA progress

### **TECHNICIAN**
- View assigned tickets
- Accept ticket assignments
- Update ticket status
- Add public comments
- Resolve tickets

### **SENIOR_TECHNICIAN**
- All technician permissions
- View escalated tickets
- Handle high-risk tickets
- Update progress with notes

### **MANAGER**
- All system permissions
- Assign tickets to technicians
- Escalate tickets to senior technicians
- Reassign tickets
- Configure SLA settings
- View analytics and reports
- Add internal comments

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

## 🔒 Security

### **Built-in Security Features**

- ✅ **JWT Authentication** - Secure token-based authentication with expiration
- ✅ **Bcrypt Password Hashing** - Industry-standard password encryption
- ✅ **Role-Based Access Control (RBAC)** - Four-tier permission system
- ✅ **CORS Protection** - Configured for specific origins
- ✅ **SQL Injection Prevention** - SQLAlchemy ORM with parameterized queries
- ✅ **Input Validation** - Pydantic schema validation on all endpoints

### **Production Security Checklist**

> [!CAUTION]
> **Before deploying to production, ensure you complete ALL items below:**

- [ ] Change `SECRET_KEY` to a cryptographically secure random string (min 32 characters)
- [ ] Use HTTPS/SSL for all communications
- [ ] Switch from SQLite to PostgreSQL or MySQL
- [ ] Implement rate limiting
- [ ] Enable security headers (HSTS, CSP, X-Frame-Options)
- [ ] Set up monitoring and logging
- [ ] Configure firewall rules
- [ ] Regular security audits and dependency updates
- [ ] Implement backup and disaster recovery
- [ ] Use environment-specific `.env` files (never commit to git)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [SQLAlchemy](https://www.sqlalchemy.org/) - Python SQL toolkit
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<div align="center">

**[⬆ Back to Top](#️-sla-guard)**

Made with 💙 by the SLA Guard Team

</div>
