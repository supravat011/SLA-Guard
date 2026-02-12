import React, { useState, useEffect } from 'react';
import { TicketPriority } from '../types';
import { api, TicketResponse } from '../services/api';
import { Plus, Clock, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../components/StatusBadge';
import SLAProgressBar from '../components/SLAProgressBar';

interface UserDashboardProps {
    currentPage?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ currentPage = 'dashboard' }) => {
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [activeTickets, setActiveTickets] = useState<TicketResponse[]>([]);
    const [highPriorityTickets, setHighPriorityTickets] = useState<TicketResponse[]>([]);
    const [breachedTickets, setBreachedTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM' as string
    });

    useEffect(() => {
        loadTickets();
        // Refresh every 10 seconds for near real-time updates
        const interval = setInterval(loadTickets, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadTickets = async () => {
        try {
            const [myTickets, active, highPriority, breached] = await Promise.all([
                api.users.getMyTickets(),
                api.users.getActiveTickets(),
                api.users.getHighPriorityTickets(),
                api.users.getBreachedTickets()
            ]);
            setTickets(myTickets);
            setActiveTickets(active);
            setHighPriorityTickets(highPriority);
            setBreachedTickets(breached);
        } catch (error) {
            console.error('Error loading tickets:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await api.users.createTicket(formData);
            setSuccess('Ticket created successfully!');
            setShowForm(false);
            setFormData({ title: '', description: '', priority: 'MEDIUM' });
            loadTickets();

            // Immediately refresh to show the new ticket
            await loadTickets();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error: any) {
            console.error('Error creating ticket:', error);

            // Check if it's an authentication error
            if (error.response?.status === 401) {
                setError('You must be logged in to create a ticket. Please log in with user@company.com / password123');
            } else if (error.response?.data?.detail) {
                setError(`Error: ${error.response.data.detail}`);
            } else {
                setError('Failed to create ticket. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-full">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">My Tickets</h2>
                    <p className="text-slate-400 text-sm">Raise and track your support requests</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-500 shadow-glow border border-brand-500/50 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Raise Ticket
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{success}</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Raise Ticket Form */}
            {showForm && (
                <div className="bg-space-800/50 backdrop-blur-sm p-6 rounded-xl border border-space-border">
                    <h3 className="text-lg font-bold text-white mb-4">Create New Ticket</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Issue Title *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white"
                                required
                                placeholder="Brief description of the issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white h-24"
                                placeholder="Detailed description of the issue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Priority *</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                className="w-full px-4 py-2 bg-space-950/50 border border-space-border rounded-lg focus:ring-1 focus:ring-brand-500 focus:border-brand-500 outline-none text-white"
                            >
                                <option value="MEDIUM">Normal</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-500 disabled:opacity-50"
                            >
                                {loading ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-space-700 text-slate-300 rounded-lg font-medium hover:bg-space-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-space-800/50 backdrop-blur-sm p-5 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Active Tickets</p>
                            <h3 className="text-2xl font-bold text-white">{activeTickets.length}</h3>
                        </div>
                        <div className="p-2 bg-brand-500/10 rounded-lg border border-brand-500/20">
                            <Clock className="w-5 h-5 text-brand-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-space-800/50 backdrop-blur-sm p-5 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">High Priority</p>
                            <h3 className="text-2xl font-bold text-amber-400">{highPriorityTickets.length}</h3>
                        </div>
                        <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-space-800/50 backdrop-blur-sm p-5 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">SLA Breached</p>
                            <h3 className="text-2xl font-bold text-rose-400">{breachedTickets.length}</h3>
                        </div>
                        <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
                            <XCircle className="w-5 h-5 text-rose-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-space-800/50 backdrop-blur-sm p-5 rounded-xl border border-space-border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Total Tickets</p>
                            <h3 className="text-2xl font-bold text-emerald-400">{tickets.length}</h3>
                        </div>
                        <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tickets Table */}
            <div className="bg-space-800/40 rounded-xl border border-space-border overflow-hidden backdrop-blur-md">
                <div className="p-6 border-b border-space-border bg-space-800/30">
                    <h3 className="font-bold text-lg text-white">My Tickets</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-space-800/80 text-slate-300 font-semibold uppercase text-xs tracking-wider border-b border-space-border">
                            <tr>
                                <th className="px-6 py-4">Ticket ID</th>
                                <th className="px-6 py-4">Issue</th>
                                <th className="px-6 py-4">Priority</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">SLA Status</th>
                                <th className="px-6 py-4">Created</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-space-border">
                            {tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No tickets found. Click "Raise Ticket" to create one.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-space-700/30 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-200">#{ticket.id}</td>
                                        <td className="px-6 py-4">{ticket.title}</td>
                                        <td className="px-6 py-4">
                                            <PriorityBadge priority={ticket.priority} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={ticket.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <SLAProgressBar elapsed={ticket.time_elapsed_hours} limit={ticket.sla_limit_hours} />
                                        </td>
                                        <td className="px-6 py-4 text-xs">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
