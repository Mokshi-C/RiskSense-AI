import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Calendar } from 'lucide-react';

export default function RiskGauge({ probability, risk, months }) {
  const probPercentage = Math.round(probability * 100);
  
  // Circumference configuration
  const radius = 60;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  const getRiskDetails = () => {
    if (risk === 'HIGH') {
      return {
        color: 'text-rose-500',
        stroke: 'url(#rose-grad)',
        glow: 'glow-red',
        bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        icon: <ShieldAlert className="h-5 w-5" />
      };
    }
    return {
      color: 'text-emerald-500',
      stroke: 'url(#emerald-grad)',
      glow: 'glow-green',
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      icon: <ShieldCheck className="h-5 w-5" />
    };
  };

  const details = getRiskDetails();

  return (
    <div className="flex flex-col items-center p-6 bg-[#0B0F19]/80 border border-slate-800 rounded-xl">
      <h3 className="text-sm font-semibold tracking-wider text-slate-400 font-sans uppercase mb-6">Default Risk Analysis</h3>

      <div className="relative flex items-center justify-center">
        {/* Outer dynamic glow ring */}
        <div className={`absolute h-40 w-40 rounded-full blur-2xl opacity-20 ${details.glow}`} />

        <svg className="h-36 w-36 transform -rotate-90">
          <defs>
            <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="rose-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          {/* Base Background Circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Risk Arc */}
          <motion.circle
            cx="72"
            cy="72"
            r={radius}
            stroke={details.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Core Content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-extrabold font-display text-white tracking-tight"
          >
            {probPercentage}%
          </motion.span>
          <span className="text-[10px] text-slate-500 font-sans font-semibold tracking-wider uppercase mt-0.5">Probability</span>
        </div>
      </div>

      {/* Stats and Metadata Badges */}
      <div className="mt-8 w-full flex flex-col gap-4">
        <div className={`flex items-center justify-between border rounded-lg px-4 py-2.5 ${details.bg}`}>
          <div className="flex items-center gap-2">
            {details.icon}
            <span className="text-sm font-semibold tracking-wider font-display">{risk} RISK</span>
          </div>
          <span className="text-xs font-medium font-sans">ML XGBoost Verdict</span>
        </div>

        <div className="flex items-center justify-between border border-slate-800/80 bg-slate-950/40 rounded-lg px-4 py-2.5">
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-semibold text-slate-200">Horizon: {months} Months</span>
          </div>
          <span className="text-xs text-slate-500 font-medium">Prediction Window</span>
        </div>
      </div>
    </div>
  );
}
