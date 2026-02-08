export enum UserRole {
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  SENIOR_TECHNICIAN = 'SENIOR_TECHNICIAN',
  USER = 'USER'
}

export enum TicketPriority {
  LOW = 'Low',
  NORMAL = 'Normal',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum TicketStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  ESCALATED = 'Escalated'
}

export enum RiskLevel {
  SAFE = 'Safe',
  WARNING = 'Warning',
  HIGH_RISK = 'High Risk',
  BREACHED = 'Breached'
}

export interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: string; // Technician Name
  createdAt: string; // ISO String
  slaLimitHours: number;
  timeElapsedHours: number; // Simulated elapsed time
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}