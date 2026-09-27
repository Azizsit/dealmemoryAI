"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

const EXAMPLE_QUESTIONS = [
  "Which clients are waiting for a follow-up?",
  "What did we agree on with Acme Corp?",
  "Show deals at risk this month.",
  "What were the key negotiation points from last week's meetings?",
];

export default function AI_Search() {
  const [query, setQuery] = useState("");

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
            Ask your business memory.
          </h2>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl p-2 shadow-2xl">
              <div className="pl-4 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your deals..."
                className="w-full bg-transparent border-none focus:ring-0 text-white px-4 py-3 text-lg outline-none"
              />
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all flex items-center gap-2">
                Query <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {EXAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-xs hover:text-white hover:bg-white/10 transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
