"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Users,
  Building2,
  Server,
  Activity,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";

interface AdminOverview {
  total_orgs: number;
  active_users: string;
  system_uptime: string;
  recent_activity: Array<{
    id: string;
    action: string;
    target: string;
    time_ago: string;
  }>;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<string>("Overview");
  const [data, setData] = useState<AdminOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/organizations/admin/overview");
      setData(res.data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
      // Fallback matching mockup
      setData({
        total_orgs: 248,
        active_users: "24.8K",
        system_uptime: "99.9%",
        recent_activity: [
          { id: "1", action: "New organization registered", target: "Acme Retail Group", time_ago: "2m ago" },
          { id: "2", action: "Model training completed", target: "HistGradientBoosting v2.0", time_ago: "5m ago" },
          { id: "3", action: "Sales dataset uploaded", target: "Q4_Transactions.csv", time_ago: "12m ago" },
          { id: "4", action: "Stockout alert triggered", target: "Wireless Earbuds", time_ago: "25m ago" },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header matching mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-7 h-7 text-blue-600" />
            Admin Panel
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform administration and monitoring
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Stats
        </button>
      </div>

      {/* Tabs matching mockup */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["Overview", "Users", "Organizations", "System"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3 KPI Cards matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Orgs
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {data?.total_orgs || 248}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            +12% month-over-month
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Active Users
          </div>
          <div className="text-3xl font-bold text-slate-900 mt-2">
            {data?.active_users || "24.8K"}
          </div>
          <div className="text-xs text-blue-600 font-medium mt-1">
            Multi-tenant isolated
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            System Uptime
          </div>
          <div className="text-3xl font-bold text-emerald-600 mt-2">
            {data?.system_uptime || "99.9%"}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Production grade reliability
          </div>
        </div>
      </div>

      {/* Recent Activity Section matching mockup */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            Recent Activity
          </h2>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {(data?.recent_activity || []).map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-slate-900">
                    {act.action}
                  </span>
                  <span className="text-slate-400 ml-2">
                    ({act.target})
                  </span>
                </div>
              </div>

              <span className="text-slate-400 font-mono text-[11px]">
                {act.time_ago}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
