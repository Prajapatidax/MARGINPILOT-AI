"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sparkles,
  Package,
  Layers,
  UploadCloud,
  Inbox,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api";

interface SummaryData {
  has_data: boolean;
  metrics: {
    total_revenue: number;
    revenue_change_pct: number;
    gross_profit: number;
    gross_profit_change_pct: number;
    gross_margin_pct: number;
    gross_margin_change_pct: number;
    active_customers: number;
    active_customers_change_pct: number;
    total_orders: number;
    average_order_value: number;
  };
  trends: Array<{ period: string; revenue: number; cogs: number; gross_profit: number }>;
  top_products: Array<{ sku: string; name: string; revenue: number; units_sold: number; gross_margin_pct: number }>;
  customer_segments: Array<{ segment: string; count: number; percentage: number; color: string }>;
  inventory_alerts: Array<{ sku: string; name: string; current_stock: number; reorder_point: number; severity: string }>;
  ai_recommendations: Array<{ id: string; title: string; description: string; impact_summary: string; severity: string; category: string }>;
}

export default function DashboardOverview() {
  const { activeOrg } = useAuth();
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const res = await apiClient<SummaryData>(`/analytics/summary?date_range=${dateRange}`);
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, [dateRange, activeOrg]);

  const hasData = Boolean(data?.has_data);
  const metrics = data?.metrics || {
    total_revenue: 0,
    revenue_change_pct: 0,
    gross_profit: 0,
    gross_profit_change_pct: 0,
    gross_margin_pct: 0,
    gross_margin_change_pct: 0,
    active_customers: 0,
    active_customers_change_pct: 0,
    total_orders: 0,
    average_order_value: 0,
  };

  const revenueTrendData = data?.trends || [];
  const topProducts = data?.top_products || [];
  const customerSegments = data?.customer_segments || [];
  const inventoryAlerts = data?.inventory_alerts || [];
  const aiRecommendations = data?.ai_recommendations || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">Your business at a glance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Onboarding Notice for fresh organizations with no imported records */}
      {!hasData && !loading && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Welcome to {activeOrg?.name || "your workspace"}!
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                No business data imported yet. Import your real sales, products, or inventory spreadsheets to generate live profit intelligence, forecasting, and AI recommendations.
              </p>
            </div>
          </div>
          <Link
            href="/data-management"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Import Business Data</span>
          </Link>
        </div>
      )}

      {/* KPI Cards Row (Real Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${metrics.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {hasData && metrics.revenue_change_pct !== 0 ? (
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{metrics.revenue_change_pct}% vs last period</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                {hasData ? "No prior comparison" : "Awaiting data import"}
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Gross Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Profit</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              ${metrics.gross_profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {hasData && metrics.gross_profit_change_pct !== 0 ? (
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{metrics.gross_profit_change_pct}% vs last period</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                {hasData ? "Baseline period" : "Awaiting data import"}
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Gross Margin */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Margin</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {metrics.gross_margin_pct.toFixed(1)}%
            </div>
            {hasData && metrics.gross_margin_change_pct !== 0 ? (
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{metrics.gross_margin_change_pct}% vs last period</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                {hasData ? "Calculated from COGS" : "Awaiting data import"}
              </span>
            )}
          </div>
        </div>

        {/* Card 4: Active Customers */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Customers</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900">
              {metrics.active_customers.toLocaleString()}
            </div>
            {hasData && metrics.active_customers_change_pct !== 0 ? (
              <div className="flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{metrics.active_customers_change_pct}% vs last period</span>
              </div>
            ) : (
              <span className="text-[11px] text-slate-400 mt-1 block">
                {hasData ? "Registered customer accounts" : "Awaiting data import"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Middle Grid: Revenue Trend & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Revenue Trend</h2>
              <p className="text-xs text-slate-400">Monthly revenue progression compared with previous cycle</p>
            </div>
            {revenueTrendData.length > 0 && (
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-3 h-0.5 bg-blue-600 rounded"></span>
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600">
                  <span className="w-3 h-0.5 bg-emerald-600 rounded"></span>
                  <span>Gross Profit</span>
                </div>
              </div>
            )}
          </div>

          <div className="h-64 w-full">
            {revenueTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + "k" : val}`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, fontSize: 12 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#2563eb" }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="gross_profit"
                    name="Gross Profit"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 2, fill: "#10b981" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Inbox className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">No sales records found</p>
                <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                  Import sales transactions or invoices in Data Management to visualize your revenue and profitability trends.
                </p>
                <Link
                  href="/data-management"
                  className="mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Import Data
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-900">AI Recommendations</h2>
              </div>
              <Link href="/simulator" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            {aiRecommendations.length > 0 ? (
              <div className="space-y-3">
                {aiRecommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{rec.title}</p>
                      <p className="text-[11px] text-blue-700 font-medium">{rec.impact_summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
                <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">No recommendations yet</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Once business data is uploaded, AI models automatically generate actionable inventory and margin recommendations.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/copilot"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Ask AI Copilot</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Products, Customer Segments, Inventory Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Top Products</h2>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((prod, idx) => (
                <div key={prod.sku || idx} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-slate-400">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-800 truncate">{prod.name}</span>
                      <span className="text-slate-500 font-semibold">${prod.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${Math.min(prod.gross_margin_pct, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
              <Package className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">No products recorded</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Catalog rankings will appear here once orders are processed.</p>
            </div>
          )}
        </div>

        {/* Customer Segments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <h2 className="text-base font-semibold text-slate-900 mb-2">Customer Segments</h2>
          {customerSegments.length > 0 ? (
            <div className="flex items-center justify-between gap-4 my-2">
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      innerRadius={36}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="percentage"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#2563eb"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 text-xs">
                {customerSegments.map((s) => (
                  <div key={s.segment} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || "#2563eb" }}></span>
                    <span className="text-slate-600">{s.segment}</span>
                    <span className="font-bold text-slate-900 ml-auto">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4 my-auto">
              <Users className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">No customer data</p>
              <p className="text-[11px] text-slate-400 mt-0.5">RFM segmentation will activate when customer data is synced.</p>
            </div>
          )}
          <Link href="/customers" className="text-xs text-blue-600 font-medium hover:text-blue-700 text-center block mt-2">
            Explore Segments →
          </Link>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-slate-900">Inventory Alerts</h2>
              <Link href="/inventory" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                View All →
              </Link>
            </div>

            {inventoryAlerts.length > 0 ? (
              <div className="space-y-3">
                {inventoryAlerts.map((alert) => (
                  <div
                    key={alert.sku}
                    className="p-3 bg-red-50/60 border border-red-100 rounded-lg flex items-center gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800">{alert.name}</p>
                      <p className="text-[11px] text-red-600">Stock: {alert.current_stock} (Reorder at {alert.reorder_point})</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-slate-700">Stock levels clear</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No critical stockout or reorder alerts detected.</p>
              </div>
            )}
          </div>
          <Link
            href="/inventory"
            className="w-full mt-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold text-center block transition-colors"
          >
            Review Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
