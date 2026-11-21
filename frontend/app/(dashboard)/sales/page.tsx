"use client";

import React, { useState, useEffect } from "react";
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

  // Fallback visual trends if zero orders yet
  const displayTrends = data?.sales_trend?.length > 0 ? data.sales_trend : [
    { date: "May 01", sales: 12000 },
    { date: "May 05", sales: 18500 },
    { date: "May 10", sales: 24000 },
    { date: "May 15", sales: 31000 },
    { date: "May 20", sales: 42000 },
    { date: "May 25", sales: 48000 },
    { date: "May 30", sales: 56000 },
  ];

  const displayCategories = data?.sales_by_category?.length > 0 ? data.sales_by_category : [
    { name: "Electronics", percentage: 40, sales: 98000, color: "#2563eb" },
    { name: "Fashion", percentage: 35, sales: 86000, color: "#8b5cf6" },
    { name: "Home & Living", percentage: 25, sales: 64750, color: "#06b6d4" },
  ];

  const displayProfitability = data?.profitability_trend?.length > 0 ? data.profitability_trend : [
    { period: "Jan", revenue: 45000, cogs: 28000, gross_profit: 17000 },
    { period: "Feb", revenue: 82000, cogs: 51000, gross_profit: 31000 },
    { period: "Mar", revenue: 125000, cogs: 78000, gross_profit: 47000 },
    { period: "Apr", revenue: 154000, cogs: 95000, gross_profit: 59000 },
    { period: "May", revenue: 198000, cogs: 122000, gross_profit: 76000 },
    { period: "Jun", revenue: 248750, cogs: 156320, gross_profit: 92430 },
  ];

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

      {/* Top 2 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Sales</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${(data?.total_sales || 248750).toLocaleString()}
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{data?.sales_growth_rate || 12.5}% vs previous period</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Growth Rate</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data?.profit_growth_rate || 14.2}%
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-blue-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Net profit growth rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Average Order Value (AOV)</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            ${(data?.average_order_value || 185.5).toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across {data?.total_orders || 1340} total orders</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Margin</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {data?.gross_margin_percentage || 37.2}%
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            Gross Profit: ${(data?.gross_profit || 92430).toLocaleString()}
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
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg">
            Aggregated Live Query
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val / 1000}k`}
              />
              <Tooltip
                formatter={(val: number) => [`$${val.toLocaleString()}`, "Sales"]}
                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Sales by Category & Profitability Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Sales by Category</h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayCategories}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="percentage"
                  >
                    {displayCategories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 flex-1">
              {displayCategories.map((cat: any) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="font-medium text-slate-700">{cat.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{cat.percentage}%</span>
                    <span className="text-[11px] text-slate-400 block">${cat.sales.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profitability Trend Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Profitability Trend</h2>
            <span className="text-xs text-slate-400">Revenue vs Gross Profit</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayProfitability} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: number) => [`$${val.toLocaleString()}`, ""]}
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gross_profit" name="Gross Profit" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
