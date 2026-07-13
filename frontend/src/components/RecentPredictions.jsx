import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function RecentPredictions({ predictions }) {
  const getRiskColor = (risk) => {
    if (risk === 'HIGH') return 'text-rose-400 border-rose-500/20 bg-rose-500/10';
    return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10';
  };

  return (
    <div className="flex flex-col p-6 bg-[#0B0F19]/80 border border-slate-800 rounded-xl h-full">
      <h3 className="text-sm font-semibold tracking-wider text-slate-400 font-sans uppercase mb-6 flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-500" /> Evaluation Timeline
      </h3>

      <div className="flex-grow overflow-y-auto max-h-[360px] pr-2 space-y-5 relative">
        {/* Timeline connector line */}
        {predictions.length > 1 && (
          <div className="absolute left-[21px] top-3 bottom-3 w-[1px] bg-slate-800" />
        )}

        <AnimatePresence initial={false}>
          {predictions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
              No recent evaluations logged.
            </div>
          ) : (
            predictions.map((item, index) => {
              const nameChar = item.name ? item.name.charAt(0) : 'A';
              const dateStr = item.timestamp
                ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-4 relative z-10"
                >
                  {/* Timeline Node Avatar */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-bold font-display text-sm">
                    {nameChar}
                  </div>

                  {/* Prediction Info */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-200 truncate font-display">
                        {item.name || 'Custom Run'}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium font-sans flex-shrink-0">
                        {dateStr}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-sans font-medium">
                          DTI: {((item.loanAmount / (item.income * 12)) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300 font-semibold">{Math.round(item.probability * 100)}% Prob</span>
                        <span className={`rounded-full px-2 py-0.5 border text-[10px] font-bold ${getRiskColor(item.risk)}`}>
                          {item.risk}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
