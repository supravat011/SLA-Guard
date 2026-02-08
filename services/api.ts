import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  role: 'MANAGER' | 'TECHNICIAN';
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'MANAGER' | 'TECHNICIAN';
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface TicketCreate {
  title: string;
  customer: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  assignee_id?: number;
}

export interface TicketResponse {
  id: number;
  title: string;
  customer: string;
  description?: string;
  priority: string;
  status: string;
  assignee_id?: number;
  assignee_name?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  sla_limit_hours: number;
  time_elapsed_hours: number;
  risk_level: string;
  risk_percentage: number;
}

export interface NotificationResponse {
  id: number;
  user_id: number;
  message: string;
  type: 'INFO' | 'WARNING' | 'ALERT';
  read: boolean;
  created_at: string;
  ticket_id?: number;
}

export interface AnalyticsOverview {
  total_tickets: number;
  high_risk_tickets: number;
  breached_tickets: number;
  avg_resolution_hours: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  escalated_tickets: number;
}

// API Service
export const api = {
  // Authentication
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },

    register: async (data: RegisterData): Promise<User> => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
  },

  // Tickets
  tickets: {
    getAll: async (params?: { status?: string; priority?: string }): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/tickets', { params });
      return response.data;
    },

    getById: async (id: number): Promise<TicketResponse> => {
      const response = await apiClient.get(`/tickets/${id}`);
      return response.data;
    },

    create: async (data: TicketCreate): Promise<TicketResponse> => {
      const response = await apiClient.post('/tickets', data);
      return response.data;
    },

    update: async (id: number, data: Partial<TicketCreate>): Promise<TicketResponse> => {
      const response = await apiClient.put(`/tickets/${id}`, data);
      return response.data;
    },

    resolve: async (id: number): Promise<TicketResponse> => {
      const response = await apiClient.post(`/tickets/${id}/resolve`);
      return response.data;
    },

    getHighRisk: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/tickets/high-risk');
      return response.data;
    },

    delete: async (id: number): Promise<void> => {
      await apiClient.delete(`/tickets/${id}`);
    },
  },

  // Notifications
  notifications: {
    getAll: async (unreadOnly: boolean = false): Promise<NotificationResponse[]> => {
      const response = await apiClient.get('/notifications', {
        params: { unread_only: unreadOnly }
      });
      return response.data;
    },

    acknowledge: async (id: number): Promise<NotificationResponse> => {
      const response = await apiClient.post(`/notifications/${id}/acknowledge`);
      return response.data;
    },

    acknowledgeAll: async (): Promise<void> => {
      await apiClient.post('/notifications/acknowledge-all');
    },
  },

  // Analytics
  analytics: {
    getOverview: async (): Promise<AnalyticsOverview> => {
      const response = await apiClient.get('/analytics/overview');
      return response.data;
    },

    getRiskDistribution: async () => {
      const response = await apiClient.get('/analytics/risk-distribution');
      return response.data;
    },

    getTechnicianWorkload: async () => {
      const response = await apiClient.get('/analytics/technician-workload');
      return response.data;
    },
  },

  // User Tickets
  users: {
    createTicket: async (data: { title: string; description?: string; priority: string }): Promise<TicketResponse> => {
      const response = await apiClient.post('/users/tickets', data);
      return response.data;
    },

    getMyTickets: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/users/tickets/my-tickets');
      return response.data;
    },

    getClosedTickets: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/users/tickets/closed');
      return response.data;
    },

    getActiveTickets: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/users/tickets/active');
      return response.data;
    },

    getHighPriorityTickets: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/users/tickets/high-priority');
      return response.data;
    },

    getBreachedTickets: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/users/tickets/breached');
      return response.data;
    },
  },

  // Extended Ticket Operations
  ticketsExtended: {
    escalate: async (ticketId: number): Promise<TicketResponse> => {
      const response = await apiClient.post(`/tickets/${ticketId}/escalate`);
      return response.data;
    },

    reassign: async (ticketId: number, newAssigneeId: number): Promise<TicketResponse> => {
      const response = await apiClient.post(`/tickets/${ticketId}/reassign`, null, {
        params: { new_assignee_id: newAssigneeId }
      });
      return response.data;
    },

    accept: async (ticketId: number): Promise<TicketResponse> => {
      const response = await apiClient.post(`/tickets/${ticketId}/accept`);
      return response.data;
    },

    getEscalated: async (): Promise<TicketResponse[]> => {
      const response = await apiClient.get('/tickets/escalated');
      return response.data;
    },

    updateProgress: async (ticketId: number, notes: string): Promise<TicketResponse> => {
      const response = await apiClient.post(`/tickets/${ticketId}/update-progress`, null, {
        params: { notes }
      });
      return response.data;
    },
  },

  // SLA Config
  sla: {
    getConfig: async () => {
      const response = await apiClient.get('/sla/config');
      return response.data;
    },

    updateConfig: async (priority: string, sla_hours: number) => {
      const response = await apiClient.put(`/sla/config/${priority}`, { sla_hours });
      return response.data;
    },
  },
};

export default api;
