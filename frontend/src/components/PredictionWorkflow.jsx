import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  "Ingesting borrower profile data...",
  "Analyzing stability and DTI ratios...",
  "Executing XGBoost model inference...",
  "Running local risk calibrations...",
  "Generating SHAP/LIME risk insights..."
];

export default function PredictionWorkflow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < STEPS.length) {
      const delay = currentStep === 2 ? 1000 : 700; // XGBoost step takes slightly longer
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="mb-8 rounded-full bg-slate-900 border border-slate-800 p-4"
      >
        <Loader2 className="h-8 w-8 text-emerald-500 animate-pulse" />
      </motion.div>

      <h3 className="text-xl font-display font-medium text-white mb-2">Analyzing Default Risk</h3>
      <p className="text-sm text-slate-400 mb-8 text-center">
        Our proprietary ML pipeline is evaluating financial parameters.
      </p>

      <div className="w-full space-y-4">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 rounded-lg border p-3.5 transition-all duration-300 ${
                isDone
                  ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                  : isActive
                  ? 'border-slate-700 bg-slate-900/60 shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                  : 'border-slate-800/40 opacity-30'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
              ) : isActive ? (
                <Loader2 className="h-5 w-5 text-emerald-400 animate-spin flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-slate-800 flex-shrink-0" />
              )}

              <span
                className={`text-sm font-sans ${
                  isDone
                    ? 'text-slate-300 font-medium'
                    : isActive
                    ? 'text-white font-medium'
                    : 'text-slate-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
