import React, { useState, useEffect } from 'react';
import { api, TicketResponse } from '../services/api';
import SLAProgressBar from '../components/SLAProgressBar';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { TrendingUp, AlertOctagon, Clock, Users, UserPlus, ArrowUpCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const ManagerDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [seniorTechnicians, setSeniorTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [assigneeId, setAssigneeId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
    // Refresh every minute for live SLA updates
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ticketsData, analyticsData] = await Promise.all([
        api.tickets.getAll(),
        api.analytics.getTechnicianWorkload()
      ]);
      setTickets(ticketsData);

      // Extract technicians and senior technicians from workload data
      if (analyticsData && Array.isArray(analyticsData)) {
        const techs = analyticsData.filter((u: any) => u.role === 'TECHNICIAN');
        const seniors = analyticsData.filter((u: any) => u.role === 'SENIOR_TECHNICIAN');
        setTechnicians(techs);
        setSeniorTechnicians(seniors);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAssign = async (ticketId: number) => {
    if (!assigneeId) return;
    setLoading(true);
    try {
      await api.ticketsExtended.reassign(ticketId, assigneeId);
      setSelectedTicket(null);
      setAssigneeId(null);
      loadData();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async (ticketId: number) => {
    setLoading(true);
    try {
      await api.ticketsExtended.escalate(ticketId);
      loadData();
    } catch (error) {
      console.error('Error escalating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  // Compute Stats
  const totalTickets = tickets.length;
  const highRiskCount = tickets.filter(t => t.risk_percentage >= 75).length;
  const breachedCount = tickets.filter(t => t.time_elapsed_hours > t.sla_limit_hours).length;
  const avgResolution = tickets.length > 0
    ? (tickets.reduce((sum, t) => sum + t.time_elapsed_hours, 0) / tickets.length).toFixed(1)
    : '0.0';

  const riskData = [
    { name: 'Safe', value: tickets.filter(t => t.risk_percentage < 50).length, color: '#10b981' },
    { name: 'Warning', value: tickets.filter(t => t.risk_percentage >= 50 && t.risk_percentage < 75).length, color: '#fbbf24' },
    { name: 'High Risk', value: tickets.filter(t => t.risk_percentage >= 75 && t.risk_percentage < 100).length, color: '#f43f5e' },
    { name: 'Breached', value: breachedCount, color: '#64748b' },
  ];

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">Manager Overview</h2>
          <p className="text-slate-400 text-sm">Real-time risk monitoring and SLA tracking</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadData}
            className="px-4 py-2 bg-space-800 border border-space-border text-slate-300 rounded-lg text-sm font-medium hover:bg-space-700 hover:text-white transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border flex items-start justify-between group hover:border-brand-500/30 transition-colors">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Active Tickets</p>
            <h3 className="text-3xl font-bold text-white">{totalTickets}</h3>
          </div>
          <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20 group-hover:bg-brand-500/20 transition-colors">
            <TicketIcon className="w-6 h-6 text-brand-400" />
          </div>
        </div>

        <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border flex items-start justify-between group hover:border-rose-500/30 transition-colors">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">High Risk Tickets</p>
            <h3 className="text-3xl font-bold text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">{highRiskCount}</h3>
          </div>
          <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
            <TrendingUp className="w-6 h-6 text-rose-500" />
          </div>
        </div>

        <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border flex items-start justify-between group hover:border-slate-500/30 transition-colors">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">SLA Breaches</p>
            <h3 className="text-3xl font-bold text-slate-200">{breachedCount}</h3>
          </div>
          <div className="p-2 bg-slate-700/30 rounded-lg border border-slate-600/30 group-hover:bg-slate-700/50 transition-colors">
            <AlertOctagon className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border flex items-start justify-between group hover:border-emerald-500/30 transition-colors">
          <div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Avg Resolution Time</p>
            <h3 className="text-3xl font-bold text-emerald-400">{avgResolution}h</h3>
          </div>
          <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Ticket Table (Takes up 2 cols) */}
        <div className="lg:col-span-2 bg-space-800/40 rounded-xl border border-space-border overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-space-border flex justify-between items-center bg-space-800/30">
            <h3 className="font-bold text-lg text-white">Priority Tickets</h3>
            <span className="text-sm text-slate-400">{tickets.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-space-800/80 text-slate-300 font-semibold uppercase text-xs tracking-wider border-b border-space-border">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Assignee</th>
                  <th className="px-6 py-4 w-1/4">SLA Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-space-border">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-space-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-200">#{ticket.id}</td>
                      <td className="px-6 py-4">{ticket.title}</td>
                      <td className="px-6 py-4"><PriorityBadge priority={ticket.priority} /></td>
                      <td className="px-6 py-4">{ticket.assignee_name || 'Unassigned'}</td>
                      <td className="px-6 py-4">
                        <SLAProgressBar elapsed={ticket.time_elapsed_hours} limit={ticket.sla_limit_hours} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!ticket.assignee_id && (
                            <button
                              onClick={() => setSelectedTicket(ticket.id)}
                              className="p-1.5 bg-brand-500/10 text-brand-400 rounded hover:bg-brand-500/20 border border-brand-500/20"
                              title="Assign"
                            >
                              <UserPlus className="w-4 h-4" />
                            </button>
                          )}
                          {ticket.risk_percentage >= 75 && ticket.status !== 'ESCALATED' && (
                            <button
                              onClick={() => handleEscalate(ticket.id)}
                              disabled={loading}
                              className="p-1.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500/20 border border-rose-500/20 disabled:opacity-50"
                              title="Escalate to Senior"
                            >
                              <ArrowUpCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics (Takes up 1 col) */}
        <div className="bg-space-800/40 rounded-xl border border-space-border p-6 flex flex-col backdrop-blur-md">
          <h3 className="font-bold text-lg text-white mb-6">Risk Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2E3248" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0B0C15', borderColor: '#2E3248', color: '#fff' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-space-border">
            {highRiskCount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-rose-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-rose-400">Urgent Attention</p>
                  <p className="text-xs text-rose-500/70">{highRiskCount} tickets require immediate action</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-800 rounded-xl border border-space-border max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Assign Ticket #{selectedTicket}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Select Technician</label>
              <select
                value={assigneeId || ''}
                onChange={(e) => setAssigneeId(Number(e.target.value))}
                className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white"
              >
                <option value="">Choose technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name} ({tech.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleAssign(selectedTicket)}
                disabled={loading || !assigneeId}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setAssigneeId(null);
                }}
                className="px-6 py-2 bg-space-700 text-slate-300 rounded-lg font-medium hover:bg-space-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Icon component
const TicketIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

export default ManagerDashboard;