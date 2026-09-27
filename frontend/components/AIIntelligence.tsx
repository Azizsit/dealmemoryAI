"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, Zap, ShieldCheck } from 'lucide-react';

const FEATURES = [
  {
    title: 'AI Deal Memory',
    description: 'Remember every conversation, decision, commitment, and negotiation point automatically.',
    icon: Brain,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    title: 'Semantic Search',
    description: 'Find the exact information you need using natural language across all your deal history.',
    icon: Search,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    title: 'Deal Intelligence',
    description: 'Surface risks, opportunities, follow-ups, and hidden patterns across your entire pipeline.',
    icon: Zap,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
  },
];

export default function AIIntelligence() {
  return (
    <section className="py-24 px-4 bg-slate-950 relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Your business memory, <span className="text-indigo-500">powered by AI.</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Stop relying on scattered notes and memory. DealMemoryAI transforms your interactions
            into a structured, queryable intelligence layer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.07] transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", feature.bg)}>
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
