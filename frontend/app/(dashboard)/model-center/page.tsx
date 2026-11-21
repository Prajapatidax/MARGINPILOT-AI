"use client";

import React, { useState, useEffect } from "react";
import {
  Cpu,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Users,
  Box,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import api from "@/lib/api";

interface ModelVersion {
  id: string;
  model_name: string;
  version: string;
  model_type: string;
  status: string;
  metrics: Record<string, any> | null;
  parameters: Record<string, any> | null;
  prediction_count: number;
  drift_status: string;
  last_trained_at: string;
}

interface PerformancePoint {
  month: string;
  accuracy: number;
  f1_score: number;
  mape: number;
}

export default function ModelCenterPage() {
  const [activeTab, setActiveTab] = useState<string>("All Models");
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformancePoint[]>([]);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingMessage, setTrainingMessage] = useState<string | null>(null);

  const fetchModelData = async () => {
    setIsLoading(true);
    try {
      const [modelsRes, perfRes, benchRes] = await Promise.all([
        api.get("/ml/models"),
        api.get("/ml/performance-history"),
        api.get("/ml/benchmarks"),
      ]);
      setModels(modelsRes.data);
      setPerformanceData(perfRes.data);
      setBenchmarks(benchRes.data);
    } catch (err) {
      console.error("Failed to load ML models:", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchModelData();
  }, []);

  const handleRetrainAll = async () => {
    setIsTraining(true);
    setTrainingMessage(null);
    try {
      await api.post("/ml/train", { model_family: "all" });
      setTrainingMessage("Classical ML training completed successfully! Weights and metrics updated.");
      await fetchModelData();
    } catch (err: any) {
      setTrainingMessage(err?.response?.data?.detail || "Training failed or requires more sample data.");
    } finally {
      setIsTraining(false);
    }
  };

  const handleTrainDeepLearning = async () => {
    setIsTraining(true);
    setTrainingMessage(null);
    try {
      await api.post("/ml/train/deep-learning");
      setTrainingMessage("PyTorch Deep Learning pipelines (LSTM + Deep Autoencoder) converged and deployed!");
      await fetchModelData();
    } catch (err: any) {
      setTrainingMessage(err?.response?.data?.detail || "Deep learning training failed.");
    } finally {
      setIsTraining(false);
    }
  };


  // Dynamic cards computed from real trained database models
  const modelCards = models.map((m) => {
    let icon = Cpu;
    let iconBg = "bg-blue-50 text-blue-600 border-blue-200";
    let metricLabel = "Quality";
    let metricVal = "Trained";

    const mType = (m.model_type || "").toUpperCase();
    if (mType.includes("CHURN") || mType.includes("CUSTOMER")) {
      icon = Users;
      iconBg = "bg-amber-50 text-amber-600 border-amber-200";
      metricLabel = "Accuracy";
      if (m.metrics?.accuracy) metricVal = `${(m.metrics.accuracy * 100).toFixed(1)}%`;
    } else if (mType.includes("FORECAST") || mType.includes("DEMAND")) {
      icon = TrendingUp;
      iconBg = "bg-blue-50 text-blue-600 border-blue-200";
      metricLabel = "MAPE";
      if (m.metrics?.mape) metricVal = `${Number(m.metrics.mape).toFixed(1)}%`;
    } else if (mType.includes("ANOMALY")) {
      icon = AlertTriangle;
      iconBg = "bg-indigo-50 text-indigo-600 border-indigo-200";
      metricLabel = "F1-Score";
      if (m.metrics?.f1_score) metricVal = `${(m.metrics.f1_score * 100).toFixed(1)}%`;
    }

    return {
      id: m.id,
      name: m.model_name,
      version: m.version,
      type: m.model_type,
      icon,
      iconBg,
      status: m.status,
      metricLabel,
      metricValue: metricVal,
      drift: m.drift_status || "Stable",
      algorithm: m.parameters?.algorithm || m.model_name,
    };
  });

  const filteredCards =
    activeTab === "All Models"
      ? modelCards
      : modelCards.filter((c) => (c.type || "").toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-7 h-7 text-blue-600" />
            ML Model Center
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your AI models, hyperparameters, and production drift status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Production Pipelines
          </div>

          <button
            onClick={handleRetrainAll}
            disabled={isTraining}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-2xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTraining ? "animate-spin" : ""}`} />
            Retrain Classical
          </button>

          <button
            onClick={handleTrainDeepLearning}
            disabled={isTraining}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-xs transition disabled:opacity-50"
          >
            <Layers className="w-3.5 h-3.5" />
            Train PyTorch Deep Learning
          </button>
        </div>
      </div>

      {trainingMessage && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          {trainingMessage}
        </div>
      )}

      {/* Filter Tabs matching mockup */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["All Models", "Customer", "Forecasting", "Anomaly", "Recommendation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Model Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredCards.map((model) => {
            const Icon = model.icon;
            return (
              <div
                key={model.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border ${model.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {model.name}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        {model.version}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {model.status}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">
                      {model.metricLabel}:
                    </span>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {model.metricValue}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400">
                    Drift: <span className="text-emerald-600 font-medium">{model.drift}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Cpu className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No machine learning models trained yet</p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
            Import sales, customer, or inventory records in Data Management and click &quot;Retrain Classical&quot; or &quot;Train PyTorch Deep Learning&quot; to calibrate predictive models.
          </p>
        </div>
      )}

      {/* Model Performance Chart Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Model Performance
            </h2>
            <p className="text-xs text-slate-500">
              Monthly cross-validation accuracy and quality score trends
            </p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-64 w-full">
          {performanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={performanceData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  domain={[80, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAcc)"
                  name="Accuracy Score (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <TrendingUp className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-700">No performance history</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Historical quality metrics will track here after pipeline runs.</p>
            </div>
          )}
        </div>
      </div>

      {/* Classical ML vs Deep Learning Benchmark Section */}
      {benchmarks && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Model Benchmark Matrix: Classical ML vs PyTorch Deep Learning
              </h2>
              <p className="text-xs text-slate-500">
                Rigorous evaluation metrics comparing gradient-boosted trees against recurrent & deep autoencoder architectures
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Demand Forecasting Benchmark */}
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Demand Forecasting (Multi-Horizon)
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {benchmarks.forecasting?.winner}
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-white rounded border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-900">Classical: </span>
                    <span className="text-slate-600">{benchmarks.forecasting?.classical?.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    MAPE: {(benchmarks.forecasting?.classical?.mape * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-blue-50/50 rounded border border-blue-200">
                  <div>
                    <span className="font-semibold text-blue-900">Deep Learning: </span>
                    <span className="text-blue-700">{benchmarks.forecasting?.deep_learning?.name}</span>
                  </div>
                  <span className="font-bold text-blue-800">
                    MAPE: {(benchmarks.forecasting?.deep_learning?.mape * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Anomaly Detection Benchmark */}
            <div className="p-4 rounded-lg border border-slate-100 bg-slate-50/60">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Anomaly Surveillance
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {benchmarks.anomaly_detection?.winner}
                </span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center p-2.5 bg-white rounded border border-slate-200">
                  <div>
                    <span className="font-semibold text-slate-900">Classical: </span>
                    <span className="text-slate-600">{benchmarks.anomaly_detection?.classical?.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">
                    F1: {(benchmarks.anomaly_detection?.classical?.f1_score * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-indigo-50/50 rounded border border-indigo-200">
                  <div>
                    <span className="font-semibold text-indigo-900">Deep Learning: </span>
                    <span className="text-indigo-700">{benchmarks.anomaly_detection?.deep_learning?.name}</span>
                  </div>
                  <span className="font-bold text-indigo-800">
                    F1: {(benchmarks.anomaly_detection?.deep_learning?.f1_score * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Registry Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">
            Model Registry & Execution Artifacts
          </h3>
          <span className="text-xs text-slate-400">
            MLflow Registry Synchronized
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-6 py-3">Model Name</th>
                <th className="px-6 py-3">Version</th>
                <th className="px-6 py-3">Architecture</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Predictions</th>
                <th className="px-6 py-3">Drift Health</th>
                <th className="px-6 py-3">Last Retrained</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {models.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No models registered yet. Click &quot;Retrain Models&quot; to initialize pipelines.
                  </td>
                </tr>
              ) : (
                models.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-3.5 font-medium text-slate-900 capitalize">
                      {m.model_name.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-500">
                      {m.version}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-600">
                      {m.model_type}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-medium text-slate-900">
                      {m.prediction_count.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-xs font-semibold text-emerald-600">
                        {m.drift_status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">
                      {new Date(m.last_trained_at).toLocaleString()}
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
