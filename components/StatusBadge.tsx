import React from 'react';
import { TicketStatus, TicketPriority } from '../types';

export const StatusBadge: React.FC<{ status: TicketStatus | string }> = ({ status }) => {
  let classes = 'bg-slate-800 text-slate-300 border border-slate-700';

  const statusStr = typeof status === 'string' ? status : status;

  switch (statusStr) {
    case 'OPEN':
    case TicketStatus.OPEN:
      classes = 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      break;
    case 'IN_PROGRESS':
    case TicketStatus.IN_PROGRESS:
      classes = 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      break;
    case 'RESOLVED':
    case TicketStatus.RESOLVED:
      classes = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      break;
    case 'ESCALATED':
    case TicketStatus.ESCALATED:
      classes = 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)] animate-pulse';
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${classes}`}>
      {statusStr}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: TicketPriority }> = ({ priority }) => {
  let classes = 'text-slate-500';

  switch (priority) {
    case TicketPriority.LOW:
      classes = 'text-slate-400';
      break;
    case TicketPriority.MEDIUM:
      classes = 'text-amber-500 font-medium';
      break;
    case TicketPriority.HIGH:
      classes = 'text-orange-500 font-bold';
      break;
    case TicketPriority.CRITICAL:
      classes = 'text-rose-500 font-bold uppercase tracking-wider shadow-rose-500/20';
      break;
  }

  return <span className={`text-xs ${classes}`}>{priority}</span>;
};