"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="relative p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Never lose the context <br className="hidden md:block" /> behind a deal again.
            </h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Turn scattered conversations, documents, and decisions into an <br className="hidden md:block" />
              intelligent business memory.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all flex items-center gap-2 mx-auto group">
              Start Building Your Deal Memory
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
