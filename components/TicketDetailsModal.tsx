import React, { useState } from 'react';
import { X, FileText, MessageSquare } from 'lucide-react';
import ActivityLogViewer from './ActivityLogViewer';
import TicketComments from './TicketComments';

interface TicketDetailsModalProps {
    ticketId: number;
    ticketTitle: string;
    userRole: 'MANAGER' | 'TECHNICIAN' | 'SENIOR_TECHNICIAN' | 'USER';
    onClose: () => void;
}

const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
    ticketId,
    ticketTitle,
    userRole,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-space-900 border border-space-border rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-space-border flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-white mb-1">{ticketTitle}</h2>
                            <p className="text-sm text-slate-400">Ticket #{ticketId}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-white hover:bg-space-800 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-space-border">
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${activeTab === 'comments'
                                    ? 'text-brand-400 border-b-2 border-brand-500'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${activeTab === 'activity'
                                    ? 'text-brand-400 border-b-2 border-brand-500'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <FileText className="w-4 h-4" />
                            Activity Log
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'comments' ? (
                            <TicketComments ticketId={ticketId} userRole={userRole} />
                        ) : (
                            <ActivityLogViewer ticketId={ticketId} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TicketDetailsModal;
