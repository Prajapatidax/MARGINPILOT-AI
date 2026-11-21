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
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState<"all" | "ml" | "analytics" | "operations">("all");

  const features = [
    {
      id: "analytics",
      category: "analytics",
      title: "Real-Time Sales & Margin Analytics",
      badge: "Financial Intelligence",
      description:
        "Execute sub-second queries across millions of order lines. Understand your actual gross profit, net margin, and average order value across stores, categories, and channels.",
      metrics: [
        { label: "Gross Margin", value: "37.2%", change: "+1.8%" },
        { label: "Revenue", value: "$248,750", change: "+12.5%" },
        { label: "Profit Growth", value: "+32.0%", change: "YoY" },
      ],
      points: [
        "Dynamic period comparisons (PoP, YoY, custom fiscal quarters)",
        "Granular category and warehouse profitability drill-down",
        "Direct SQL validation ensuring 100% mathematical accuracy",
      ],
      icon: LineChart,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "churn",
      category: "ml",
      title: "Predictive Customer Churn Engine",
      badge: "XGBoost + SHAP",
      description:
        "Detect customer churn risk weeks before it happens. Model behavioral signals including RFM metrics, order cadence drops, and support ticket frequency.",
      metrics: [
        { label: "Model Accuracy", value: "91.4%", change: "F1 0.89" },
        { label: "At-Risk Detected", value: "128", change: "78% risk" },
        { label: "Retention Impact", value: "+14.2%", change: "Saved" },
      ],
      points: [
        "SHAP value explanations highlighting the top 3 drivers per customer",
        "Automated VIP vs. Regular vs. Churned segmentation",
        "Actionable intervention playbooks with CRM sync",
      ],
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      id: "forecasting",
      category: "ml",
      title: "Multi-Horizon Demand Forecasting",
      badge: "Deep Learning LSTM",
      description:
        "Train PyTorch LSTM models on historical sales velocities, seasonality indices, promotions, and lead-time variability to forecast demand up to 90 days ahead.",
      metrics: [
        { label: "Forecast MAPE", value: "8.7%", change: "Top tier" },
        { label: "Horizon", value: "30-90 Days", change: "Daily/Weekly" },
        { label: "Safety Buffer", value: "-22%", change: "Optimized" },
      ],
      points: [
        "Confidence intervals (P10, P50, P90) accounting for market uncertainty",
        "Promotional lift and holiday spike decomposition",
        "Automated retrain triggers on dataset drift detection",
      ],
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "inventory",
      category: "operations",
      title: "Dynamic Inventory Optimization",
      badge: "Operations Intelligence",
      description:
        "Eliminate stockouts and deadstock with automated reorder calculations based on lead times, supplier reliability, and predicted sales velocity.",
      metrics: [
        { label: "Stockout Risk", value: "-64%", change: "Reduced" },
        { label: "Carrying Cost", value: "-18.5%", change: "Saved" },
        { label: "Turnover Rate", value: "6.8x", change: "Annual" },
      ],
      points: [
        "Automated safety stock and economic order quantity (EOQ) updates",
        "Multi-warehouse transfer recommendations before stock runs dry",
        "Fast-moving vs. slow-moving inventory classification",
      ],
      icon: Boxes,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      id: "copilot",
      category: "analytics",
      title: "AI Copilot with Verified SQL Grounding",
      badge: "Gemini 2.5 Flash + RAG",
      description:
        "Ask plain-English questions about your business and receive verified analytical answers grounded in real database queries with interactive data tables.",
      metrics: [
        { label: "Model", value: "Gemini 2.5", change: "Fast & Accurate" },
        { label: "Verification", value: "100%", change: "Zero Hallucination" },
        { label: "Latency", value: "< 1.2s", change: "Streamed" },
      ],
      points: [
        "Multi-step query generation with strict read-only execution guardrails",
        "Document intelligence querying contracts, receipts, and invoices",
        "Contextual recommendations on pricing and stock reorders",
      ],
      icon: Bot,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      id: "simulator",
      category: "analytics",
      title: "What-If Business Scenario Simulator",
      badge: "Decision Automation",
      description:
        "Simulate price adjustments, supplier cost shifts, and demand changes before executing them in the market. See exact projected impact on revenue and gross margin.",
      metrics: [
        { label: "Simulated Margin", value: "38.1%", change: "+0.9%" },
        { label: "Profit Change", value: "+$5,730", change: "+6.2%" },
        { label: "Risk Score", value: "Low", change: "Stockout < 5%" },
      ],
      points: [
        "Elasticity models derived from historical price change experiments",
        "Wholesale tier volume discount curves",
        "Automated reorder buffer recommendations under simulated demand surges",
      ],
      icon: Sliders,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      id: "anomalies",
      category: "ml",
      title: "Operational Anomaly & Fraud Detection",
      badge: "Isolation Forest + Autoencoders",
      description:
        "Continually scan transactions, return spikes, supplier price jumps, and inventory discrepancies. Detect irregularities before they hurt EBITDA.",
      metrics: [
        { label: "F1-Score", value: "94.1%", change: "Trained" },
        { label: "False Positive", value: "< 1.5%", change: "Calibrated" },
        { label: "Detection Time", value: "Real-time", change: "Zero delay" },
      ],
      points: [
        "Unsupervised autoencoder embeddings detecting subtle multidimensional fraud",
        "Sudden discount overrides and return velocity alerts",
        "Supplier price invoice mismatch detection",
      ],
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      id: "suppliers",
      category: "operations",
      title: "Supplier Lead-Time & Risk Intelligence",
      badge: "Supply Chain",
      description:
        "Score suppliers on on-time delivery percentages, defect rates, and price consistency. Factor vendor volatility directly into your demand buffers.",
      metrics: [
        { label: "Tracked Vendors", value: "48", change: "Active" },
        { label: "Lead-Time Drift", value: "-1.8 Days", change: "Predicted" },
        { label: "Defect Rate", value: "0.4%", change: "Monitored" },
      ],
      points: [
        "Automated Purchase Order (PO) fulfillment tracking",
        "Predictive delays based on seasonal carrier bottlenecks",
        "Alternative supplier recommendations when lead times spike",
      ],
      icon: Truck,
      color: "text-teal-600 bg-teal-50 border-teal-200",
    },
  ];

  const filteredFeatures =
    activeTab === "all" ? features : features.filter((f) => f.category === activeTab);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero */}
      <section className="pt-16 pb-16 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          The MarginPilot AI Intelligence Suite
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
          Everything You Need to <span className="text-blue-600">Grow Margins</span> with AI
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          No hardcoded metrics. No generic LLM hallucinations. MarginPilot AI combines real machine learning, deep neural networks, and verified SQL database analytics into one integrated system.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          {[
            { id: "all", label: "All Capabilities" },
            { id: "analytics", label: "Financial Analytics" },
            { id: "ml", label: "Machine Learning & AI" },
            { id: "operations", label: "Operations & Supply Chain" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="pb-24 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={feat.id}
                className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">{feat.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{feat.description}</p>

                  {/* Sample Live Metrics Bar */}
                  <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    {feat.metrics.map((m, idx) => (
                      <div key={idx} className="space-y-0.5">
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                          {m.label}
                        </span>
                        <span className="text-base font-bold text-slate-900 block">{m.value}</span>
                        <span className="text-[11px] font-semibold text-emerald-600 block">{m.change}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bullet Highlights */}
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    {feat.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/demo`}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                  >
                    <span>See interactive demo</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-colors"
                  >
                    Try Feature
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cloud & ML Tech Architecture Banner */}
      <section className="bg-slate-50 border-y border-slate-200 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Enterprise Cloud &amp; AI Stack</h3>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              MarginPilot AI runs on dedicated serverless infrastructure engineered for high-concurrency intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <Database className="w-6 h-6 text-blue-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Neon PostgreSQL</h4>
              <p className="text-xs text-slate-500">Serverless relational database with Row-Level Security &amp; pgvector</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <Zap className="w-6 h-6 text-amber-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Upstash Redis</h4>
              <p className="text-xs text-slate-500">Sub-millisecond TLS caching &amp; high-throughput background jobs</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <Cpu className="w-6 h-6 text-indigo-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">PyTorch &amp; XGBoost</h4>
              <p className="text-xs text-slate-500">Native deep neural networks &amp; gradient boosted decision trees</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Tenant Isolation</h4>
              <p className="text-xs text-slate-500">Zero data leakage across organizations with encrypted S3 storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to boost your operating margins?</h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Connect your data in 5 minutes with automated CSV/XLSX schema mapping and start running predictions.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/demo"
              className="px-6 py-3 border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-semibold rounded-xl transition-colors"
            >
              Watch 5-Min Tour
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
