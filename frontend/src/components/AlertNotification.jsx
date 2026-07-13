import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, ShieldAlert } from 'lucide-react';
import { getAlerts } from '../services/api';

export default function AlertNotification() {
  const [alerts, setAlerts] = useState([]);
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await getAlerts();
        if (data && data.alerts) {
          setAlerts(data.alerts);
          // Auto-trigger alerts one by one for demo visual effect
          data.alerts.forEach((alert, index) => {
            setTimeout(() => {
              setVisibleAlerts(prev => [...prev, { id: Date.now() + index, text: alert }]);
            }, 1000 + index * 2000);
          });
        }
      } catch (err) {
        console.error("Failed to load live alerts", err);
      }
    };
    fetchAlerts();
  }, []);

  const closeAlert = (id) => {
    setVisibleAlerts(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {visibleAlerts.map((alert) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-950/20 p-4 shadow-2xl backdrop-blur-md"
          >
            <div className="rounded bg-red-500/10 p-1.5 text-red-400 border border-red-500/20 flex-shrink-0">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-display">System Risk Alert</h4>
              <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed">
                {alert.text}
              </p>
            </div>
            <button
              onClick={() => closeAlert(alert.id)}
              className="text-slate-500 hover:text-slate-300 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
