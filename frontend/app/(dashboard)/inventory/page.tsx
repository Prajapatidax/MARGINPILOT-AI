"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Boxes, AlertTriangle, ShieldCheck, RefreshCw, ArrowRight, CheckCircle2, Inbox } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatMoney } from "@/lib/currencies";

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

  const totalSkus = Number(data?.total_skus || 0);
  const totalValuation = Number(data?.total_inventory_valuation || 0);
  const stockoutCount = Number(data?.stockout_alerts_count || 0);
  const stockAlerts = data?.stockout_alerts || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Inventory Intelligence</h1>
        <p className="text-sm text-slate-500">Real-time stock turnover, safety thresholds, and stockout risk mitigation</p>
      </div>

      {/* KPI Cards (Real Values Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total SKUs Monitored</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalSkus.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">Active catalog items</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Inventory Valuation</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {formatMoney(totalValuation, activeOrg?.currency, activeOrg?.country, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">At standard cost price</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Stockout Alerts</span>
          <div className="text-2xl font-bold text-amber-600 mt-2">{stockoutCount} Products</div>
          <span className="text-xs text-slate-500 mt-1 block">
            {stockoutCount > 0 ? "Below configured reorder point" : "Stock healthy or unrecorded"}
          </span>
        </div>
      </div>

      {/* Reorder Alerts Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Reorder Priority Alerts</h2>
            <p className="text-xs text-slate-400">Products operating beneath safety stock buffers</p>
          </div>
          {stockAlerts.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg">
              Dynamic EOQ
            </span>
          )}
        </div>

        {stockAlerts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">SKU / Product</th>
                  <th className="py-2.5 px-3">On Hand</th>
                  <th className="py-2.5 px-3">Reorder Point</th>
                  <th className="py-2.5 px-3">Safety Buffer</th>
                  <th className="py-2.5 px-3">Vendor Lead Time</th>
                  <th className="py-2.5 px-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stockAlerts.map((item: any) => (
                  <tr key={item.sku} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {item.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{item.sku}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{item.current_stock} units</td>
                    <td className="py-3 px-3">{item.reorder_point}</td>
                    <td className="py-3 px-3">{item.safety_stock}</td>
                    <td className="py-3 px-3">{item.lead_time_days} days</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.severity === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
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
        ) : (
          <div className="py-16 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No stockout alerts detected</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
              All inventory levels are currently above reorder points or no inventory transactions have been logged.
            </p>
            <Link
              href="/data-management"
              className="inline-block mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Import Inventory Data
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
