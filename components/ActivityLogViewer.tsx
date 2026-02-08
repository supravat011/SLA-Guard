import React, { useState, useEffect } from 'react';
import { Clock, User, FileText } from 'lucide-react';

interface ActivityLog {
    id: number;
    ticket_id: number;
    action: string;
    user_id?: number;
    user_name?: string;
    details?: string;
    created_at: string;
}

interface ActivityLogViewerProps {
    ticketId: number;
}

const ActivityLogViewer: React.FC<ActivityLogViewerProps> = ({ ticketId }) => {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivityLogs();
    }, [ticketId]);

    const loadActivityLogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://localhost:8000/tickets/${ticketId}/activity`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Error loading activity logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'CREATED':
                return '🎫';
            case 'ACCEPTED':
                return '✅';
            case 'PROGRESS_UPDATE':
                return '📝';
            case 'ESCALATED':
            case 'AUTO_ESCALATED':
                return '🚨';
            case 'REASSIGNED':
                return '🔄';
            case 'RESOLVED':
                return '✔️';
            default:
                return '📌';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATED':
                return 'text-blue-400';
            case 'ACCEPTED':
                return 'text-green-400';
            case 'PROGRESS_UPDATE':
                return 'text-cyan-400';
            case 'ESCALATED':
            case 'AUTO_ESCALATED':
                return 'text-rose-400';
            case 'REASSIGNED':
                return 'text-amber-400';
            case 'RESOLVED':
                return 'text-emerald-400';
            default:
                return 'text-slate-400';
        }
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-slate-500">
                <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                Loading activity logs...
            </div>
        );
    }

    if (logs.length === 0) {
        return (
            <div className="p-6 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No activity logs yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {logs.map((log, index) => (
                <div
                    key={log.id}
                    className="relative pl-8 pb-4 border-l-2 border-space-border last:border-transparent"
                >
                    {/* Timeline dot */}
                    <div className="absolute left-0 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-space-800 border-2 border-brand-500 shadow-lg shadow-brand-500/30"></div>

                    {/* Content */}
                    <div className="bg-space-800/50 rounded-lg p-4 border border-space-border hover:border-brand-500/30 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{getActionIcon(log.action)}</span>
                                <span className={`font-semibold ${getActionColor(log.action)}`}>
                                    {log.action.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {new Date(log.created_at).toLocaleString()}
                            </div>
                        </div>

                        {log.user_name && (
                            <div className="flex items-center gap-1 text-sm text-slate-400 mb-2">
                                <User className="w-3 h-3" />
                                {log.user_name}
                            </div>
                        )}

                        {log.details && (
                            <p className="text-sm text-slate-300 mt-2 pl-8">
                                {log.details}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityLogViewer;
