import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Percent, 
  TrendingDown, 
  ShieldAlert, 
  Users, 
  Wallet, 
  FileText, 
  Layers, 
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { getDashboard, predictRisk, getExplanation } from '../services/api';
import MetricCard from '../components/MetricCard';
import ApplicantCard from '../components/ApplicantCard';
import PredictionWorkflow from '../components/PredictionWorkflow';
import RiskGauge from '../components/RiskGauge';
import FeatureImportance from '../components/FeatureImportance';
import AIChat from '../components/AIChat';
import RecentPredictions from '../components/RecentPredictions';
import AlertNotification from '../components/AlertNotification';

const PRESETS = [
  { name: 'Priya', income: 55000, loanAmount: 450000, healthScore: 88, risk: 'LOW', employment: 'Employed' },
  { name: 'Rahul', income: 19000, loanAmount: 840000, healthScore: 32, risk: 'HIGH', employment: 'Unemployed' },
  { name: 'Amit', income: 75000, loanAmount: 200000, healthScore: 94, risk: 'LOW', employment: 'Employed' },
  { name: 'Neha', income: 32000, loanAmount: 650000, healthScore: 48, risk: 'HIGH', employment: 'Employed' }
];

export default function Dashboard() {
  // Page level stats
  const [stats, setStats] = useState({
    total_loans: 2000,
    high_risk: 312,
    medium_risk: 650,
    low_risk: 1038
  });

  // Calculator Form state
  const [income, setIncome] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('Employed');
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Evaluation states
  const [evaluationState, setEvaluationState] = useState('idle'); // idle | loading | result
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);

  // Load stats from dashboard API
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getDashboard();
      if (data) setStats(data);
    };
    fetchStats();

    // Load recent evaluations from localStorage
    const saved = localStorage.getItem('idbi_predictions');
    if (saved) {
      setRecentRuns(JSON.parse(saved));
    }
  }, []);

  // Handle Preset Applicant Selection
  const handleSelectPreset = (preset) => {
    setSelectedApplicant(preset);
    setIncome(preset.income);
    setLoanAmount(preset.loanAmount);
    setEmploymentStatus(preset.employment);
  };

  // Run prediction request
  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!income || !loanAmount) return;

    setEvaluationState('loading');

    try {
      // Fetch calculation and explanation from API in parallel
      const [predData, expData] = await Promise.all([
        predictRisk(income, loanAmount, employmentStatus),
        getExplanation()
      ]);

      setResult(predData);
      setExplanation(expData);

      // Save to evaluation history
      const newRun = {
        id: Date.now(),
        name: selectedApplicant ? selectedApplicant.name : 'Custom Evaluator',
        income: Number(income),
        loanAmount: Number(loanAmount),
        employmentStatus,
        probability: predData.probability,
        risk: predData.risk,
        timestamp: new Date().toISOString()
      };

      const updatedRuns = [newRun, ...recentRuns].slice(0, 10);
      setRecentRuns(updatedRuns);
      localStorage.setItem('idbi_predictions', JSON.stringify(updatedRuns));
      
    } catch (err) {
      console.error("Evaluation error", err);
    }
  };

  const resetForm = () => {
    setIncome('');
    setLoanAmount('');
    setEmploymentStatus('Employed');
    setSelectedApplicant(null);
    setEvaluationState('idle');
    setResult(null);
    setExplanation(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Header */}
      <header className="border-b border-slate-900 bg-[#080B11]/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-slate-900 font-extrabold text-lg">
              I
            </div>
            <div>
              <span className="font-display font-bold tracking-tight text-white">IDBI BANK</span>
              <span className="text-xs text-slate-500 font-sans font-medium ml-2 border-l border-slate-800 pl-2">Risk Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              LIVE ASSESSMENT MODEL v2.4
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-slate-900 pb-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Empowering Loan Underwriters with Predictive Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-none">
              AI Loan Risk <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                Intelligence Platform
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed font-sans">
              Predict borrower default risk instantly using machine learning models, and explain every credit decision using real-time explainable AI feature attributions.
            </p>
          </div>

          {/* Animated Borrower Approval Illustration */}
          <div className="lg:col-span-5 relative h-48 bg-slate-950/40 border border-slate-900 rounded-xl overflow-hidden flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent blur-2xl" />
            
            <div className="relative z-10 flex gap-4 w-full justify-around items-center">
              {['Priya', 'Rahul', 'Amit', 'Neha'].map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [0, -6, 0], opacity: 1 }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      duration: 3,
                      delay: i * 0.4,
                      ease: "easeInOut"
                    },
                    opacity: { duration: 0.5, delay: i * 0.2 }
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="h-12 w-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 font-bold shadow-lg">
                    {name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{name}</span>
                  {/* Approval dot */}
                  <span className={`h-2 w-2 rounded-full ${i % 2 === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* METRIC CARD STATS */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Loan Applications" 
            value={stats.total_loans} 
            icon={FileText} 
            colorClass="bg-emerald-500" 
            statusColor="text-emerald-400"
          />
          <MetricCard 
            title="High Default Risk Flag" 
            value={stats.high_risk} 
            icon={ShieldAlert} 
            colorClass="bg-rose-500" 
            statusColor="text-rose-400"
            subtitle="Requires Review"
          />
          <MetricCard 
            title="Medium Default Risk" 
            value={stats.medium_risk} 
            icon={Layers} 
            colorClass="bg-amber-500" 
            statusColor="text-amber-400"
          />
          <MetricCard 
            title="Low Risk Approval Safe" 
            value={stats.low_risk} 
            icon={Users} 
            colorClass="bg-indigo-500" 
            statusColor="text-indigo-400"
            subtitle="Fast-track Auto"
          />
        </section>

        {/* SMART APPLICANT PRESETS GRID */}
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-white tracking-tight">Smart Applicant Gallery</h2>
            <p className="text-sm text-slate-400 mt-1">Select an active applicant profile to auto-populate the neural evaluator form.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRESETS.map((preset) => (
              <ApplicantCard
                key={preset.name}
                applicant={preset}
                isActive={selectedApplicant?.name === preset.name}
                onSelect={handleSelectPreset}
              />
            ))}
          </div>
        </section>

        {/* EVALUATION CONSOLE WORKFLOW & RISK BREAKDOWN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Form / Workflow States / Results */}
          <div className="lg:col-span-7 space-y-6">
            <div className="border border-slate-800 bg-[#0B0F19]/40 rounded-xl overflow-hidden">
              <div className="border-b border-slate-800 bg-slate-950/40 p-5 flex items-center justify-between">
                <h3 className="font-display font-medium text-white text-base">Risk Calculator Console</h3>
                {(evaluationState === 'result' || selectedApplicant) && (
                  <button 
                    onClick={resetForm}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Panel
                  </button>
                )}
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  
                  {/* IDLE STATE: Parameter input form */}
                  {evaluationState === 'idle' && (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleEvaluate}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Income Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Monthly Income (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-slate-500 font-sans text-sm">₹</span>
                            <input
                              type="number"
                              required
                              value={income}
                              onChange={(e) => setIncome(e.target.value)}
                              placeholder="50,000"
                              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 py-2.5 pl-8 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Loan Amount Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Requested Loan (₹)</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-2.5 text-slate-500 font-sans text-sm">₹</span>
                            <input
                              type="number"
                              required
                              value={loanAmount}
                              onChange={(e) => setLoanAmount(e.target.value)}
                              placeholder="4,00,000"
                              className="w-full rounded-lg border border-slate-800 bg-slate-900/40 py-2.5 pl-8 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Employment Status Select */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Employment Classification</label>
                        <div className="flex gap-4">
                          {['Employed', 'Unemployed'].map((status) => (
                            <button
                              key={status}
                              type="button"
                              onClick={() => setEmploymentStatus(status)}
                              className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold transition-all duration-300 ${
                                employmentStatus === status
                                  ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                                  : 'border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 group shadow-xl"
                      >
                        Run Risk Diagnostics
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.form>
                  )}

                  {/* LOADING STATE: Step-by-step model pipeline animation */}
                  {evaluationState === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <PredictionWorkflow onComplete={() => setEvaluationState('result')} />
                    </motion.div>
                  )}

                  {/* RESULT STATE: Gauge metrics and attributions */}
                  {evaluationState === 'result' && result && (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      <RiskGauge 
                        probability={result.probability} 
                        risk={result.risk} 
                        months={result.months} 
                      />
                      
                      {explanation && (
                        <FeatureImportance 
                          topFeatures={explanation.top_features} 
                          reason={explanation.reason} 
                        />
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AI Copilot Assistant Chat & Timeline */}
          <div className="lg:col-span-5 space-y-6">
            {/* Chatbot Interface */}
            <AIChat selectedApplicant={selectedApplicant} />

            {/* Evaluation History Timeline */}
            <RecentPredictions predictions={recentRuns} />
          </div>

        </section>
        
      </main>

      {/* Floating System Warnings / Alerts */}
      <AlertNotification />
    </div>
  );
}
