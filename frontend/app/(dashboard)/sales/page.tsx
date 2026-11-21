"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Percent,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Inbox,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getCurrencySymbol, formatMoney } from "@/lib/currencies";

export default function SalesIntelligencePage() {
  const { activeOrg } = useAuth();
  const [dateRange, setDateRange] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        setLoading(true);
        const res = await apiClient<any>(`/analytics/sales?date_range=${dateRange}`);
        setData(res);
      } catch (err) {
        console.error("Failed to load sales analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSales();
  }, [dateRange, activeOrg]);

  const totalSales = Number(data?.total_sales || 0);
  const salesGrowth = Number(data?.sales_growth_rate || 0);
  const profitGrowth = Number(data?.profit_growth_rate || 0);
  const aov = Number(data?.average_order_value || 0);
  const totalOrders = Number(data?.total_orders || 0);
  const grossMargin = Number(data?.gross_margin_percentage || 0);
  const grossProfit = Number(data?.gross_profit || 0);

  const displayTrends = data?.sales_trend || [];
  const displayCategories = data?.sales_by_category || [];
  const displayProfitability = data?.profitability_trend || [];

  const currCode = activeOrg?.currency || "USD";
  const currCountry = activeOrg?.country;
  const currencySymbol = getCurrencySymbol(currCode, currCountry);
  const fmt = (
    val: number,
    options?: { compact?: boolean; minimumFractionDigits?: number; maximumFractionDigits?: number }
  ) => formatMoney(val, currCode, currCountry, options);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Matching Mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-slate-500">Sales performance, category revenue, and gross profitability</p>
        </div>

        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Sales Analytics</option>
            <option>Product Margins</option>
            <option>Customer Retention</option>
          </select>

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
      </div>

      {/* Top 4 Metric Cards (Real Values Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sales</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {fmt(totalSales, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600">
            {salesGrowth !== 0 ? (
              <>
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{salesGrowth}% vs previous period</span>
              </>
            ) : (
              <span className="text-slate-400 font-normal">
                {totalSales > 0 ? "Initial baseline" : "Awaiting sales import"}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Growth Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {profitGrowth !== 0 ? `${profitGrowth}%` : "0.0%"}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-blue-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Net profit growth rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {fmt(aov, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across {totalOrders} total orders</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Margin</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {grossMargin.toFixed(1)}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Gross Profit: {fmt(grossProfit, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Main Trend Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Sales Trend Progression</h2>
            <p className="text-xs text-slate-400">Continuous revenue velocity over the selected timeline</p>
          </div>
          {displayTrends.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
              Live SQL Analytics
            </span>
          )}
        </div>

        <div className="h-72 w-full">
          {displayTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => fmt(val, { compact: true })}
                />
                <Tooltip
                  formatter={(val: number) => [fmt(val), "Sales"]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#salesGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Inbox className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">No sales transactions found</p>
              <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
                Upload your sales orders in Data Management to view real-time sales trend curves.
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

      {/* Bottom Grid: Sales by Category & Profitability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Sales by Category</h2>
            <span className="text-xs text-slate-400">Share of revenue</span>
          </div>

          {displayCategories.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-48 h-48 relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayCategories}
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="percentage"
                    >
                      {displayCategories.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#2563eb"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 w-full space-y-3">
                {displayCategories.map((cat: any) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || "#2563eb" }}></span>
                        <span className="font-semibold text-slate-700">{cat.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${cat.percentage}%`, backgroundColor: cat.color || "#2563eb" }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
              <PieChartIcon className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">No category breakdown available</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Assign categories to products to view share of revenue.</p>
            </div>
          )}
        </div>

        {/* Profitability Trend (Bar Chart: Revenue vs COGS vs Profit) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Profitability Trend</h2>
            <span className="text-xs text-slate-400">Revenue vs COGS vs Profit</span>
          </div>

          <div className="h-60 w-full">
            {displayProfitability.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayProfitability} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => fmt(val, { compact: true })}
                  />
                  <Tooltip
                    formatter={(val: number) => [fmt(val), ""]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cogs" name="COGS" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gross_profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-700">No profitability data</p>
                <p className="text-[11px] text-slate-400 mt-0.5">COGS and gross margin history will appear when orders are logged.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
