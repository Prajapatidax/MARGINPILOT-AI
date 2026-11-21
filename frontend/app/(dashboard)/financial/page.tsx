"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, Percent, TrendingUp, Info, ShieldCheck, FileSpreadsheet, Inbox } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { formatMoney } from "@/lib/currencies";

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
    net_sales: 0.0,
    cost_of_goods_sold: 0.0,
    gross_profit: 0.0,
    gross_margin_pct: 0.0,
  };

  const hasData = summary.net_sales > 0 || summary.cost_of_goods_sold > 0;

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
          <p className="font-bold">Verified GAAP-Compliant Margin Calculations</p>
          <p className="text-blue-700">
            All profit figures are derived directly from transactional line items: Gross Profit = Net Sales - COGS (Quantity Sold * Unit Cost).
          </p>
        </div>
      </div>

      {/* Financial Summary Cards (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Sales</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatMoney(summary.net_sales, activeOrg?.currency, activeOrg?.country, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {hasData ? "Gross sales minus discounts" : "Awaiting sales transactions"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cost of Goods Sold (COGS)</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {formatMoney(summary.cost_of_goods_sold, activeOrg?.currency, activeOrg?.country, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {hasData ? "Direct product procurement costs" : "Awaiting cost data"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Profit</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {formatMoney(summary.gross_profit, activeOrg?.currency, activeOrg?.country, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {hasData ? "Available for operational expenses" : "Awaiting data"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Margin %</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {summary.gross_margin_pct.toFixed(1)}%
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {hasData ? "Gross Profit / Net Sales" : "0.0% baseline"}
          </span>
        </div>
      </div>

      {!hasData && !loading && (
        <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No financial records recorded</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Import your sales records with product unit costs in Data Management to view detailed financial breakdowns.
          </p>
          <Link
            href="/data-management"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition-colors"
          >
            Import Data
          </Link>
        </div>
      )}
    </div>
  );
}
