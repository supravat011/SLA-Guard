import React, { useState, useEffect } from 'react';
import { api, TicketResponse } from '../services/api';
import SLAProgressBar from '../components/SLAProgressBar';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { Clock, CheckCircle, AlertCircle, PlayCircle, MessageSquare } from 'lucide-react';

const TechnicianDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
  const [progressNotes, setProgressNotes] = useState('');

  useEffect(() => {
    loadTickets();
    // Refresh every minute for live SLA countdown
    const interval = setInterval(loadTickets, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadTickets = async () => {
    try {
      // Get tickets assigned to current technician
      const ticketsData = await api.tickets.getAll();
      setTickets(ticketsData);
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const handleAcceptTicket = async (ticketId: number) => {
    setLoading(true);
    try {
      await api.ticketsExtended.accept(ticketId);
      loadTickets();
    } catch (error) {
      console.error('Error accepting ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedTicket || !progressNotes) return;
    setLoading(true);
    try {
      await api.ticketsExtended.updateProgress(selectedTicket.id, progressNotes);
      setProgressNotes('');
      setSelectedTicket(null);
      loadTickets();
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveTicket = async (ticketId: number) => {
    setLoading(true);
    try {
      await api.tickets.resolve(ticketId);
      loadTickets();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (elapsed: number, limit: number) => {
    const remaining = limit - elapsed;
    if (remaining <= 0) return 'BREACHED';
    const hours = Math.floor(remaining);
    const minutes = Math.floor((remaining - hours) * 60);
    return `${hours}h ${minutes}m remaining`;
  };

  const getRiskColor = (riskPercentage: number) => {
    if (riskPercentage >= 95) return 'text-rose-500';
    if (riskPercentage >= 75) return 'text-amber-500';
    return 'text-emerald-500';
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">My Workspace</h2>
          <p className="text-slate-400 text-sm">Prioritize tickets based on SLA timers</p>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-300 bg-space-800 px-4 py-2 rounded-lg border border-space-border">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Online
          </span>
          <span className="text-space-border">|</span>
          <span>{tickets.length} Tickets</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.length === 0 ? (
          <div className="bg-space-800/40 rounded-xl border border-space-border p-12 text-center">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Assigned Tickets</h3>
            <p className="text-slate-400">You're all caught up! New tickets will appear here when assigned.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-space-800/40 rounded-xl border border-space-border overflow-hidden hover:border-brand-500/30 transition-colors backdrop-blur-md">
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg border ${ticket.priority === 'CRITICAL'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
                      }`}>
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-mono text-slate-500">#{ticket.id}</span>
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                      </div>
                      <h3 className="text-lg font-bold text-white">{ticket.title}</h3>
                      <p className="text-sm text-slate-400">{ticket.customer}</p>
                      {ticket.description && (
                        <p className="text-sm text-slate-500 mt-2">{ticket.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {ticket.status === 'OPEN' && (
                      <button
                        onClick={() => handleAcceptTicket(ticket.id)}
                        disabled={loading}
                        className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 disabled:opacity-50 shadow-glow border border-brand-500/50 flex items-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Accept Ticket
                      </button>
                    )}
                    {ticket.status === 'IN_PROGRESS' && (
                      <>
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="px-4 py-2 border border-space-border text-slate-300 rounded-lg text-sm font-medium hover:bg-space-700 hover:text-white transition-colors flex items-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Update Progress
                        </button>
                        <button
                          onClick={() => handleResolveTicket(ticket.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-emerald-600/90 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 flex items-center gap-2 shadow-lg shadow-emerald-900/20 border border-emerald-500/50 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark Resolved
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* SLA Timer */}
                <div className="bg-space-900/50 rounded-xl p-4 border border-space-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-semibold text-slate-200">SLA Timer</span>
                    </div>
                    <span className={`text-sm font-bold ${getRiskColor(ticket.risk_percentage)}`}>
                      {getTimeRemaining(ticket.time_elapsed_hours, ticket.sla_limit_hours)}
                    </span>
                  </div>
                  <SLAProgressBar elapsed={ticket.time_elapsed_hours} limit={ticket.sla_limit_hours} />
                  <div className="mt-2 flex justify-between text-xs text-slate-500">
                    <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
                    <span>Limit: {ticket.sla_limit_hours}h</span>
                  </div>
                </div>
              </div>

              {ticket.status === 'IN_PROGRESS' && (
                <div className="bg-space-900/30 px-6 py-3 border-t border-space-border flex justify-between items-center">
                  <span className="text-xs text-slate-500">Status: Working on ticket</span>
                  <span className="text-xs text-brand-400">In Progress</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Progress Update Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-800 rounded-xl border border-space-border max-w-lg w-full p-6">
            <h3 className="text-lg font-bold text-white mb-4">Update Progress - #{selectedTicket.id}</h3>
            <p className="text-sm text-slate-400 mb-4">{selectedTicket.title}</p>
            <textarea
              value={progressNotes}
              onChange={(e) => setProgressNotes(e.target.value)}
              className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white h-32 mb-4"
              placeholder="Enter progress notes (e.g., 'Diagnosed issue, replacing network card...')"
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdateProgress}
                disabled={loading || !progressNotes}
                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Progress'}
              </button>
              <button
                onClick={() => {
                  setSelectedTicket(null);
                  setProgressNotes('');
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

export default TechnicianDashboard;