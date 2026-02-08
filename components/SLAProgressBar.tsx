import React from 'react';
import { RiskLevel } from '../types';

interface SLAProgressBarProps {
  elapsed: number;
  limit: number;
  showLabel?: boolean;
}

export const calculateRisk = (percentage: number): RiskLevel => {
  if (percentage >= 100) return RiskLevel.BREACHED;
  if (percentage >= 75) return RiskLevel.HIGH_RISK;
  if (percentage >= 50) return RiskLevel.WARNING;
  return RiskLevel.SAFE;
};

const SLAProgressBar: React.FC<SLAProgressBarProps> = ({ elapsed, limit, showLabel = true }) => {
  const percentage = Math.min((elapsed / limit) * 100, 100);
  const risk = calculateRisk(percentage);

  let colorClass = 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
  if (risk === RiskLevel.WARNING) colorClass = 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
  if (risk === RiskLevel.HIGH_RISK) colorClass = 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]';
  if (risk === RiskLevel.BREACHED) colorClass = 'bg-slate-500';

  const remainingHours = Math.max(0, limit - elapsed).toFixed(1);

  return (
    <div className="w-full group relative">
      <div className="flex justify-between items-center mb-1 text-xs font-medium text-slate-400">
        {showLabel && <span>SLA: <span className="text-slate-200">{remainingHours}h</span> remaining</span>}
        {showLabel && <span className={risk === RiskLevel.HIGH_RISK || risk === RiskLevel.BREACHED ? 'text-rose-400 font-bold' : ''}>{Math.round(percentage)}%</span>}
      </div>
      <div className="w-full bg-space-800 rounded-full h-2.5 overflow-hidden border border-space-border">
        <div 
          className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-in-out relative`} 
          style={{ width: `${percentage}%` }}
        >
            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_5px_white]"></div>
        </div>
      </div>
      {/* Tooltip */}
      <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-space-950 border border-space-border text-slate-200 text-xs rounded px-2 py-1 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-10 shadow-xl">
        Risk Level: {risk}
      </div>
    </div>
  );
};

export default SLAProgressBar;