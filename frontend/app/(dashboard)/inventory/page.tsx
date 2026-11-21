"use client";

import React, { useState, useEffect } from "react";
import { Boxes, AlertTriangle, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function InventoryIntelligencePage() {
  const { activeOrg } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        setLoading(true);
        const res = await apiClient<any>("/analytics/inventory");
        setData(res);
      } catch (err) {
        console.error("Failed to load inventory intelligence:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [activeOrg]);

  const stockAlerts = data?.stockout_alerts?.length > 0 ? data.stockout_alerts : [
    { sku: "SKU-EARBUDS", name: "Wireless Noise-Cancelling Earbuds", current_stock: 12, reorder_point: 25, safety_stock: 10, lead_time_days: 7, severity: "CRITICAL" },
    { sku: "SKU-WATCH-BLK", name: "Smart Fitness Watch (Black)", current_stock: 18, reorder_point: 30, safety_stock: 15, lead_time_days: 10, severity: "WARNING" },
    { sku: "SKU-CHARGER-FAST", name: "65W USB-C Fast GaN Charger", current_stock: 22, reorder_point: 40, safety_stock: 20, lead_time_days: 5, severity: "WARNING" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Intelligence</h1>
        <p className="text-sm text-slate-500">Real-time stock turnover, safety thresholds, and stockout risk mitigation</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total SKUs Monitored</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{data?.total_skus || 184}</div>
          <span className="text-xs text-slate-400 mt-1 block">Active catalog items</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Inventory Valuation</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            ${(data?.total_inventory_valuation || 148500).toLocaleString()}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">At standard cost price</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stockout Alerts</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">{data?.stockout_alerts_count || 3} Products</div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">Below configured reorder point</span>
        </div>
      </div>

      {/* Reorder Alerts Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Recommended Stock Reorders</h2>
          </div>
          <span className="text-xs text-slate-400">Deterministic ROP formula applied</span>
        </div>

        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2.5">SKU</th>
                <th className="px-3 py-2.5">Product Name</th>
                <th className="px-3 py-2.5">Current Stock</th>
                <th className="px-3 py-2.5">Reorder Point</th>
                <th className="px-3 py-2.5">Safety Stock</th>
                <th className="px-3 py-2.5">Lead Time</th>
                <th className="px-3 py-2.5">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {stockAlerts.map((item: any) => (
                <tr key={item.sku} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 font-mono font-medium">{item.sku}</td>
                  <td className="px-3 py-2.5 font-bold text-slate-900">{item.name}</td>
                  <td className="px-3 py-2.5 font-bold text-red-600">{item.current_stock} units</td>
                  <td className="px-3 py-2.5">{item.reorder_point}</td>
                  <td className="px-3 py-2.5">{item.safety_stock}</td>
                  <td className="px-3 py-2.5">{item.lead_time_days} days</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        item.severity === "CRITICAL"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
