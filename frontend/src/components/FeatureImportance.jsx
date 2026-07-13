import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function FeatureImportance({ topFeatures, reason }) {
  // Feature impact mapping
  const featureWeights = {
    "Income": { val: 85, color: "bg-emerald-500" },
    "Loan Amount": { val: 65, color: "bg-amber-500" },
    "Employment Status": { val: 40, color: "bg-indigo-500" }
  };

  return (
    <div className="flex flex-col p-6 bg-[#0B0F19]/80 border border-slate-800 rounded-xl h-full">
      <h3 className="text-sm font-semibold tracking-wider text-slate-400 font-sans uppercase mb-6">Model Feature Attribution</h3>

      <div className="space-y-5 flex-grow">
        {topFeatures.map((feature, index) => {
          const attribution = featureWeights[feature] || { val: 50, color: "bg-slate-500" };
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 font-sans">{feature}</span>
                <span className="text-slate-400">{attribution.val}% Weight</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${attribution.val}%` }}
                  transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                  className={`h-full rounded-full ${attribution.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Premium Insight Card */}
      <div className="mt-8 rounded-lg border border-indigo-500/20 bg-indigo-500/[0.02] p-4">
        <div className="flex gap-2.5">
          <Lightbulb className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-indigo-400">AI Narrative Explanation</h4>
            <p className="text-sm text-slate-300 font-sans mt-1.5 leading-relaxed">
              {reason || "The combination of the requested loan size and monthly income thresholds suggests moderate default potential."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
