import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, subtitle, icon: Icon, colorClass, statusColor }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }

    const duration = 1200; // ms
    const frameRate = 1000 / 60; // 60 fps
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.round(easeProgress * end);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(current);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0B0F19]/80 p-6 shadow-2xl transition-all duration-300 hover:border-slate-700/80"
    >
      {/* Glow highlight */}
      <div className={`absolute -right-16 -top-16 h-32 w-32 rounded-full opacity-10 blur-3xl ${colorClass}`} />

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400 font-sans tracking-wide">{title}</span>
        <div className={`rounded-lg p-2 bg-slate-900 border border-slate-800 ${statusColor}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold font-display tracking-tight text-white">
          {count.toLocaleString()}
        </span>
        {subtitle && (
          <span className="text-xs font-semibold text-slate-500 font-sans">{subtitle}</span>
        )}
      </div>

      {/* Decorative accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-70 ${colorClass}`} />
    </motion.div>
  );
}
