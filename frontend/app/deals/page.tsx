"use client";

import React, { useState, useEffect } from "react";
import { dealService } from "@/lib/api-client";
import { Deal } from "@/types";
import Link from "next/link";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [newDealName, setNewDealName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      const data = await dealService.listDeals();
      setDeals(data);
    } catch (e) {
      console.error("Failed to load deals", e);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateDeal() {
    if (!newDealName.trim()) return;
    try {
      await dealService.createDeal({ name: newDealName });
      setNewDealName("");
      await loadDeals();
    } catch (e) {
      alert("Error creating deal");
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading deals...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Deal Pipeline</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          value={newDealName}
          onChange={(e) => setNewDealName(e.target.value)}
          placeholder="New Deal Name (e.g. Apex Foods)"
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button
          onClick={handleCreateDeal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create Deal
        </button>
      </div>

      <div className="grid gap-4">
        {deals.length === 0 ? (
          <p className="text-slate-500 text-center py-12">No deals found. Start by creating one!</p>
        ) : (
          deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all flex justify-between items-center group"
            >
              <div>
                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">{deal.name}</h3>
                <p className="text-sm text-slate-500">{deal.status}</p>
              </div>
              <div className="text-indigo-600 group-hover:translate-x-1 transition-transform">
                →
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
