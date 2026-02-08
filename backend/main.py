from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from scheduler import start_scheduler, stop_scheduler
from routers import auth, tickets, notifications, analytics, sla, comments, users, tickets_extended, activity_logs


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("\n" + "="*60)
    print("🚀 Starting SLA Guard Backend Server")
    print("="*60)
    
    # Initialize database
    print("📊 Initializing database...")
    init_db()
    print("✅ Database initialized")
    
    # Start scheduler
    print("⏰ Starting background scheduler...")
    start_scheduler()
    print("✅ Scheduler started")
    
    print("="*60)
    print("✨ SLA Guard Backend is ready!")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("="*60 + "\n")
    
    yield
    
    # Shutdown
    print("\n🛑 Shutting down SLA Guard Backend...")
    stop_scheduler()
    print("✅ Shutdown complete\n")


# Create FastAPI application
app = FastAPI(
    title="SLA Guard API",
    description="Proactive SLA Breach Prevention System - Backend API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(tickets_extended.router)
app.include_router(users.router)
app.include_router(notifications.router)
app.include_router(analytics.router)
app.include_router(sla.router)
app.include_router(comments.router)
app.include_router(activity_logs.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "SLA Guard API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SLA Guard Backend"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
