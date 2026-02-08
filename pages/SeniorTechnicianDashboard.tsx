import React, { useState, useEffect } from 'react';
import { api, TicketResponse } from '../services/api';
import { AlertOctagon, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import SLAProgressBar from '../components/SLAProgressBar';

const SeniorTechnicianDashboard: React.FC = () => {
    const [escalatedTickets, setEscalatedTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
    const [progressNotes, setProgressNotes] = useState('');

    useEffect(() => {
        loadEscalatedTickets();
        // Refresh every minute for live countdown
        const interval = setInterval(loadEscalatedTickets, 60000);
        return () => clearInterval(interval);
    }, []);

    const loadEscalatedTickets = async () => {
        try {
            const tickets = await api.ticketsExtended.getEscalated();
            setEscalatedTickets(tickets);
        } catch (error) {
            console.error('Error loading escalated tickets:', error);
        }
    };

    const handleAcceptTicket = async (ticketId: number) => {
        setLoading(true);
        try {
            await api.ticketsExtended.accept(ticketId);
            loadEscalatedTickets();
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
            loadEscalatedTickets();
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
            loadEscalatedTickets();
        } catch (error) {
            console.error('Error resolving ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (riskPercentage: number) => {
        if (riskPercentage >= 95) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        if (riskPercentage >= 75) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    const getTimeRemaining = (elapsed: number, limit: number) => {
        const remaining = limit - elapsed;
        if (remaining <= 0) return 'BREACHED';
        const hours = Math.floor(remaining);
        const minutes = Math.floor((remaining - hours) * 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="p-6 space-y-6 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Senior Technician Dashboard</h2>
                    <p className="text-slate-400 text-sm">Handle escalated and critical tickets</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-300 bg-space-800 px-4 py-2 rounded-lg border border-space-border">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        Online
                    </span>
                    <span className="text-space-border">|</span>
                    <span>{escalatedTickets.length} Escalated</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Escalated Tickets</p>
                            <h3 className="text-3xl font-bold text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">{escalatedTickets.length}</h3>
                        </div>
                        <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                            <AlertOctagon className="w-6 h-6 text-rose-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Critical Priority</p>
                            <h3 className="text-3xl font-bold text-amber-400">
                                {escalatedTickets.filter(t => t.priority === 'CRITICAL').length}
                            </h3>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <TrendingUp className="w-6 h-6 text-amber-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Avg Response Time</p>
                            <h3 className="text-3xl font-bold text-emerald-400">2.3h</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <Clock className="w-6 h-6 text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Escalated Tickets List */}
            <div className="space-y-4">
                {escalatedTickets.length === 0 ? (
                    <div className="bg-space-800/40 rounded-xl border border-space-border p-12 text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No Escalated Tickets</h3>
                        <p className="text-slate-400">All tickets are being handled by regular technicians</p>
                    </div>
                ) : (
                    escalatedTickets.map((ticket) => (
                        <div key={ticket.id} className="bg-space-800/40 rounded-xl border border-rose-500/30 overflow-hidden hover:border-rose-500/50 transition-colors backdrop-blur-md">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg border ${getRiskColor(ticket.risk_percentage)}`}>
                                            <AlertOctagon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm font-mono text-slate-500">#{ticket.id}</span>
                                                <StatusBadge status={ticket.status} />
                                                <PriorityBadge priority={ticket.priority} />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{ticket.title}</h3>
                                            <p className="text-sm text-slate-400">{ticket.customer}</p>
                                            {ticket.description && (
                                                <p className="text-sm text-slate-500 mt-2">{ticket.description}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {ticket.status === 'ESCALATED' && (
                                            <button
                                                onClick={() => handleAcceptTicket(ticket.id)}
                                                disabled={loading}
                                                className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 disabled:opacity-50 shadow-glow border border-brand-500/50"
                                            >
                                                Accept Ticket
                                            </button>
                                        )}
                                        {ticket.status === 'IN_PROGRESS' && (
                                            <>
                                                <button
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="px-4 py-2 border border-space-border text-slate-300 rounded-lg text-sm font-medium hover:bg-space-700 hover:text-white"
                                                >
                                                    Update Progress
                                                </button>
                                                <button
                                                    onClick={() => handleResolveTicket(ticket.id)}
                                                    disabled={loading}
                                                    className="px-4 py-2 bg-emerald-600/90 text-white rounded-lg text-sm font-medium hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-emerald-900/20 border border-emerald-500/50"
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
                                        <span className={`text-sm font-bold ${ticket.risk_percentage >= 95 ? 'text-rose-500' : ticket.risk_percentage >= 75 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {getTimeRemaining(ticket.time_elapsed_hours, ticket.sla_limit_hours)} remaining
                                        </span>
                                    </div>
                                    <SLAProgressBar elapsed={ticket.time_elapsed_hours} limit={ticket.sla_limit_hours} />
                                    <div className="mt-2 flex justify-between text-xs text-slate-500">
                                        <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
                                        <span>Limit: {ticket.sla_limit_hours}h</span>
                                    </div>
                                </div>
                            </div>

                            {ticket.status === 'ESCALATED' && (
                                <div className="bg-rose-500/10 px-6 py-3 border-t border-rose-500/20 flex items-center gap-2">
                                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                                    <span className="text-sm text-rose-400 font-medium">
                                        Escalation Reason: High-risk ticket requiring senior expertise
                                    </span>
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
                        <textarea
                            value={progressNotes}
                            onChange={(e) => setProgressNotes(e.target.value)}
                            className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white h-32 mb-4"
                            placeholder="Enter progress notes..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateProgress}
                                disabled={loading || !progressNotes}
                                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update'}
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

export default SeniorTechnicianDashboard;
