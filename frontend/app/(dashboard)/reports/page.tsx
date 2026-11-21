"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Boxes,
  DollarSign,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<string>("30d");
  const [exportingReport, setExportingReport] = useState<string | null>(null);

  const reportCards = [
    {
      id: "business-performance",
      title: "Business Performance",
      subtitle: "Comprehensive overview of KPIs, revenue trends, and operational margin ratios",
      icon: BarChart3,
      iconBg: "bg-blue-50 text-blue-600 border-blue-200",
      endpoint: "/analytics/summary",
    },
    {
      id: "sales-report",
      title: "Sales Report",
      subtitle: "Detailed sales volume, average order values, and category profitability analysis",
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
      endpoint: "/analytics/sales",
    },
    {
      id: "inventory-report",
      title: "Inventory Report",
      subtitle: "Stock levels, replenishment thresholds, stockout risk assessments, and turnover rate",
      icon: Boxes,
      iconBg: "bg-amber-50 text-amber-600 border-amber-200",
      endpoint: "/analytics/inventory",
    },
    {
      id: "financial-summary",
      title: "Financial Summary",
      subtitle: "Profitability statement, COGS breakdown, gross margin percentages, and expense tracking",
      icon: DollarSign,
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200",
      endpoint: "/analytics/financial",
    },
  ];

  const handleDownload = async (report: typeof reportCards[0]) => {
    setExportingReport(report.id);
    try {
      const res = await api.get(report.endpoint, { date_range: dateRange });
      const jsonStr = JSON.stringify(res.data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${report.id}_${dateRange}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExportingReport(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header matching mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-600" />
            Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate and download reports with verified database metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs focus:outline-hidden"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Report Cards Grid matching mockup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportCards.map((report) => {
          const Icon = report.icon;
          const isCurrent = exportingReport === report.id;
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${report.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 font-mono">
                    JSON / CSV Ready
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-base mt-4">
                  {report.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {report.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Ledger
                </span>

                <button
                  onClick={() => handleDownload(report)}
                  disabled={isCurrent}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                >
                  <Download className={`w-3.5 h-3.5 ${isCurrent ? "animate-bounce" : ""}`} />
                  {isCurrent ? "Exporting..." : "Export Report"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
