from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime
from database import SessionLocal
from services.sla_engine import monitor_all_tickets
from services.escalation import auto_escalate_high_risk_tickets
from config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create scheduler instance
scheduler = BackgroundScheduler()


def sla_monitoring_job():
    """
    Periodic job to monitor SLA status and trigger escalations
    Runs every 5 minutes by default
    """
    logger.info(f"[{datetime.now()}] Running SLA monitoring job...")
    
    db = SessionLocal()
    try:
        # Monitor all tickets and update risk levels
        results = monitor_all_tickets(db)
        
        updated_count = sum(1 for r in results if r['updated'])
        logger.info(f"  ✓ Monitored {len(results)} tickets, {updated_count} risk levels updated")
        
        # Auto-escalate high-risk tickets
        escalation_results = auto_escalate_high_risk_tickets(db)
        escalated_count = sum(1 for r in escalation_results if r.get('escalated', False))
        if escalated_count > 0:
            logger.warning(f"  ⚠️ Auto-escalated {escalated_count} high-risk tickets")
            for result in escalation_results:
                if result.get('escalated', False):
                    logger.warning(f"    - Ticket #{result['ticket_id']}: {result['ticket_title']} ({result['risk_level']})")
        
        logger.info(f"[{datetime.now()}] SLA monitoring job completed\n")
        
    except Exception as e:
        logger.error(f"Error in SLA monitoring job: {str(e)}")
    finally:
        db.close()


def start_scheduler():
    """Start the background scheduler"""
    # Add SLA monitoring job
    scheduler.add_job(
        sla_monitoring_job,
        trigger=IntervalTrigger(minutes=settings.SLA_CHECK_INTERVAL_MINUTES),
        id='sla_monitoring',
        name='SLA Monitoring and Escalation',
        replace_existing=True
    )
    
    scheduler.start()
    logger.info(f"✅ Scheduler started - SLA monitoring every {settings.SLA_CHECK_INTERVAL_MINUTES} minutes")


def stop_scheduler():
    """Stop the background scheduler"""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("🛑 Scheduler stopped")
