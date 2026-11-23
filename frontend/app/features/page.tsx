"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  LineChart,
  Users,
  Boxes,
  Truck,
  AlertTriangle,
  Bot,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Cpu,
  Zap,
  Sparkles,
  BarChart3,
  Layers,
  ArrowUpRight,
  Check,
  Building2,
  Activity,
  FileText,
  Search,
  MessageSquare,
  Lock,
  BadgeCheck,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "analytics" | "ml" | "operations">("all");
  const [simulatedPrice, setSimulatedPrice] = useState<number>(5);
  const [simulatedCost, setSimulatedCost] = useState<number>(3);

  // Derived simulator values for live interactive preview
  const baseRevenue = 250000;
  const baseMargin = 34.5;
  const projectedMargin = (baseMargin + (simulatedPrice * 0.7) - (simulatedCost * 0.5)).toFixed(1);
  const profitDelta = Math.round(baseRevenue * ((Number(projectedMargin) - baseMargin) / 100));

  const allCapabilities = [
    {
      id: "analytics",
      category: "analytics",
      title: "Real-Time Sales & Margin Analytics",
      badge: "Financial Engine",
      tagline: "Instant gross profit, net margin, and average order value tracking across every SKU, store, and channel.",
      metrics: [
        { label: "Gross Margin", value: "37.2%", change: "+1.8%" },
        { label: "Query Speed", value: "< 24ms", change: "Sub-second" },
        { label: "Profit Growth", value: "+32.0%", change: "YoY" },
      ],
      points: [
        "Period-over-Period (PoP), Month-over-Month, and YoY normalized calculations",
        "Warehouse-level inventory holding cost and fulfillment fee attribution",
        "Negative-margin order warnings catching discount leakages in real-time",
      ],
      icon: LineChart,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "forecasting",
      category: "ml",
      title: "PyTorch Deep Learning Demand Forecasting",
      badge: "Deep Neural Networks",
      tagline: "Multi-layer LSTM networks forecasting SKU-level sales velocity up to 90 days with uncertainty bands.",
      metrics: [
        { label: "Forecast MAPE", value: "8.7%", change: "Top tier" },
        { label: "Horizon", value: "30-90 Days", change: "Daily/Weekly" },
        { label: "Safety Buffer", value: "-22%", change: "Optimized" },
      ],
      points: [
        "Probabilistic confidence bounds (P10, P50, P90) factoring demand volatility",
        "Automated decomposition of seasonal surges, promotional lift, and calendar events",
        "Continuous automated retraining triggered when data distribution drift is detected",
      ],
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "copilot",
      category: "analytics",
      title: "Gemini 2.5 AI Business Copilot",
      badge: "Verified SQL RAG",
      tagline: "Ask complex operational and financial questions in natural English with zero hallucination guarantee.",
      metrics: [
        { label: "Accuracy", value: "100%", change: "SQL Grounded" },
        { label: "Latency", value: "< 1.2s", change: "Streamed" },
        { label: "Safety", value: "Read-Only", change: "Sandboxed" },
      ],
      points: [
        "Converts plain-English questions into mathematically verified PostgreSQL queries",
        "Interactive data tables and instant downloadable reports generated dynamically",
        "Document intelligence querying supplier invoices, freight bills, and vendor contracts",
      ],
      icon: Bot,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      id: "simulator",
      category: "analytics",
      title: "What-If Scenario & Price Elasticity Simulator",
      badge: "Decision Sandbox",
      tagline: "Simulate pricing tweaks, supplier cost escalations, and demand shocks before executing them in the market.",
      metrics: [
        { label: "Simulated Delta", value: "+$4,850", change: "Net Profit" },
        { label: "Elasticity Model", value: "Calibrated", change: "SKU Specific" },
        { label: "Risk Score", value: "Low", change: "Stockout < 3%" },
      ],
      points: [
        "Non-linear price elasticity curves derived from historical transactional behavior",
        "Wholesale tier volume discount curves ensuring profitable break-evens",
        "Dynamic reorder buffer adjustments under simulated demand volatility",
      ],
      icon: Sliders,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      id: "churn",
      category: "ml",
      title: "XGBoost Customer Churn & SHAP Attribution",
      badge: "Machine Learning",
      tagline: "Detect accounts at risk of defection weeks before they leave, with interpretable SHAP factor attribution.",
      metrics: [
        { label: "Model F1-Score", value: "91.4%", change: "Calibrated" },
        { label: "At-Risk Flagged", value: "128", change: "Proactive" },
        { label: "Retention Lift", value: "+14.2%", change: "Saved EBITDA" },
      ],
      points: [
        "SHAP value explanations highlighting the top 3 drivers of churn risk per client",
        "Automated VIP vs. Regular vs. Churned segmentation with exportable playbooks",
        "Direct webhook triggers to CRM and email sequences for automated retention",
      ],
      icon: Users,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
    {
      id: "inventory",
      category: "operations",
      title: "Dynamic EOQ & Inventory Optimization",
      badge: "Supply Chain",
      tagline: "Eliminate stockouts and deadstock carrying costs with automated Economic Order Quantity calculations.",
      metrics: [
        { label: "Stockout Reduction", value: "-64%", change: "Monitored" },
        { label: "Carrying Cost", value: "-18.5%", change: "Saved" },
        { label: "Turnover Velocity", value: "6.8x", change: "Annual" },
      ],
      points: [
        "Dynamic safety stock calculations factoring supplier lead-time variance",
        "Multi-warehouse transfer recommendations before regional nodes run dry",
        "Fast-moving vs. slow-moving inventory classification with automated reorder alerts",
      ],
      icon: Boxes,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "anomalies",
      category: "ml",
      title: "Operational Anomaly & Fraud Detection",
      badge: "Isolation Forest",
      tagline: "Continually scan transactions, return spikes, discount overrides, and supplier discrepancies.",
      metrics: [
        { label: "Detection Speed", value: "Real-Time", change: "Instant" },
        { label: "False Positive", value: "< 1.2%", change: "Precision" },
        { label: "Saved Capital", value: "+$18,400", change: "Per Quarter" },
      ],
      points: [
        "Unsupervised Isolation Forest models detecting multidimensional transaction anomalies",
        "Sudden discount overrides and suspicious refund volume velocity triggers",
        "Supplier invoice mismatch detection catching uncontracted price increases",
      ],
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      id: "suppliers",
      category: "operations",
      title: "Supplier Lead-Time & Reliability Scoring",
      badge: "Vendor Analytics",
      tagline: "Score suppliers on on-time delivery rates, defect percentages, and historical price volatility.",
      metrics: [
        { label: "Tracked Vendors", value: "48", change: "Active" },
        { label: "Predicted Delay", value: "-1.8 Days", change: "Accuracy" },
        { label: "Defect Rate", value: "0.4%", change: "Benchmark" },
      ],
      points: [
        "Automated Purchase Order (PO) fulfillment cycle and transit duration tracking",
        "Predictive seasonal delays based on historical port and carrier bottlenecks",
        "Alternative supplier recommendations when critical item lead times surge",
      ],
      icon: Truck,
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
    },
  ];

  const filteredCapabilities =
    activeTab === "all" ? allCapabilities : allCapabilities.filter((c) => c.category === activeTab);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero Header */}
      <section className="relative pt-16 pb-16 px-6 max-w-7xl mx-auto w-full text-center space-y-6">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>The Complete Business Intelligence &amp; AI Engine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Built for Mathematical Precision.{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Powered by Deep AI.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          MarginPilot AI bridges enterprise transactional data with PyTorch deep learning, XGBoost, and Gemini AI.
          No hardcoded metrics. No hallucinations. Just verified, actionable profit intelligence.
        </p>

        {/* Hero CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Start 14-Day Free Trial</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#flagship-deep-learning"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Technical Architecture</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* 4 Feature Pillar Anchors */}
        <div className="pt-8 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="#flagship-deep-learning"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">PyTorch LSTM</div>
              <div className="text-[10px] text-slate-500">Demand Forecasting</div>
            </div>
          </a>

          <a
            href="#flagship-copilot"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Gemini Copilot</div>
              <div className="text-[10px] text-slate-500">SQL Grounded RAG</div>
            </div>
          </a>

          <a
            href="#flagship-simulator"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">What-If Sandbox</div>
              <div className="text-[10px] text-slate-500">Price Elasticity</div>
            </div>
          </a>

          <a
            href="#flagship-inventory"
            className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Dynamic EOQ</div>
              <div className="text-[10px] text-slate-500">Inventory Optimizer</div>
            </div>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLAGSHIP SHOWCASE 1: PyTorch LSTM Deep Learning Demand Forecasting */}
      {/* ========================================================================= */}
      <section id="flagship-deep-learning" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Deep Learning Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              PyTorch LSTM Neural Networks for 90-Day Demand Forecasting
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Static moving averages and simple regressions fail in volatile markets. MarginPilot AI trains multi-layer
              Long Short-Term Memory (LSTM) recurrent networks on continuous sales velocity, seasonality waves,
              lead times, and promotional coefficients.
            </p>

            {/* Key Bullet List */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Probabilistic Confidence Bounds (P10 / P50 / P90)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quantify supply chain uncertainty and prevent overstocking with calibrated Bayesian variance estimates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Holiday &amp; Promotion Spike Decomposition</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Automatically isolate seasonal lifts from baseline demand so post-holiday purchase orders stay right-sized.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Distribution Drift &amp; Auto-Retraining Triggers</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Background jobs monitor Kolmogorov-Smirnov drift metrics and retrain weights automatically when demand shifts.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Deploy PyTorch LSTM Model on Your Data</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/neural-network.jpg"
                alt="PyTorch Neural Network Demand Forecasting"
                className="w-full h-80 sm:h-96 object-cover opacity-35"
              />

              {/* Glassmorphic UI Overlay Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                      LSTM Model Active • Multi-Layer Recurrent
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300">
                    PyTorch v2.3.1
                  </span>
                </div>

                {/* Simulated Chart Visual */}
                <div className="my-3 p-4 rounded-xl bg-slate-950/70 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">90-Day Demand Trajectory (SKU: WH-8491)</span>
                    <span className="text-emerald-400 font-bold">+18.4% Expected Surge</span>
                  </div>

                  {/* Visual SVG Wave Chart */}
                  <div className="h-28 w-full flex items-end pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="forecastGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Area */}
                      <path
                        d="M0,70 Q50,60 100,65 T200,45 T300,30 T400,20 L400,100 L0,100 Z"
                        fill="url(#forecastGrad)"
                      />
                      {/* Historic solid line */}
                      <path
                        d="M0,70 Q50,60 100,65 T200,45"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                      {/* Forecast dashed line */}
                      <path
                        d="M200,45 T300,30 T400,20"
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2.5"
                        strokeDasharray="4 4"
                      />
                      {/* Anchor Dot */}
                      <circle cx="200" cy="45" r="4" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-white/5">
                    <span>Oct (Historical)</span>
                    <span className="text-white font-bold">Today (T-0)</span>
                    <span className="text-emerald-300">Dec (+90 Days Forecast)</span>
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Model MAPE</div>
                    <div className="text-xs font-bold text-white mt-0.5">8.7%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Confidence Band</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">P90 Calibrated</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Stock Buffer</div>
                    <div className="text-xs font-bold text-sky-400 mt-0.5">-22% Waste</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLAGSHIP SHOWCASE 2: Gemini 2.5 Flash AI Copilot with Verified SQL RAG */}
      {/* ========================================================================= */}
      <section id="flagship-copilot" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Card */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-white p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">MarginPilot AI Copilot</h5>
                    <p className="text-[10px] text-slate-500">Connected to Neon PostgreSQL • Verified Read-Only</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  SQL Grounded
                </span>
              </div>

              {/* Chat Message 1: User Query */}
              <div className="p-3.5 rounded-2xl bg-slate-100 text-xs text-slate-800 ml-8 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Executive Query:</div>
                <p className="font-semibold text-slate-900">
                  &ldquo;Which wholesale distributor accounts have experienced margin drops greater than 5% this quarter?&rdquo;
                </p>
              </div>

              {/* Chat Message 2: Copilot Verified Response */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60 text-xs text-slate-800 space-y-3 mr-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Verified Analytical Insight (3 accounts found)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Generated in 1.1s</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  Calculated true cost-of-goods and freight surcharges across <strong>14,892 wholesale order lines</strong>.
                  Three high-volume distributor accounts experienced net margin erosion due to unbilled freight surcharges:
                </p>

                {/* Instant Data Table Output */}
                <div className="overflow-x-auto rounded-xl border border-blue-200/80 bg-white">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2">Distributor</th>
                        <th className="p-2">Prior Margin</th>
                        <th className="p-2">Current</th>
                        <th className="p-2 text-right">Leakage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Apex Logistics Ltd</td>
                        <td className="p-2 text-slate-600">38.4%</td>
                        <td className="p-2 text-rose-600 font-bold">31.2%</td>
                        <td className="p-2 text-right text-rose-600">-₹2.4L ($2,880)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Metro Retail Co</td>
                        <td className="p-2 text-slate-600">41.0%</td>
                        <td className="p-2 text-rose-600 font-bold">34.8%</td>
                        <td className="p-2 text-right text-rose-600">-₹1.8L ($2,150)</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold text-slate-900">Global Supply Hub</td>
                        <td className="p-2 text-slate-600">36.5%</td>
                        <td className="p-2 text-rose-600 font-bold">30.1%</td>
                        <td className="p-2 text-right text-rose-600">-₹1.5L ($1,800)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center justify-between">
                  <span>💡 <strong>Recommendation:</strong> Enforce automatic freight pass-through on order weights &gt; 250kg.</span>
                  <span className="font-bold text-emerald-700 underline cursor-pointer">Apply Policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-3.5 h-3.5" />
              <span>Conversational Business Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Gemini 2.5 AI Copilot with 100% Mathematical SQL Grounding
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Generic chatbots guess answers and hallucinate financial numbers. MarginPilot AI pairs Google&apos;s
              Gemini 2.5 Flash model with deterministic SQL execution against your Neon PostgreSQL warehouse to guarantee
              exact mathematical truth.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Zero-Hallucination Guardrails</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Queries are synthesized into parameterized SQL, checked against database schemas, and executed strictly in read-only mode.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dynamic Multi-Table Data Visualizations</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Results render dynamically as interactive sorting tables, margin distributions, and exportable CSV spreadsheets.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Document Intelligence for Invoices &amp; Contracts</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Upload PDF supplier price lists and vendor rate cards to extract contractual discounts and verify invoices automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
              >
                <span>Ask Your Business Questions in Plain English</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLAGSHIP SHOWCASE 3: What-If Scenario & Price Elasticity Simulator */}
      {/* ========================================================================= */}
      <section id="flagship-simulator" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5" />
              <span>Decision Sandbox</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              What-If Business Scenario Simulator Before Making Changes Live
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Never guess the revenue consequences of a price increase or a raw material surge.
              Our interactive simulator models price elasticity curves derived from your transaction history so you
              can make confident pricing decisions.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Historical Elasticity Calibration</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Calculates customer price sensitivity across individual categories to forecast exact volume drop-offs.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Supplier Price Hike Impact Modeling</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Simulate how a 6% supplier component inflation flows through wholesale tiers down to your bottom-line EBITDA.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Wholesale Volume Discount Break-Even Analysis</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Identify the exact quantity threshold required for bulk discounting without eroding net contribution margin.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/simulator"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                <span>Launch Interactive Decision Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual: Interactive Simulator Widget */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl border border-slate-200 shadow-xl bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-bold text-slate-900">Live Scenario Sandbox</h4>
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                  Interactive Preview
                </span>
              </div>

              {/* Slider 1: Price Change */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Projected Price Adjustment:</span>
                  <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {simulatedPrice > 0 ? `+${simulatedPrice}%` : `${simulatedPrice}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="20"
                  value={simulatedPrice}
                  onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>-10% (Discount)</span>
                  <span>Baseline (0%)</span>
                  <span>+20% (Markup)</span>
                </div>
              </div>

              {/* Slider 2: Supplier COGS Shift */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Supplier COGS Escalation:</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                    +{simulatedCost}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={simulatedCost}
                  onChange={(e) => setSimulatedCost(Number(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0% (Stable)</span>
                  <span>+7.5%</span>
                  <span>+15% (Inflation)</span>
                </div>
              </div>

              {/* Real-Time Outcome Calculation Card */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between text-xs font-bold tracking-wide uppercase text-slate-400">
                  <span>Simulated EBITDA Impact</span>
                  <span className="text-emerald-400">Calculated in 8ms</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[11px] text-slate-400">Projected Net Margin</div>
                    <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
                      <span>{projectedMargin}%</span>
                      <span className={`text-xs font-bold ${Number(projectedMargin) >= baseMargin ? "text-emerald-400" : "text-rose-400"}`}>
                        {Number(projectedMargin) >= baseMargin ? `+${(Number(projectedMargin) - baseMargin).toFixed(1)}%` : `${(Number(projectedMargin) - baseMargin).toFixed(1)}%`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400">Net Profit Variance</div>
                    <div className="text-2xl font-black text-white mt-0.5 flex items-baseline gap-1.5">
                      <span>{profitDelta >= 0 ? `+$${profitDelta.toLocaleString()}` : `-$${Math.abs(profitDelta).toLocaleString()}`}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Stockout Risk: <strong className="text-emerald-400">Under 3.2%</strong></span>
                  <span>Recommended Order Buffer: <strong className="text-white">+850 units</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FLAGSHIP SHOWCASE 4: Dynamic Inventory Optimization & EOQ */}
      {/* ========================================================================= */}
      <section id="flagship-inventory" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual: Image with Overlaid Badges */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/smart-warehouse.jpg"
                alt="Automated Smart Warehouse and Inventory Optimization"
                className="w-full h-80 sm:h-96 object-cover opacity-40"
              />

              {/* Floating Overlay Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Multi-Hub Inventory Balancer
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-slate-300">
                    Live Telemetry
                  </span>
                </div>

                {/* Warehouse Status List */}
                <div className="space-y-2.5 my-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Central Hub (Chicago, IL)</div>
                      <div className="text-[11px] text-slate-400">SKU Health: 94.2% Optimal</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Optimal Stock
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">East Regional (Newark, NJ)</div>
                      <div className="text-[11px] text-slate-400">Reorder triggered: Lead time 8 days</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      EOQ Reorder Sent
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">West Hub (Reno, NV)</div>
                      <div className="text-[11px] text-slate-400">Transfer recommended from Central Hub</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                      Inter-Hub Rebalance
                    </span>
                  </div>
                </div>

                {/* Bottom Metric Strip */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Stockouts</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">-64% Eliminated</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Holding Cost</div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">-18.5% Saved</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Turnover</div>
                    <div className="text-xs font-bold text-sky-400 mt-0.5">6.8x / Year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Boxes className="w-3.5 h-3.5" />
              <span>Operations &amp; Supply Chain</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Autonomous Dynamic EOQ &amp; Supplier Risk Intelligence
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Excess inventory ties up operating cash, while stockouts permanently destroy customer retention.
              MarginPilot AI dynamically computes the Economic Order Quantity (EOQ) for every SKU, adjusting reorder
              thresholds based on historical carrier delays and supplier reliability.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Dynamic Economic Order Quantity (EOQ)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuously balances unit holding expenses against order placement costs to maximize working capital.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Vendor Delivery Variance Scoring</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track vendor on-time fulfillment rates and automatically pad lead-time buffers for habitually late suppliers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Deadstock Liquidation Recommendations</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flag stagnant items older than 90 days and calculate optimal discount bundling before carrying costs exceed profit.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Explore Inventory Management Suite</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ALL CAPABILITIES EXPLORER (Interactive Filter Tabs) */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-200">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Comprehensive Engine Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Explore All 8 Core Intelligence Modules
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            From algorithmic financial calculations to automated customer churn prevention, discover how every module drives EBITDA expansion.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
            {[
              { id: "all", label: "All Modules (8)" },
              { id: "analytics", label: "Financial Analytics & Simulator" },
              { id: "ml", label: "Machine Learning & Deep Learning" },
              { id: "operations", label: "Supply Chain & Inventory" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredCapabilities.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 tracking-tight">{feat.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed min-h-[36px]">{feat.tagline}</p>

                  {/* Sample Live Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    {feat.metrics.map((m, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {m.label}
                        </span>
                        <span className="text-sm sm:text-base font-black text-slate-900 block">{m.value}</span>
                        <span className="text-[10px] font-bold text-emerald-600 block">{m.change}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 text-xs text-slate-700 pb-6">
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link
                    href={`/register?plan=growth`}
                    className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group"
                  >
                    <span>Launch in Free Trial</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <span className="text-[11px] text-slate-400 font-medium">Included in Growth &amp; Enterprise</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ENTERPRISE CLOUD & AI ARCHITECTURE BLUEPRINT */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-20 px-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Full-Stack Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Enterprise Cloud &amp; AI Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Engineered from the ground up for sub-millisecond analytical latency, multi-tenant database isolation,
              and distributed deep learning training pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Box 1 */}
            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3 hover:border-blue-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Neon Serverless PostgreSQL</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Serverless relational storage with Row-Level Security (RLS) ensuring strict organization tenant boundaries and instant branching.
              </p>
              <div className="text-[11px] text-blue-400 font-mono">pgvector • Dedicated Branches</div>
            </div>

            {/* Box 2 */}
            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3 hover:border-amber-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Upstash Redis Caching</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sub-millisecond TLS caching for rapid dashboard rendering, live telemetry streaming, and asynchronous background worker queues.
              </p>
              <div className="text-[11px] text-amber-400 font-mono">&lt; 10ms Cache Hit Latency</div>
            </div>

            {/* Box 3 */}
            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3 hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">PyTorch &amp; XGBoost MLOps</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                GPU-accelerated deep neural networks for demand prediction paired with gradient-boosted trees for explainable churn attribution.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">Automated Drift Retraining</div>
            </div>

            {/* Box 4 */}
            <div className="p-6 bg-slate-800/80 rounded-3xl border border-slate-700 space-y-3 hover:border-indigo-500 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Zero Public AI Training</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your proprietary business transactions, customer records, and supplier rates are never used to train public LLM models.
              </p>
              <div className="text-[11px] text-indigo-400 font-mono">SOC 2 &amp; GDPR Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PRE-FOOTER CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-10 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl relative z-10">
            <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Ready to Turn Raw Data into Guaranteed Margin Lift?
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
              Connect your data in 5 minutes with automated CSV/XLSX mapping, test our PyTorch demand forecasts,
              and see immediate profit expansion with our 30-day money-back guarantee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-black text-xs shadow-lg transition-all text-center flex items-center justify-center gap-2 group"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs border border-blue-500 transition-all text-center"
            >
              View Global Pricing
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
