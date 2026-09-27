"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { interactionService, dealService } from "@/lib/api-client";
import { Interaction } from "@/types";
import Link from "next/link";

export default function DealWorkspace() {
  const { id } = useParams();
  const dealId = parseInt(id as string);
  const [note, setNote] = useState("");
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [dealName, setDealName] = useState("");

  useEffect(() => {
    loadDealInfo();
  }, [dealId]);

  async function loadDealInfo() {
    try {
      const deal = await dealService.getDeal(dealId);
      setDealName(deal.name);
      // For now, we just initialize interaction list as empty
      // (In a full app, we'd have a GET /interactions/{deal_id} endpoint)
    } catch (e) {
      console.error("Failed to load deal info", e);
    }
  }

  async function handleSaveNote() {
    if (!note.trim()) return;
    setIsSaving(true);
    try {
      const newInteraction = await interactionService.createInteraction({
        deal_id: dealId,
        content: note,
        interaction_type: "Note",
      });
      setInteractions([newInteraction, ...interactions]);
      setNote("");
    } catch (e) {
      alert("Error saving note");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <Link href="/deals" className="text-indigo-600 hover:underline text-sm">← Back to Pipeline</Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">{dealName}</h1>
          <Link
            href={`/deals/${dealId}/briefing`}
            className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            View Intelligence Briefing →
          </Link>
        </div>

        <div className="bg-white p-6 border rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Log Interaction</h2>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened in the call/email? Mention objections, promises, or stakeholder sentiment..."
            className="w-full h-32 p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
          />
          <button
            onClick={handleSaveNote}
            disabled={isSaving}
            className={`w-full py-2 rounded-lg font-medium transition-colors ${
              isSaving ? "bg-slate-300 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {isSaving ? "Processing Intelligence..." : "Save Interaction Note"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
        {interactions.length === 0 ? (
          <div className="p-8 border-2 border-dashed rounded-2xl text-center text-slate-400">
            No interactions logged yet.
          </div>
        ) : (
          interactions.map((int) => (
            <div key={int.id} className="p-4 bg-slate-50 border rounded-xl">
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{int.interaction_type}</span>
                <span>{new Date(int.timestamp).toLocaleDateString()}</span>
              </div>
              <p className="text-slate-700">{int.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
