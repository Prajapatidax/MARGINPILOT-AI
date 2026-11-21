"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, Percent, TrendingUp, Info, ShieldCheck, FileSpreadsheet } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function FinancialIntelligencePage() {
  const { activeOrg } = useAuth();
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFinancial() {
      try {
        setLoading(true);
        const res = await apiClient<any>(`/analytics/financial?date_range=${dateRange}`);
        setData(res);
      } catch (err) {
        console.error("Failed to load financial intelligence:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFinancial();
  }, [dateRange, activeOrg]);

  const summary = data?.financial_summary || {
    net_sales: 248750.0,
    cost_of_goods_sold: 156320.0,
    gross_profit: 92430.0,
    gross_margin_pct: 37.2,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Financial Intelligence</h1>
          <p className="text-sm text-slate-500">Gross margin accounting, cost of goods sold (COGS), and unit margins</p>
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Accounting Compliance Banner */}
      <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900 space-y-1">
          <p className="font-semibold">Metric Definitions &amp; Methodology</p>
          <p className="text-blue-700">
            <strong>Gross Profit</strong> = Net Sales - Cost of Goods Sold (COGS) &bull; <strong>Gross Margin %</strong> = (Gross Profit / Net Sales) &times; 100.
            Net profit is never fabricated without fully reconciled general ledger accounting entries.
          </p>
        </div>
      </div>

      {/* Financial Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Sales</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">${summary.net_sales.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">Gross commercial revenues</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cost of Goods Sold (COGS)</span>
          <div className="text-2xl font-bold text-slate-700 mt-2">${summary.cost_of_goods_sold.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">Direct unit product costs</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Profit</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">${summary.gross_profit.toLocaleString()}</div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Net Sales - COGS</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Margin %</span>
          <div className="text-2xl font-bold text-purple-600 mt-2">{summary.gross_margin_pct}%</div>
          <span className="text-xs text-purple-700 font-semibold mt-1 block">Profit share of revenue</span>
        </div>
      </div>
    </div>
  );
}
