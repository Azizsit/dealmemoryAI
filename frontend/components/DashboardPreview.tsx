"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Briefcase, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATS = [
  { label: 'Active Deals', value: '24', icon: Briefcase, color: 'text-blue-400' },
  { label: 'Deal Value', value: '$2.84M', icon: TrendingUp, color: 'text-emerald-400' },
  { label: 'Pending Actions', value: '18', icon: Clock, color: 'text-amber-400' },
  { label: 'AI Insights', value: '47', icon: CheckCircle2, color: 'text-indigo-400' },
];

const RECENT_DEALS = [
  { company: 'Acme Corp', type: 'Enterprise Contract', value: '$450k', status: 'Negotiation', activity: '2h ago' },
  { company: 'NovaTech', type: 'Partnership', value: '$120k', status: 'Discovery', activity: '5h ago' },
  { company: 'FinEdge', type: 'Series B', value: '$1.2M', status: 'Closing', activity: '1d ago' },
  { company: 'Vertex Systems', type: 'SaaS Renewal', value: '$80k', status: 'Review', activity: '2d ago' },
];

export default function DashboardPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent"
        >
          <div className="bg-slate-900 rounded-[calc(1.5rem-1px)] overflow-hidden border border-white/10 shadow-2xl">
            <div className="flex h-[600px]">
              {/* Sidebar */}
              <div className="w-64 border-r border-white/10 bg-slate-950 p-6 hidden lg:block">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2">Main</p>
                    <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer">
                      <LayoutDashboard className="w-4 h-4" /> Overview
                    </div>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors">
                      <Briefcase className="w-4 h-4" /> Deals
                    </div>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors">
                      <FileText className="w-4 h-4" /> Documents
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2">Intelligence</p>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors">
                      <BrainCircuit className="w-4 h-4" /> Insights
                    </div>
                    <div className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer transition-colors">
                      <PieChart className="w-4 h-4" /> Analytics
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-slate-900/50">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Good morning, Aziz</h2>
                    <p className="text-slate-400">Here's what's happening across your deals.</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 text-slate-300 text-xs rounded-lg hover:bg-white/10 transition-colors">Export PDF</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-500 transition-colors">New Deal</button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {STATS.map((stat) => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                        <span className="text-[10px] font-medium text-slate-500 uppercase">Live</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Deals Table */}
                <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-white">Recent Deals</h3>
                    <button className="text-xs text-indigo-400 hover:underline">View all</button>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/[0.02] text-slate-500 text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3 font-medium">Company</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Value</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Activity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {RECENT_DEALS.map((deal) => (
                        <tr key={deal.company} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-4 py-4 text-white font-medium">{deal.company}</td>
                          <td className="px-4 py-4 text-slate-400">{deal.type}</td>
                          <td className="px-4 py-4 text-slate-400">{deal.value}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/20">
                              {deal.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-500 text-xs">{deal.activity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Helper icons that would be in Navbar but needed here
function LayoutDashboard(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="9" x="14" y="3" rx="1"/><rect width="7" height="9" x="3" y="12" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/></svg></div>; }
function BrainCircuit(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997 2 3 3 0 0 0 3 5a3 3 0 0 0 3 5 3 3 0 1 0-5.997-2"/><path d="M12 12h.01"/><path d="M15 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/><path d="M9 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg></div>; }
function FileText(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg></div>; }
function PieChart(props: any) { return <div {...props}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.85"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg></div>; }
