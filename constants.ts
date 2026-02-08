import { Ticket, TicketPriority, TicketStatus, UserRole, Notification } from './types';

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    message: 'Ticket #TK-9082 is approaching SLA breach (90%)',
    type: 'alert',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: '2',
    message: 'New critical ticket assigned to John Doe',
    type: 'warning',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    message: 'Weekly SLA report is ready',
    type: 'info',
    timestamp: '2 hours ago',
    read: true,
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'TK-9082',
    title: 'Server Outage in US-East Region',
    customer: 'Acme Corp',
    priority: TicketPriority.CRITICAL,
    status: TicketStatus.ESCALATED,
    assignee: 'Sarah Connor',
    createdAt: new Date(Date.now() - 3.8 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 4,
    timeElapsedHours: 3.85, // 96% - High Risk/Breaching
  },
  {
    id: 'TK-8821',
    title: 'Database Latency Issues',
    customer: 'Globex Inc',
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
    assignee: 'John Smith',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 8,
    timeElapsedHours: 6.5, // 81% - High Risk
  },
  {
    id: 'TK-7742',
    title: 'User Access Request',
    customer: 'Soylent Corp',
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    assignee: 'Unassigned',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 24,
    timeElapsedHours: 2, // 8% - Safe
  },
  {
    id: 'TK-9921',
    title: 'API Gateway 502 Errors',
    customer: 'Umbrella Corp',
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
    assignee: 'Sarah Connor',
    createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 8,
    timeElapsedHours: 5.6, // 70% - Warning
  },
  {
    id: 'TK-6621',
    title: 'Password Reset',
    customer: 'Initech',
    priority: TicketPriority.LOW,
    status: TicketStatus.RESOLVED,
    assignee: 'Mike Bolton',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 48,
    timeElapsedHours: 4, // Safe
  },
  {
    id: 'TK-9111',
    title: 'Payment Gateway Failure',
    customer: 'Massive Dynamic',
    priority: TicketPriority.CRITICAL,
    status: TicketStatus.OPEN,
    assignee: 'John Smith',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    slaLimitHours: 4,
    timeElapsedHours: 1.5, // 37% - Safe
  }
];

export const MOCK_USERS = [
  { id: 'u1', name: 'Alice Manager', role: UserRole.MANAGER, email: 'alice@company.com' },
  { id: 'u2', name: 'Sarah Connor', role: UserRole.TECHNICIAN, email: 'sarah@company.com' },
  { id: 'u3', name: 'John Smith', role: UserRole.TECHNICIAN, email: 'john@company.com' },
];