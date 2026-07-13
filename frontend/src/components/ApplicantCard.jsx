import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Award } from 'lucide-react';

export default function ApplicantCard({ applicant, onSelect, isActive }) {
  const { name, income, loanAmount, healthScore, risk, employment, avatarSeed } = applicant;

  // Custom premium gradient avatar based on name
  const gradientStyles = {
    Priya: "from-emerald-600 to-teal-500",
    Rahul: "from-rose-600 to-orange-500",
    Amit: "from-sky-600 to-indigo-500",
    Neha: "from-amber-500 to-red-500"
  };

  const getRiskBadge = (riskValue) => {
    if (riskValue === 'LOW') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="h-3.5 w-3.5" /> LOW RISK
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
        <ShieldAlert className="h-3.5 w-3.5" /> HIGH RISK
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(applicant)}
      className={`cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
        isActive
          ? 'border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(0,168,107,0.15)]'
          : 'border-slate-800 bg-[#0B0F19]/80 hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar representation with high-end linear gradients */}
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-tr text-lg font-bold text-white ${gradientStyles[name] || 'from-slate-700 to-slate-600'}`}>
            {name.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-medium text-white text-base">{name}</h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">{employment}</p>
          </div>
        </div>
        {getRiskBadge(risk)}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-2 border-t border-slate-800/80 pt-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Income</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">₹{income.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Requested Loan</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">₹{loanAmount.toLocaleString()}</p>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Credit Health</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Award className={`h-4 w-4 ${healthScore > 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-sm font-semibold text-slate-200">{healthScore} / 100</span>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">DTI Ratio</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">
            {((loanAmount / (income * 12)) * 100).toFixed(0)}% DTI
          </p>
        </div>
      </div>

      {/* Interactive selection helper */}
      <div className="mt-4 flex items-center justify-end text-xs font-semibold text-emerald-400">
        <span>{isActive ? 'Selected for Evaluation' : 'Load Profile →'}</span>
      </div>
    </motion.div>
  );
}
