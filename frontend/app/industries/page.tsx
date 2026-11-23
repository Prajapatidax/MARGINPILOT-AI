"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Store,
  Factory,
  Building,
  Truck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Clock,
  ShieldCheck,
  Award,
  Check,
  ArrowUpRight,
  Boxes,
  Users,
  DollarSign,
  Sliders,
  Zap,
} from "lucide-react";
import MarketingNavbar from "@/components/layout/MarketingNavbar";
import MarketingFooter from "@/components/layout/MarketingFooter";

export default function IndustriesPage() {
  const [calcIndustry, setCalcIndustry] = useState<"retail" | "manufacturing" | "wholesale" | "distribution">("retail");
  const [calcRevenue, setCalcRevenue] = useState<number>(250000);

  // Dynamic ROI calculation based on selected industry and monthly volume
  const getRoiEstimates = () => {
    switch (calcIndustry) {
      case "retail":
        return {
          marginLift: "+2.8%",
          annualLift: Math.round(calcRevenue * 12 * 0.028),
          payback: "17 Days",
          primaryDriver: "Eliminating margin-cannibalizing promotions and reducing stockout shrinkage",
        };
      case "manufacturing":
        return {
          marginLift: "+3.4%",
          annualLift: Math.round(calcRevenue * 12 * 0.034),
          payback: "14 Days",
          primaryDriver: "BOM cost drift correction and predictive equipment scrap reduction",
        };
      case "wholesale":
        return {
          marginLift: "+3.1%",
          annualLift: Math.round(calcRevenue * 12 * 0.031),
          payback: "19 Days",
          primaryDriver: "Unbilled freight surcharge recovery and bulk price elasticity optimization",
        };
      case "distribution":
        return {
          marginLift: "+2.5%",
          annualLift: Math.round(calcRevenue * 12 * 0.025),
          payback: "21 Days",
          primaryDriver: "Multi-warehouse split shipment elimination and dynamic EOQ carrying reduction",
        };
    }
  };

  const roi = getRoiEstimates();

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-14 px-6 max-w-7xl mx-auto w-full text-center space-y-6">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>Tailored Intelligence For Your Exact Business Model</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
          Configured for How You{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Make Money.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Retailers, manufacturers, wholesale traders, and logistics distributors operate on completely different
          financial physics. MarginPilot AI delivers pre-calibrated machine learning models tailored to your industry.
        </p>

        {/* 4 Industry Quick-Jump Cards */}
        <div className="pt-8 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <a
            href="#retail"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Retail &amp; POS</div>
              <div className="text-[11px] text-slate-500">Store &amp; eCommerce</div>
            </div>
          </a>

          <a
            href="#manufacturing"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Manufacturing</div>
              <div className="text-[11px] text-slate-500">BOM &amp; Machine Yield</div>
            </div>
          </a>

          <a
            href="#wholesale"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-purple-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">Wholesale &amp; B2B</div>
              <div className="text-[11px] text-slate-500">Volume Contracts</div>
            </div>
          </a>

          <a
            href="#distribution"
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Distribution</div>
              <div className="text-[11px] text-slate-500">Multi-Hub Logistics</div>
            </div>
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE INDUSTRY ROI IMPACT ESTIMATOR */}
      {/* ========================================================================= */}
      <section className="py-10 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Interactive Industry Profit Simulator</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Calculate projected annual EBITDA expansion based on real customer deployment benchmarks.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 self-start sm:self-auto">
              Real-Time Model
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">1. Select Industry Model:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "retail", label: "Retail / POS" },
                    { id: "manufacturing", label: "Manufacturing" },
                    { id: "wholesale", label: "Wholesale B2B" },
                    { id: "distribution", label: "Distribution" },
                  ].map((ind) => (
                    <button
                      key={ind.id}
                      onClick={() => setCalcIndustry(ind.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-center ${
                        calcIndustry === ind.id
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>2. Monthly Order Volume:</span>
                  <span className="text-blue-600 font-mono" suppressHydrationWarning>
                    ${calcRevenue.toLocaleString("en-US")} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="25000"
                  value={calcRevenue}
                  onChange={(e) => setCalcRevenue(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$50k / mo</span>
                  <span>$500k / mo</span>
                  <span>$1M+ / mo</span>
                </div>
              </div>
            </div>

            {/* Right Projected Results Card */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                <span>Projected Financial Lift</span>
                <span className="text-emerald-400">Calibrated ROI</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-slate-400">Net Margin Delta</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
                    {roi.marginLift}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Annual Profit Expansion</div>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-0.5" suppressHydrationWarning>
                    +${roi.annualLift.toLocaleString("en-US")}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Expected Payback Period:</span>
                  <span className="font-bold text-amber-300">{roi.payback}</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  💡 <strong>Primary Lever:</strong> {roi.primaryDriver}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INDUSTRY 1: RETAIL & MULTI-STORE COMMERCE */}
      {/* ========================================================================= */}
      <section id="retail" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>Retail &amp; POS Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Retail &amp; Multi-Store Commerce
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Omnichannel retail requires balancing brick-and-mortar storefronts, eCommerce channels, seasonal
              discounting, and rapid inventory turns. MarginPilot AI ingests POS receipts and digital orders to catch
              unprofitable discounts and retain high-spending shoppers.
            </p>

            {/* Core Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>POS &amp; Channel Reconciliation</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Cross-compare gross margin and basket velocity across physical POS and digital checkout.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Promotion Cannibalization</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Isolate sales spikes to eliminate discounts that cannibalize standard full-margin purchases.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Shopper RFM Segmentation</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Segment shoppers into VIPs, regular repeat buyers, and at-risk churners with automated triggers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Return Velocity &amp; Shrinkage</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Flag abnormal return velocity, supplier defect batches, and cashier register-level shrinkage.
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-4">
              <img
                src="/images/sarah-lin.jpg"
                alt="Sarah Lin"
                className="w-12 h-12 rounded-xl object-cover border border-blue-300 shrink-0"
              />
              <div className="space-y-1">
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;MarginPilot AI identified three promotional discount codes that were eating 14% of our margin.
                  Adjusting the discount tiers generated $42,000 in additional profit in our first quarter.&rdquo;
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  Sarah Lin • <span className="text-blue-700 font-semibold">VP of Merchandising, Apex Fashion Retail</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Deploy Retail Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Overlaid Card */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/retail.jpg"
                alt="Retail Store and Omnichannel Commerce Intelligence"
                className="w-full h-80 sm:h-96 object-cover opacity-50"
              />

              {/* Glassmorphic UI Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                      Store Telemetry • 12 Active POS Terminals
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    +24.8% Margin Lift
                  </span>
                </div>

                <div className="space-y-2.5 my-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Store #04 (Downtown Flagship)</div>
                      <div className="text-[11px] text-slate-400">Basket Size: $78.40 • Margin: 39.2%</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+12.5% MoM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Discount Cannibalization Alert</div>
                      <div className="text-[11px] text-rose-300">Promo &apos;SUMMER15&apos; eroded $1,840 margin</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      Price Tweak Sent
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">VIP Shopper Churn Trigger</div>
                      <div className="text-[11px] text-slate-400">42 top spenders haven&apos;t ordered in 45 days</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Klaviyo Re-engagement
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Stockout Rate</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">&lt; 1.4%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Promo ROI</div>
                    <div className="text-xs font-bold text-blue-400 mt-0.5">+4.2x</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">VIP Retention</div>
                    <div className="text-xs font-bold text-sky-400 mt-0.5">88.2%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INDUSTRY 2: DISCRETE & PROCESS MANUFACTURING */}
      {/* ========================================================================= */}
      <section id="manufacturing" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Image & Overlaid Card */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/manufacturing.jpg"
                alt="Precision Manufacturing Assembly and BOM Intelligence"
                className="w-full h-80 sm:h-96 object-cover opacity-50"
              />

              {/* Glassmorphic UI Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      Plant Telemetry • Lines 1-6 Monitored
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    -31.5% Scrap Reduction
                  </span>
                </div>

                <div className="space-y-2.5 my-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Multi-Level BOM Cost Rollup</div>
                      <div className="text-[11px] text-slate-400">Steel billet price increase (+4.2%) factored into SKU #MN-820</div>
                    </div>
                    <span className="text-amber-400 font-bold font-mono">Cost Adjusted</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Machine 4 Calibration Drift Flagged</div>
                      <div className="text-[11px] text-emerald-300">Isolation forest detected micro-vibration variance</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Saved $180k
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">60-Day Component Procurement Buffer</div>
                      <div className="text-[11px] text-slate-400">Lead-time delay predicted for hydraulic seals (+8 days)</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                      Auto-Reordered
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Machine OEE</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">94.2%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Scrap Rate</div>
                    <div className="text-xs font-bold text-indigo-400 mt-0.5">0.6%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Payback Period</div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">18 Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Factory className="w-3.5 h-3.5" />
              <span>Manufacturing &amp; Production Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Discrete &amp; Process Manufacturing
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Manufacturing profitability depends on tight synchronization between raw material procurement,
              assembly line capacity, and scrap minimization. MarginPilot AI models multi-level BOMs and predicts
              component lead-time spikes before assembly lines stall.
            </p>

            {/* Core Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Multi-Level BOM Cost Rollups</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Instantly compute true production cost when sub-tier component vendor prices fluctuate.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Batch Yield &amp; Scrap Tracking</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Detect machine lines and shifts producing out-of-spec batches with isolation forest models.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Predictive Raw Material Buffer</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Forecast raw material demand 60-90 days out factoring vendor transit variability.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Machine Telemetry Anomaly</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Spot subtle vibration and temperature drifts that precede precision failure or catastrophic downtime.
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-4">
              <img
                src="/images/rajesh-mehta.jpg"
                alt="Rajesh Mehta"
                className="w-12 h-12 rounded-xl object-cover border border-indigo-300 shrink-0"
              />
              <div className="space-y-1">
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;The autoencoder anomaly detector spotted calibration drift in stamping machine 4 two weeks before
                  catastrophic failure. Saved us hundreds of thousands in warranty claims.&rdquo;
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  Rajesh Mehta • <span className="text-indigo-700 font-semibold">CEO, ABC Manufacturing</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Deploy Manufacturing Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INDUSTRY 3: WHOLESALE & B2B TRADING */}
      {/* ========================================================================= */}
      <section id="wholesale" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <Building className="w-3.5 h-3.5" />
              <span>Wholesale &amp; B2B Trading</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Wholesale &amp; Contract B2B Trading
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Wholesalers operate on razor-thin percentage margins where a 1% price miscalculation on bulk order volume
              destroys annual profitability. MarginPilot AI equips commercial teams with real-time margin simulators to
              negotiate volume contracts profitably.
            </p>

            {/* Core Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Bulk Tier Pricing Simulator</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Model tiered quantity break discounts against freight surcharges before sending customer quotes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Customer DSO &amp; Credit Risk</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Track days sales outstanding (DSO) and identify slowing accounts before credit limits are breached.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Rebate &amp; Surcharge Audit</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Ensure customer contract minimums are satisfied prior to quarter close and claim supplier rebates.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Order Fill Rate Optimization</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Prioritize constrained inventory to high-margin recurring accounts when factory backorders occur.
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-start gap-4">
              <img
                src="/images/david-morales.jpg"
                alt="David Morales"
                className="w-12 h-12 rounded-xl object-cover border border-purple-300 shrink-0"
              />
              <div className="space-y-1">
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;Before MarginPilot AI, our account reps were giving standard 12% discounts without realizing logistics
                  costs wiped out the profit. The What-If Simulator recovered over $180,000 in net margin.&rdquo;
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  David Morales • <span className="text-purple-700 font-semibold">Chief Commercial Officer, Global Wholesale Supplies</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Deploy Wholesale Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Overlaid Card */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/wholesale.jpg"
                alt="Wholesale B2B Bulk Pallets and Volume Order Management"
                className="w-full h-80 sm:h-96 object-cover opacity-50"
              />

              {/* Glassmorphic UI Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                      B2B Commercial Engine • Contract Telemetry
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    +$180K Margin Recovered
                  </span>
                </div>

                <div className="space-y-2.5 my-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Pallet Bulk Tier Simulator</div>
                      <div className="text-[11px] text-slate-400">Quantity 500 units @ $42.00 (Break-even: 380 units)</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">+6.4% Net Margin</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Unbilled Freight Surcharge Flagged</div>
                      <div className="text-[11px] text-rose-300">Liftgate delivery fee ($145) missing from invoice #INV-9201</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                      Recovered
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Account Credit Health: DSO 28 Days</div>
                      <div className="text-[11px] text-slate-400">Pinnacle Distributing approved for $120k revolving credit</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                      Low Default Risk
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Avg Contract Margin</div>
                    <div className="text-xs font-bold text-purple-400 mt-0.5">34.8%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Fill Rate</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">99.1%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Rebate Claimed</div>
                    <div className="text-xs font-bold text-amber-400 mt-0.5">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INDUSTRY 4: DISTRIBUTION & MULTI-WAREHOUSE LOGISTICS */}
      {/* ========================================================================= */}
      <section id="distribution" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-slate-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Image & Overlaid Card */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 relative">
              <img
                src="/images/distribution.jpg"
                alt="Distribution Fleet Trucks and Multi-Warehouse Logistics"
                className="w-full h-80 sm:h-96 object-cover opacity-50"
              />

              {/* Glassmorphic UI Card */}
              <div className="absolute inset-4 sm:inset-6 flex flex-col justify-between bg-slate-900/85 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Multi-Hub Network • 4 Distribution Hubs
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    -22.4% Carrying Costs
                  </span>
                </div>

                <div className="space-y-2.5 my-2">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Inter-Hub Transfer Recommended</div>
                      <div className="text-[11px] text-slate-400">Move 450 units Chicago → Dallas (Prevents regional stockout)</div>
                    </div>
                    <span className="text-emerald-400 font-bold font-mono">Transfer Queued</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Carrier SLA Drift Detected</div>
                      <div className="text-[11px] text-amber-300">Carrier X on-time rate dropped to 84% on Midwest route</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                      Rerouted
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">Deadstock Pick-Bin Liquidation</div>
                      <div className="text-[11px] text-slate-400">SKU #DS-418 stagnant for 110 days (Freeing 4 pick bins)</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-bold">
                      Bundle Promo Sent
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Inventory Turnover</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">6.3x / Year</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">Split Shipments</div>
                    <div className="text-xs font-bold text-blue-400 mt-0.5">-40.2%</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <div className="text-[10px] text-slate-400">On-Time SLA</div>
                    <div className="text-xs font-bold text-indigo-400 mt-0.5">98.6%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text */}
          <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics &amp; Fulfillment Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Distribution &amp; Multi-Hub Logistics
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Operating regional fulfillment hubs requires proactive stock balancing and vigilant freight carrier oversight.
              MarginPilot AI anticipates local demand surges and orchestrates low-cost inter-warehouse stock rebalancing to
              eliminate expensive split-shipments.
            </p>

            {/* Core Capabilities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inter-Hub Stock Balancing</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Spot localized stockout risks early and route inventory transfers via the lowest-cost freight lanes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Carrier Lead-Time Drift</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Monitor transit variance across carriers and automatically reassign loads when delays threaten SLAs.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Deadstock Pick-Bin Audits</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Identify slow pallets consuming premium storage slots and trigger optimal liquidation bundles.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dynamic Safety Buffer Tuning</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-6">
                  Autonomously calibrate safety stock ahead of port congestion, weather patterns, and holiday peaks.
                </p>
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-4">
              <img
                src="/images/elena-rostova.jpg"
                alt="Elena Rostova"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-300 shrink-0"
              />
              <div className="space-y-1">
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;We cut split-shipments across our 4 regional distribution hubs by over 40% in two months.
                  Our inventory turnover increased from 4.1x to 6.3x with zero stockouts.&rdquo;
                </p>
                <div className="text-[11px] font-bold text-slate-900">
                  Elena Rostova • <span className="text-emerald-700 font-semibold">VP of Supply Chain, TransContinental Logistics</span>
                </div>
              </div>
            </div>

            <div>
              <Link
                href="/register?plan=growth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Deploy Distribution Module</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ENTERPRISE INTEGRATION BLUEPRINT */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white py-16 px-6 border-y border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Hybrid &amp; Multi-Entity Workspaces</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Do you operate a hybrid business model?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              MarginPilot AI natively bridges hybrid entities — such as manufacturers selling direct-to-consumer
              or wholesale distributors operating regional cash-and-carry stores. Connect Shopify, WooCommerce, SAP,
              NetSuite, or custom CSV/REST data pipelines simultaneously.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/contact?type=enterprise"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Speak with Solutions Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors text-center"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
