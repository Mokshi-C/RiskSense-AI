import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { askAI } from '../services/api';

export default function AIChat({ selectedApplicant }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I am the IDBI Credit Risk Copilot. Ask me anything about applicant evaluations, risk weights, or credit guidelines."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom of message list on updates
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Handle auto-populating chat questions when applicant changes
  useEffect(() => {
    if (selectedApplicant) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: 'assistant',
          text: `Loaded profile for ${selectedApplicant.name}. You can ask: "Explain why ${selectedApplicant.name} has a ${selectedApplicant.risk.toLowerCase()} risk profile."`
        }
      ]);
    }
  }, [selectedApplicant]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await askAI(input);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: response.answer || "I could not analyze this query at the moment."
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          text: "System offline. Failed to query AI model explanation."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[480px] bg-[#0B0F19]/80 border border-slate-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950/40 p-4">
        <div className="rounded-lg bg-emerald-500/10 p-2 border border-emerald-500/20 text-emerald-400">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display font-medium text-white text-sm">Credit Risk Assistant</h3>
          <p className="text-[10px] text-emerald-400 font-sans tracking-wide">AI Engine Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex gap-3 max-w-[85%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              }`}>
                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`rounded-xl p-3.5 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1E293B] text-slate-100 border border-slate-700/50'
                  : 'bg-slate-900/60 text-slate-300 border border-slate-800'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-xl p-3.5 bg-slate-900/60 border border-slate-800 text-slate-400 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                <span>Thinking...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSend} className="border-t border-slate-800 bg-slate-950/40 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about credit risk guidelines..."
          className="flex-grow rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-lg bg-emerald-600 p-2.5 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors flex items-center justify-center"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
