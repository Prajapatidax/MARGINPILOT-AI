"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Users, UserCheck, AlertCircle, TrendingUp, ArrowUpRight, ShieldAlert, Sparkles, Inbox } from "lucide-react";
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

  const totalCustomers = Number(data?.total_customers || 0);
  const segments = data?.segment_distribution || [];
  const topCustomers = data?.top_clv_customers || [];

  const vipSegment = segments.find((s: any) => s.segment === "VIP");
  const vipShare = vipSegment ? `${vipSegment.percentage}%` : "0.0%";
  const atRiskCount = topCustomers.filter((c: any) => c.churn_risk_score >= 0.7).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Intelligence</h1>
        <p className="text-sm text-slate-500">Customer segmentation, retention risk, and lifetime value analytics</p>
      </div>

      {/* KPI Cards (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Active Customers</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCustomers.toLocaleString()}</div>
          <span className="text-xs text-slate-400 mt-1 block">
            {totalCustomers > 0 ? "Unique customer accounts" : "Awaiting customer import"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">High Value Segment (VIP)</span>
          <div className="text-2xl font-bold text-blue-600 mt-2">{vipShare}</div>
          <span className="text-xs text-slate-500 mt-1 block">
            {totalCustomers > 0 ? "Top revenue contributing tier" : "Awaiting segmentation"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">At-Risk Customers</span>
          <div className="text-2xl font-bold text-red-600 mt-2">{atRiskCount} Customers</div>
          <span className="text-xs text-slate-500 mt-1 block">
            {atRiskCount > 0 ? "Churn probability >= 70%" : "No immediate churn alerts"}
          </span>
        </div>
      </div>

      {/* Segments Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Segment Distribution</h2>
          {segments.length > 0 ? (
            <>
              <div className="w-44 h-44 mx-auto relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={segments} innerRadius={45} outerRadius={65} paddingAngle={4} dataKey="percentage">
                      {segments.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color || "#2563eb"} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {segments.map((s: any) => (
                  <div key={s.segment} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color || "#2563eb" }}></span>
                      <span className="font-semibold text-slate-700">{s.segment}</span>
                    </div>
                    <span className="font-bold text-slate-900">{s.percentage}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-12 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
              <Users className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-700">No customer segments</p>
              <p className="text-[11px] text-slate-400 mt-0.5">RFM clusters will populate once sales orders are recorded.</p>
            </div>
          )}
        </div>

        {/* Top CLV Customers Table */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Highest Lifetime Value (CLV)</h2>
              <p className="text-xs text-slate-400">Ranked by cumulative purchase value and repeat frequency</p>
            </div>
            {topCustomers.length > 0 && (
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Verified CLV Model
              </span>
            )}
          </div>

          {topCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Segment</th>
                    <th className="py-2.5 px-3">Est. CLV</th>
                    <th className="py-2.5 px-3">Churn Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {topCustomers.map((cust: any) => (
                    <tr key={cust.code} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {cust.name}
                        <span className="block text-[11px] text-slate-400 font-normal">{cust.code}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.segment === "VIP"
                              ? "bg-blue-100 text-blue-800"
                              : cust.segment === "AT_RISK"
                              ? "bg-red-100 text-red-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {cust.segment}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        ${cust.clv_estimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                cust.churn_risk_score > 0.6
                                  ? "bg-red-500"
                                  : cust.churn_risk_score > 0.3
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${Math.min(cust.churn_risk_score * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-[11px] text-slate-500">
                            {(cust.churn_risk_score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-6">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No customer records found</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                Import customer accounts or sales orders with customer IDs in Data Management to evaluate churn risk and lifetime values.
              </p>
              <Link
                href="/data-management"
                className="inline-block mt-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
              >
                Import Customer Data
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
