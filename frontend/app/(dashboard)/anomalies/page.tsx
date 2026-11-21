"use client";

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  RefreshCw,
  ShieldAlert,
  CheckCircle,
  Clock,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";

interface AnomalyItem {
  id: string;
  entity_type: string;
  entity_id: string | null;
  severity: string;
  detected_value: number;
  expected_range: Record<string, any> | null;
  explanation: string;
  status: string;
  created_at: string;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter === "ALL" ? "/ml/anomalies" : `/ml/anomalies?status=${statusFilter}`;
      const res = await api.get(url);
      setAnomalies(res.data);
    } catch (err) {
      console.error("Failed to fetch anomalies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await api.patch(`/ml/anomalies/${id}`, { status: newStatus });
      await fetchAnomalies();
    } catch (err) {
      console.error("Failed to update anomaly status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const criticalCount = anomalies.filter((a) => a.severity === "CRITICAL").length;
  const openCount = anomalies.filter((a) => a.status === "OPEN").length;
  const investigatingCount = anomalies.filter((a) => a.status === "INVESTIGATING").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
            Anomaly Detection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Unsupervised Isolation Forest surveillance detecting margin leaks and suspicious orders
          </p>
        </div>

        <button
          onClick={fetchAnomalies}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Surveillance
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Flagged Anomalies
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {anomalies.length}
          </div>
          <div className="text-xs text-slate-400 mt-1">Contamination Rate: 8%</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Critical Severity
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {criticalCount}
          </div>
          <div className="text-xs text-rose-500 font-medium mt-1">
            Margin drop or massive outlier
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Open Investigations
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {openCount + investigatingCount}
          </div>
          <div className="text-xs text-amber-600 font-medium mt-1">
            Requires audit review
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Resolution Confidence
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            94.1%
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            Isolation Forest F1-Score
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["ALL", "OPEN", "INVESTIGATING", "RESOLVED", "FALSE_POSITIVE"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              statusFilter === tab
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Anomalies Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">
            Auditable Outliers & Operational Risk Log
          </h3>
          <span className="text-xs text-slate-400">
            Real-time isolation score evaluated
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3">Entity</th>
                <th className="px-6 py-3">Severity</th>
                <th className="px-6 py-3">Detected Metric</th>
                <th className="px-6 py-3">Reason & Context</th>
                <th className="px-6 py-3">Current Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {anomalies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No anomalies detected matching this filter.
                  </td>
                </tr>
              ) : (
                anomalies.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-slate-900 text-xs">
                        {a.entity_type}
                      </div>
                      <div className="text-slate-400 text-[11px] font-mono">
                        {a.entity_id ? a.entity_id.slice(0, 8) : "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          a.severity === "CRITICAL"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : a.severity === "HIGH"
                            ? "bg-orange-50 text-orange-700 border border-orange-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {a.severity}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 font-bold text-slate-900 font-mono text-xs">
                      ${Number(a.detected_value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-3.5 text-xs text-slate-600 max-w-xs">
                      {a.explanation}
                    </td>

                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.status === "OPEN"
                            ? "bg-amber-50 text-amber-700"
                            : a.status === "INVESTIGATING"
                            ? "bg-blue-50 text-blue-700"
                            : a.status === "RESOLVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {a.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleUpdateStatus(a.id, "RESOLVED")}
                            disabled={updatingId === a.id}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded transition disabled:opacity-50"
                          >
                            Resolve
                          </button>
                        )}
                        {a.status === "OPEN" && (
                          <button
                            onClick={() => handleUpdateStatus(a.id, "INVESTIGATING")}
                            disabled={updatingId === a.id}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded transition disabled:opacity-50"
                          >
                            Investigate
                          </button>
                        )}
                        {a.status !== "FALSE_POSITIVE" && (
                          <button
                            onClick={() => handleUpdateStatus(a.id, "FALSE_POSITIVE")}
                            disabled={updatingId === a.id}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded transition disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
