import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
from config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    """Email notification service"""
    
    def __init__(self):
        self.smtp_server = getattr(settings, 'SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = getattr(settings, 'SMTP_PORT', 587)
        self.smtp_username = getattr(settings, 'SMTP_USERNAME', '')
        self.smtp_password = getattr(settings, 'SMTP_PASSWORD', '')
        self.from_email = getattr(settings, 'FROM_EMAIL', 'noreply@slaguard.com')
        self.enabled = getattr(settings, 'EMAIL_ENABLED', False)
    
    def send_email(self, to_emails: List[str], subject: str, body: str, html_body: str = None):
        """Send email notification"""
        if not self.enabled:
            logger.info(f"Email disabled. Would send: {subject} to {to_emails}")
            return
        
        try:
            msg = MIMEMultipart('alternative')
            msg['From'] = self.from_email
            msg['To'] = ', '.join(to_emails)
            msg['Subject'] = subject
            
            # Add plain text part
            text_part = MIMEText(body, 'plain')
            msg.attach(text_part)
            
            # Add HTML part if provided
            if html_body:
                html_part = MIMEText(html_body, 'html')
                msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_emails}")
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    def send_escalation_email(self, ticket_data: dict, manager_emails: List[str]):
        """Send escalation notification email"""
        subject = f"🚨 SLA Alert: Ticket #{ticket_data['id']} Escalated"
        
        body = f"""
SLA Guard - Escalation Alert

Ticket #{ticket_data['id']} has been escalated due to SLA breach risk.

Ticket Details:
- Title: {ticket_data['title']}
- Customer: {ticket_data['customer']}
- Priority: {ticket_data['priority']}
- Risk Level: {ticket_data['risk_level']}
- SLA Progress: {ticket_data['risk_percentage']:.1f}%
- Time Remaining: {ticket_data['remaining_hours']:.1f} hours

Assigned To: {ticket_data['assignee_name']}

Please take immediate action to prevent SLA breach.

---
SLA Guard System
        """.strip()
        
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
        .content {{ background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }}
        .alert {{ background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }}
        .details {{ background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }}
        .detail-row {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }}
        .label {{ font-weight: bold; color: #6b7280; }}
        .value {{ color: #111827; }}
        .footer {{ text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }}
        .risk-high {{ color: #ef4444; font-weight: bold; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">🚨 SLA Escalation Alert</h2>
        </div>
        <div class="content">
            <div class="alert">
                <strong>Immediate Action Required</strong><br>
                Ticket #{ticket_data['id']} has been escalated due to SLA breach risk.
            </div>
            
            <div class="details">
                <h3 style="margin-top: 0;">Ticket Details</h3>
                <div class="detail-row">
                    <span class="label">Ticket ID:</span>
                    <span class="value">#{ticket_data['id']}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Title:</span>
                    <span class="value">{ticket_data['title']}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Customer:</span>
                    <span class="value">{ticket_data['customer']}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Priority:</span>
                    <span class="value">{ticket_data['priority']}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Risk Level:</span>
                    <span class="value risk-high">{ticket_data['risk_level']}</span>
                </div>
                <div class="detail-row">
                    <span class="label">SLA Progress:</span>
                    <span class="value risk-high">{ticket_data['risk_percentage']:.1f}%</span>
                </div>
                <div class="detail-row">
                    <span class="label">Time Remaining:</span>
                    <span class="value">{ticket_data['remaining_hours']:.1f} hours</span>
                </div>
                <div class="detail-row">
                    <span class="label">Assigned To:</span>
                    <span class="value">{ticket_data['assignee_name']}</span>
                </div>
            </div>
            
            <p style="margin-top: 20px;">
                <strong>Action Required:</strong> Please review this ticket immediately to prevent SLA breach.
            </p>
        </div>
        <div class="footer">
            <p>This is an automated notification from SLA Guard System</p>
        </div>
    </div>
</body>
</html>
        """.strip()
        
        self.send_email(manager_emails, subject, body, html_body)
    
    def send_assignment_email(self, ticket_data: dict, technician_email: str):
        """Send ticket assignment notification"""
        subject = f"New Ticket Assigned: #{ticket_data['id']} - {ticket_data['title']}"
        
        body = f"""
SLA Guard - New Ticket Assignment

You have been assigned a new ticket.

Ticket Details:
- ID: #{ticket_data['id']}
- Title: {ticket_data['title']}
- Customer: {ticket_data['customer']}
- Priority: {ticket_data['priority']}
- SLA Limit: {ticket_data['sla_limit_hours']} hours

Please review and begin work on this ticket.

---
SLA Guard System
        """.strip()
        
        self.send_email([technician_email], subject, body)


# Global email service instance
email_service = EmailService()
