"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { briefingService } from "@/lib/api-client";
import { BriefingResponse } from "@/types";
import Link from "next/link";

export default function BriefingPage() {
  const { id } = useParams();
  const dealId = parseInt(id as string);
  const [data, setData] = useState<BriefingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBriefing();
  }, [dealId]);

  async function loadBriefing() {
    try {
      const result = await briefingService.getBriefing(dealId);
      setData(result);
    } catch (e) {
      console.error("Failed to load briefing", e);
    } finally {
      setIsLoading(false);
    }
  }

  const getRiskColor = (score: string) => {
    switch (score) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (isLoading) return <div className="p-8 text-center">Generating Intelligence...</div>;
  if (!data) return <div className="p-8 text-center">Failed to load briefing.</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href={`/deals/${dealId}`} className="text-indigo-600 hover:underline text-sm">← Back to Deal Workspace</Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">Intelligence Briefing</h1>
      </div>

      <div className="grid gap-6">
        {/* Risk Meter */}
        <div className={`p-6 border-2 rounded-2xl flex items-center justify-between ${getRiskColor(data.risk.score)}`}>
          <div>
            <span className="text-xs uppercase tracking-wider font-bold opacity-70">Current Deal Risk</span>
            <h2 className="text-2xl font-black">{data.risk.score}</h2>
          </div>
          <div className="text-right max-w-xs">
            <p className="text-sm font-medium">{data.risk.reason}</p>
          </div>
        </div>

        {/* Evidence Summary */}
        <div className="bg-white p-8 border rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Executive Summary</h3>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
              {data.evidence_count} Interactions Analyzed
            </span>
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {data.briefing}
          </div>
        </div>

        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-600">
          <strong>Tip:</strong> Citations like [Int #12] refer to the specific interaction note where this evidence was found.
        </div>
      </div>
    </div>
  );
}
