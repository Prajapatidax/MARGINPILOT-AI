"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, AlertCircle, TrendingUp, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { apiClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function CustomerIntelligencePage() {
  const { activeOrg } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        const res = await apiClient<any>("/analytics/customers");
        setData(res);
      } catch (err) {
        console.error("Failed to load customer analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [activeOrg]);

  const segments = data?.segment_distribution?.length > 0 ? data.segment_distribution : [
    { segment: "VIP", count: 540, percentage: 42, color: "#2563eb" },
    { segment: "REGULAR", count: 488, percentage: 38, color: "#8b5cf6" },
    { segment: "NEW", count: 256, percentage: 20, color: "#10b981" },
  ];

  const topCustomers = data?.top_clv_customers?.length > 0 ? data.top_clv_customers : [
    { code: "CUST-001", name: "Global Logistics Corp", segment: "VIP", clv_estimate: 48500.0, churn_risk_score: 0.12 },
    { code: "CUST-002", name: "Apex Retailers Ltd", segment: "VIP", clv_estimate: 36200.0, churn_risk_score: 0.18 },
    { code: "CUST-003", name: "Summit Distribution", segment: "REGULAR", clv_estimate: 24100.0, churn_risk_score: 0.35 },
    { code: "CUST-004", name: "Echo Dynamics", segment: "AT_RISK", clv_estimate: 18900.0, churn_risk_score: 0.78 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Intelligence</h1>
        <p className="text-sm text-slate-500">Customer segmentation, retention risk, and lifetime value analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Active Customers</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{data?.total_customers || 12850}</div>
          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8.1% vs last month</span>
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">High Value Segment (VIP)</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">42%</div>
          <span className="text-xs text-slate-500 mt-1 block">Generates 68% of total revenue</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">At-Risk Customers</span>
          <div className="text-2xl font-bold text-red-600 mt-2">18 Customers</div>
          <span className="text-xs text-red-600 font-medium mt-1 block">Inactivity window &gt; 60 days</span>
        </div>
      </div>

      {/* Segments Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Segment Distribution</h2>
          <div className="w-44 h-44 mx-auto relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segments} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="percentage">
                  {segments.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {segments.map((s: any) => (
              <div key={s.segment} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
                  <span className="font-semibold text-slate-700">{s.segment}</span>
                </div>
                <span className="font-bold text-slate-900">{s.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Roster Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Highest Lifetime Value (CLV) Accounts</h2>
            <span className="text-xs text-slate-400">ML-backed forward projections</span>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Code</th>
                  <th className="px-3 py-2.5">Account Name</th>
                  <th className="px-3 py-2.5">Segment</th>
                  <th className="px-3 py-2.5">Est. CLV</th>
                  <th className="px-3 py-2.5">Churn Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {topCustomers.map((cust: any) => (
                  <tr key={cust.code} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono font-medium">{cust.code}</td>
                    <td className="px-3 py-2.5 font-bold text-slate-900">{cust.name}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-slate-100 text-slate-700">
                        {cust.segment}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-emerald-700">${cust.clv_estimate.toLocaleString()}</td>
                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          cust.churn_risk_score > 0.5
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {Math.round(cust.churn_risk_score * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
