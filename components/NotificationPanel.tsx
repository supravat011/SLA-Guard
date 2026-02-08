import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bell, X, Check, AlertTriangle, Info } from 'lucide-react';

interface Notification {
    id: number;
    message: string;
    type: 'INFO' | 'WARNING' | 'ALERT';
    read: boolean;
    created_at: string;
    ticket_id?: number;
}

const NotificationPanel: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showPanel, setShowPanel] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadNotifications();
        // Refresh notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await api.notifications.getAll();
            setNotifications(data);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        setLoading(true);
        try {
            await api.notifications.acknowledge(notificationId);
            loadNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        setLoading(true);
        try {
            await api.notifications.acknowledgeAll();
            loadNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ALERT':
                return <AlertTriangle className="w-5 h-5 text-rose-500" />;
            case 'WARNING':
                return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getNotificationStyle = (type: string, read: boolean) => {
        const baseStyle = read ? 'bg-space-800/30' : 'bg-space-800/60';
        let borderColor = 'border-space-border';

        if (!read) {
            switch (type) {
                case 'ALERT':
                    borderColor = 'border-rose-500/30';
                    break;
                case 'WARNING':
                    borderColor = 'border-amber-500/30';
                    break;
                default:
                    borderColor = 'border-blue-500/30';
            }
        }

        return `${baseStyle} border ${borderColor}`;
    };

    return (
        <div className="relative">
            {/* Notification Bell Button */}
            <button
                onClick={() => setShowPanel(!showPanel)}
                className="relative p-2 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-space-700"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg shadow-rose-500/50">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Notification Panel */}
            {showPanel && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowPanel(false)}
                    />

                    {/* Panel */}
                    <div className="absolute right-0 top-12 w-96 max-h-[32rem] bg-space-800 border border-space-border rounded-xl shadow-2xl z-50 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-space-border flex items-center justify-between bg-space-900/50">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-brand-400" />
                                <h3 className="font-bold text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs font-medium rounded-full border border-rose-500/30">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setShowPanel(false)}
                                className="p-1 text-slate-400 hover:text-white transition-colors rounded"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Actions */}
                        {unreadCount > 0 && (
                            <div className="p-3 border-b border-space-border bg-space-900/30">
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={loading}
                                    className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Check className="w-3 h-3" />
                                    Mark all as read
                                </button>
                            </div>
                        )}

                        {/* Notifications List */}
                        <div className="overflow-y-auto max-h-96">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-sm">No notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-space-border">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-space-700/30 transition-colors ${getNotificationStyle(notification.type, notification.read)}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm ${notification.read ? 'text-slate-400' : 'text-white font-medium'}`}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-1">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        disabled={loading}
                                                        className="flex-shrink-0 p-1 text-slate-400 hover:text-white transition-colors rounded disabled:opacity-50"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationPanel;
