"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders,
  Play,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  DollarSign,
  Package,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "@/lib/api";

interface SimulationResult {
  scenario_type: string;
  parameter_change_pct: number;
  expected_revenue_change_pct: number;
  expected_profit_change_pct: number;
  expected_gross_margin_pct: number;
  projected_stockout_risk_pct: number;
  current_revenue: number;
  simulated_revenue: number;
  current_profit: number;
  simulated_profit: number;
  curve: Array<{ step: string; revenue: number; profit: number; margin: number }>;
  executive_summary: string;
}

export default function SimulatorPage() {
  const [activeTab, setActiveTab] = useState<string>("Pricing");
  const [priceReduction, setPriceReduction] = useState<number>(10);
  const [elasticity, setElasticity] = useState<number>(1.6);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = async (pct?: number, tab?: string) => {
    setIsRunning(true);
    const chosenPct = pct !== undefined ? pct : priceReduction;
    const chosenType = (tab || activeTab).toUpperCase();
    try {
      const res = await api.post("/simulator/run", {
        scenario_type: chosenType,
        parameter_change_percentage: -1 * Math.abs(chosenPct),
        elasticity_coefficient: elasticity,
      });
      setSimulation(res.data);
    } catch (err) {
      console.error("Simulation run failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runSimulation(10, "Pricing");
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    runSimulation(priceReduction, tab);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header matching mockup */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-7 h-7 text-blue-600" />
            What-If Simulator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore business scenarios and evaluate margin, revenue, and stockout impacts before execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["Pricing", "Demand", "Inventory", "Costs"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Panel matching mockup */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Controls: Price Reduction Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Price Reduction
            </label>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 font-medium">
                Reduce prices by:
              </span>
              <select
                value={priceReduction}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPriceReduction(val);
                  runSimulation(val);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value={5}>5%</option>
                <option value={10}>10%</option>
                <option value={15}>15%</option>
                <option value={20}>20%</option>
                <option value={25}>25%</option>
              </select>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Based on empirical price elasticity coefficient $\varepsilon = {elasticity}$
            </p>
          </div>

          {/* Stockout Risk Indicator from mockup */}
          <div className="flex justify-end">
            <div className="px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <div className="text-xs font-medium text-amber-800">
                  Projected Stockout Risk
                </div>
                <div className="text-base font-bold text-amber-900">
                  {simulation?.projected_stockout_risk_pct || 92.0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Impact Section matching mockup */}
        <div className="pt-6 border-t border-slate-100">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Expected Impact
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
              <div className="text-xs font-medium text-slate-500">Revenue Impact</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                +{simulation?.expected_revenue_change_pct || 8.5}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                ${simulation?.simulated_revenue.toLocaleString()} projected
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
              <div className="text-xs font-medium text-slate-500">Profit Impact</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                +{simulation?.expected_profit_change_pct || 6.2}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                ${simulation?.simulated_profit.toLocaleString()} projected
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/60">
              <div className="text-xs font-medium text-slate-500">Gross Margin</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {simulation?.expected_gross_margin_pct || 38.1}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Wholesale volume efficiency unlocked
              </div>
            </div>
          </div>
        </div>

        {/* Trajectory Sparkline Curve matching mockup */}
        {simulation?.curve && (
          <div className="pt-4 border-t border-slate-100">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={simulation.curve}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="step"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#64748b" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "6px",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3 }}
                    name="Profit ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Action Buttons matching mockup */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => runSimulation()}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? "animate-spin" : ""}`} />
            {isRunning ? "Simulating..." : "Run Simulation"}
          </button>

          <button className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700">
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
