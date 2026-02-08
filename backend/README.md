# SLA Guard Backend

FastAPI-based backend system for the SLA Guard application - a proactive SLA breach prevention system for IT support teams.

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server**:
   ```bash
   python main.py
   ```

   Or using uvicorn directly:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the API**:
   - API Base URL: `http://localhost:8000`
   - Interactive Documentation (Swagger): `http://localhost:8000/docs`
   - Alternative Documentation (ReDoc): `http://localhost:8000/redoc`

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── config.py               # Configuration settings
├── database.py             # SQLite database setup
├── models.py               # SQLAlchemy ORM models
├── schemas.py              # Pydantic request/response schemas
├── auth.py                 # JWT authentication utilities
├── scheduler.py            # APScheduler background jobs
├── routers/
│   ├── auth.py            # Authentication endpoints
│   ├── tickets.py         # Ticket management endpoints
│   ├── notifications.py   # Notification endpoints
│   ├── analytics.py       # Analytics & dashboard endpoints
│   └── sla.py             # SLA configuration endpoints
├── services/
│   ├── sla_engine.py      # SLA monitoring & risk calculation
│   └── escalation.py      # Auto-escalation logic
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
└── .gitignore
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Tickets
- `POST /tickets` - Create new ticket
- `GET /tickets` - List tickets (role-filtered)
- `GET /tickets/{id}` - Get ticket details
- `PUT /tickets/{id}` - Update ticket
- `POST /tickets/{id}/resolve` - Mark ticket as resolved
- `GET /tickets/high-risk` - Get high-risk tickets
- `DELETE /tickets/{id}` - Delete ticket (Manager only)

### Notifications
- `GET /notifications` - Get user notifications
- `POST /notifications/{id}/acknowledge` - Mark notification as read
- `POST /notifications/acknowledge-all` - Mark all as read

### Analytics
- `GET /analytics/overview` - Dashboard statistics
- `GET /analytics/risk-distribution` - Risk level breakdown
- `GET /analytics/technician-workload` - Technician workload (Manager only)

### SLA Configuration
- `GET /sla/config` - Get SLA rules
- `PUT /sla/config/{priority}` - Update SLA rule (Manager only)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow
1. Register or login via `/auth/login`
2. Receive JWT token in response
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your_token_here>
   ```

### User Roles
- **MANAGER**: Full access to all tickets and analytics
- **TECHNICIAN**: Access to assigned tickets only

## 📊 Database Schema

### Users
- Email, name, password hash, role
- Created timestamp

### Tickets
- Title, customer, description
- Priority (LOW, MEDIUM, HIGH, CRITICAL)
- Status (OPEN, IN_PROGRESS, RESOLVED, ESCALATED)
- Assignee, SLA limit, risk level
- Timestamps (created, updated, resolved)

### SLA Configurations
- Priority level → SLA hours mapping
- Default values:
  - CRITICAL: 4 hours
  - HIGH: 8 hours
  - MEDIUM: 24 hours
  - LOW: 48 hours

### Notifications
- User, message, type (INFO, WARNING, ALERT)
- Read status, timestamp

### Activity Logs
- Ticket ID, user, action, details
- Timestamp

## ⚙️ Background Scheduler

The system includes an APScheduler background job that runs every 5 minutes to:

1. **Monitor SLA Status**: Calculate elapsed time and risk percentage for all active tickets
2. **Update Risk Levels**: Classify tickets as Safe, Warning, High Risk, or Breached
3. **Auto-Escalate**: Automatically escalate high-risk tickets (≥75%)
4. **Send Notifications**: Alert managers about escalated tickets

### Risk Levels
- **Safe**: 0-49% of SLA time elapsed
- **Warning**: 50-74% of SLA time elapsed
- **High Risk**: 75-99% of SLA time elapsed
- **Breached**: ≥100% of SLA time elapsed

## 🧪 Testing the API

### Using Swagger UI
1. Navigate to `http://localhost:8000/docs`
2. Click "Authorize" button
3. Login to get token
4. Paste token in authorization dialog
5. Test endpoints interactively

### Using curl

**Register a user**:
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "name": "Test Manager",
    "password": "password123",
    "role": "MANAGER"
  }'
```

**Login**:
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "manager@example.com",
    "password": "password123"
  }'
```

**Create a ticket** (with token):
```bash
curl -X POST "http://localhost:8000/tickets" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server Outage",
    "customer": "Acme Corp",
    "priority": "CRITICAL",
    "description": "Production server is down"
  }'
```

## 🔧 Configuration

Edit `.env` file to customize:

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL=sqlite:///./sla_guard.db
```

## 📝 Notes

- The database file (`sla_guard.db`) is created automatically on first run
- Default SLA configurations are seeded on initialization
- Scheduler runs automatically when the server starts
- All timestamps are in UTC

## 🚀 Production Deployment

For production deployment:

1. Change `SECRET_KEY` in `.env` to a secure random string
2. Use a production-grade database (PostgreSQL, MySQL)
3. Set up proper HTTPS/SSL
4. Configure environment-specific CORS origins
5. Use a production ASGI server (Gunicorn + Uvicorn)
6. Set up proper logging and monitoring

---

**Built with FastAPI, SQLAlchemy, and APScheduler**
