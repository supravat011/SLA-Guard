import React, { useState, useEffect } from 'react';
import { api, TicketResponse } from '../services/api';
import { TrendingUp, AlertOctagon, Clock, Ticket as TicketIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface RiskAnalyticsProps {
    currentPage?: string;
}

const RiskAnalytics: React.FC<RiskAnalyticsProps> = () => {
    const [tickets, setTickets] = useState<TicketResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadData();
        // Refresh every 10 seconds for near real-time updates
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            console.log('[RiskAnalytics] Loading data...');
            const ticketsData = await api.tickets.getAll();
            setTickets(ticketsData);
        } catch (error) {
            console.error('[RiskAnalytics] Error loading data:', error);
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-wide">Risk Analytics</h2>
                    <p className="text-slate-400 text-sm">Deep dive into SLA risks and performance metrics</p>
                </div>
                <button
                    onClick={loadData}
                    className="px-4 py-2 bg-space-800 border border-space-border text-slate-300 rounded-lg text-sm font-medium hover:bg-space-700 hover:text-white transition-colors"
                >
                    Refresh
                </button>
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

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Risk Distribution Chart */}
                <div className="bg-space-800/40 rounded-xl border border-space-border p-6 flex flex-col backdrop-blur-md">
                    <h3 className="font-bold text-lg text-white mb-6">Risk Distribution Overview</h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                </div>

                {/* Extended Stats Panel */}
                <div className="bg-space-800/40 rounded-xl border border-space-border p-6 backdrop-blur-md">
                    <h3 className="font-bold text-lg text-white mb-6">Risk Insights</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-space-900/50 rounded-lg border border-space-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-slate-400 text-sm">Overall Health</span>
                                <span className={`text-sm font-bold ${highRiskCount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {highRiskCount > 0 ? 'Action Required' : 'Healthy'}
                                </span>
                            </div>
                            <div className="w-full bg-space-700 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${highRiskCount > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${Math.max(10, 100 - (highRiskCount * 10))}%` }}
                                ></div>
                            </div>
                        </div>

                        {highRiskCount > 0 && (
                            <div className="flex items-start gap-4 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                                <AlertOctagon className="w-6 h-6 text-rose-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold text-rose-400 text-sm mb-1">Critical Attention Needed</h4>
                                    <p className="text-xs text-rose-300/80 leading-relaxed">
                                        You have {highRiskCount} high-risk tickets that are approaching or have breached their SLA limits.
                                        Immediate intervention is recommended to prevent further SLA violations.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-space-900/50 rounded-lg border border-space-border text-center">
                                <p className="text-2xl font-bold text-white">{((tickets.filter(t => t.status === 'RESOLVED').length / (tickets.length || 1)) * 100).toFixed(0)}%</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Resolution Rate</p>
                            </div>
                            <div className="p-4 bg-space-900/50 rounded-lg border border-space-border text-center">
                                <p className="text-2xl font-bold text-white max-w-full truncate">{tickets.filter(t => t.status === 'OPEN').length}</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">Open Backlog</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalytics;
